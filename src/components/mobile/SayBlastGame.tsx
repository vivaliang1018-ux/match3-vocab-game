import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { AnimatePresence, motion } from 'motion/react';
import { Mic, MicOff, Pause, Play, RotateCcw, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import type { Locale } from '../../i18n';
import {
  addAppleSpeechLevelListener,
  addAppleSpeechResultListener,
  addAppleSpeechStateListener,
  beginAppleSpeechAnswer,
  checkAppleSpeechPermissions,
  isAppleSpeechRecognitionAvailable,
  requestAppleSpeechPermissions,
  playAppleSpeechCountdownTone,
  startAppleSpeechRecognition,
  stopAppleSpeechRecognition,
  type AppleSpeechResult,
} from '../../lib/appleSpeechRecognition';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import {
  loadSfxEnabled,
  playSayBlastCountdownBeep,
  playSayBlastCountdownStartChime,
  playSayBlastExplosionSfx,
} from '../../lib/gameSfx';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  loadSayBlastStats,
  recordSayBlastAttemptStarted,
  recordSayBlastBlasted,
  recordSayBlastRoundCompleted,
  sayBlastAttemptMilestone,
  type SayBlastStats,
} from '../../lib/sayBlastStats';
import type { WordItem } from '../../types/game';
import { cn } from '../../lib/utils';

const LANE_COUNT = 6;
const DROP_SIZE = 52;
const NEXT_DROP_DELAY_MS = 360;
const RUSH_DROP_DELAY_MS = 100;
const GAME_DURATION_SECONDS = 60;
const RUSH_DURATION_SECONDS = 20;
const RUSH_SPEED_MULTIPLIER = 1.75;
const NORMAL_DROP_START_MULTIPLIER = 1.05;
const NORMAL_DROP_END_MULTIPLIER = 1.55;
const BASE_DROP_SPEED = 54;
const TUTORIAL_SPEED_MULTIPLIER = 0.58;
const SPEECH_SILENCE_SETTLE_MS = 900;
const MIN_WRONG_ANSWER_CONFIDENCE = 0.55;
const LANDING_SPEECH_GRACE_MS = 650;
const HEARD_TEXT_VISIBLE_MS = 1600;
const PROJECTILE_MS = 360;
const TUTORIAL_SEEN_KEY = 'matchingo-say-blast-tutorial-seen-v1';
const PROJECTILES = ['☄️', '🚀', '🧟', '👾'] as const;
const SPOKEN_NUMBER_TOKENS: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  '1st': 'first',
  '2nd': 'second',
  '3rd': 'third',
};

/** Common on-device ASR mishearings accepted as the target word. */
const SPEECH_TARGET_ALIASES: Record<string, readonly string[]> = {
  // Hut's short /ʌ/ is frequently transcribed as Hot (or Hat).
  hut: ['hot', 'hat'],
};

type DropStatus = 'falling' | 'checking' | 'targeted' | 'settled';

type FallingEmoji = {
  id: string;
  item: WordItem;
  lane: number;
  y: number;
  speed: number;
  status: DropStatus;
  spawnedAt: number;
  recognitionCycleId: number;
};

type Projectile = {
  id: number;
  emoji: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

type Explosion = {
  id: number;
  x: number;
  y: number;
};

type CenterPrompt = {
  id: number;
  text: string;
  detail?: string;
};

type PermissionPhase = 'requesting' | 'ready' | 'denied' | 'unsupported' | 'error';
type AnswerSession = {
  dropId: string;
  target: string;
  cycleId: number;
  resolved: boolean;
  transcript: string;
  confidence: number | null;
};

type GameResult = {
  kind: 'success' | 'failure';
  stars: 0 | 1 | 2 | 3;
  accuracy: number | null;
  bestStreak: number;
  blasted: number;
  missed: number;
  staminaReward: 'granted' | 'banked' | 'daily-limit' | null;
  ratingTip: string;
  attemptNumber: number;
  careerTotalBlasted: number;
  milestone: number | null;
  newBestAccuracy: boolean;
  newBestStreak: boolean;
};

type TutorialPhase = 'intro' | 'practice' | 'complete' | null;

type Copy = {
  title: string;
  score: string;
  cleared: string;
  listening: string;
  preparing: string;
  permissionTitle: string;
  permissionBody: string;
  unsupportedTitle: string;
  unsupportedBody: string;
  retryPermission: string;
  learnedNeededTitle: string;
  learnedNeededBody: string;
  gameOver: string;
  tryAgain: string;
  exit: string;
  start: string;
  pause: string;
  paused: string;
  time: string;
  rush: string;
  successTitle: string;
  threeStarTitle: string;
  successBody: string;
  failureTitle: string;
  accuracy: string;
  bestStreak: string;
  blasted: string;
  missed: string;
  staminaReward: string;
  staminaBanked: string;
  staminaDailyLimit: string;
  staminaRule: string;
  staminaAlmost: string;
  staminaFailureEncouragement: string;
  startGame: string;
  getReady: string;
  nextGoal: string;
  clearMore: (count: number) => string;
  accuracyGoal: (percent: number) => string;
  tutorialTitle: string;
  tutorialBody: string;
  tutorialPractice: string;
  tutorialProgress: (cleared: number) => string;
  tutorialCompleteTitle: string;
  tutorialCompleteBody: string;
  tutorialContinue: string;
  attemptNumber: (number: number) => string;
  challengeCompleted: (number: number) => string;
  careerBlasted: (number: number) => string;
  milestoneReached: (number: number) => string;
  newAccuracyRecord: string;
  newStreakRecord: string;
  newBest: string;
};

const EN_COPY: Copy = {
  title: 'Say & Blast',
  score: 'Score',
  cleared: 'Cleared',
  listening: 'Listening…',
  preparing: 'Preparing speech recognition…',
  permissionTitle: 'Microphone access needed',
  permissionBody:
    'Allow Microphone and Speech Recognition in iOS Settings to play Say & Blast.',
  unsupportedTitle: 'On-device speech unavailable',
  unsupportedBody:
    'Say & Blast requires Apple’s on-device English speech recognition. It is unavailable on this device.',
  retryPermission: 'Check again',
  learnedNeededTitle: 'Learn an Emoji first',
  learnedNeededBody: 'Finish an Adventure quiz, then your learned Emojis can appear here.',
  gameOver: 'Stack reached the danger line!',
  tryAgain: 'Try Again',
  exit: 'Exit',
  start: 'Start',
  pause: 'Pause',
  paused: 'Paused',
  time: 'Time',
  rush: 'FINAL RUSH!',
  successTitle: 'You Survived!',
  threeStarTitle: 'Three-star challenge complete!',
  successBody: 'You lasted the full 60 seconds!',
  failureTitle: 'Game Over',
  accuracy: 'Accuracy',
  bestStreak: 'Best Streak',
  blasted: 'Blasted',
  missed: 'Missed',
  staminaReward: '+1 stamina earned!',
  staminaBanked: '+1 stamina saved for later!',
  staminaDailyLimit: 'Daily stamina reward limit reached (3/3).',
  staminaRule: 'Earn 3 stars for +1 ❤️ · 80%+ accuracy · Max 3/day',
  staminaAlmost: 'Almost there! Reach 3 stars to earn stamina.',
  staminaFailureEncouragement: 'Keep going! Survive the round and reach 3 stars to earn stamina.',
  startGame: 'Start Game',
  getReady: 'Get ready!',
  nextGoal: 'Next goal',
  clearMore: (count) => `Clear ${count} more ${count === 1 ? 'emoji' : 'emojis'}`,
  accuracyGoal: (percent) => `Reach ${percent}% accuracy`,
  tutorialTitle: 'Quick Voice Practice',
  tutorialBody:
    'Say the English word for 3 slow emojis. A correct word launches the attack.',
  tutorialPractice: 'Start Practice',
  tutorialProgress: (cleared) => `${cleared}/3 practice hits`,
  tutorialCompleteTitle: 'Ready to Blast!',
  tutorialCompleteBody:
    'Now survive for 60 seconds. The final 20 seconds speed up.',
  tutorialContinue: 'Continue',
  attemptNumber: (number) => `Challenge #${number}`,
  challengeCompleted: (number) => `Challenge #${number} complete`,
  careerBlasted: (number) => `${number} ${number === 1 ? 'emoji' : 'emojis'} blasted in total`,
  milestoneReached: (number) => `${number} speaking challenges! Keep going!`,
  newAccuracyRecord: 'New accuracy record!',
  newStreakRecord: 'New streak record!',
  newBest: 'NEW BEST',
};

const ZH_COPY: Copy = {
  title: '开口出击',
  score: '分数',
  cleared: '消除',
  listening: '正在听…',
  preparing: '正在准备语音识别…',
  permissionTitle: '需要麦克风权限',
  permissionBody: '请在 iOS 设置中允许麦克风和语音识别，才能游玩开口出击。',
  unsupportedTitle: '无法使用设备端语音识别',
  unsupportedBody: '开口出击需要 Apple 的设备端英语语音识别，此设备暂不支持。',
  retryPermission: '重新检查',
  learnedNeededTitle: '先学习一个 emoji',
  learnedNeededBody: '完成一组闯关小测后，已学习的 emoji 就会出现在这里。',
  gameOver: '堆叠超过警戒线！',
  tryAgain: '再来一次',
  exit: '退出',
  start: '开始',
  pause: '暂停',
  paused: '已暂停',
  time: '时间',
  rush: '最后冲刺！',
  successTitle: '坚持成功！',
  threeStarTitle: '三星挑战完成！',
  successBody: '你成功坚持了 60 秒！',
  failureTitle: '挑战失败',
  accuracy: '正确率',
  bestStreak: '最佳连对',
  blasted: '已炸掉',
  missed: '未命中',
  staminaReward: '体力 +1！',
  staminaBanked: '体力 +1 已暂存！',
  staminaDailyLimit: '今日奖励体力已达上限（3/3）',
  staminaRule: '三星通关 · +1 体力 · 正确率 80%+ · 每天最多 3 次',
  staminaAlmost: '还差一点！三星通关即可 +1 体力',
  staminaFailureEncouragement: '继续加油！坚持完成并达到三星，即可 +1 体力',
  startGame: '开始游戏',
  getReady: '准备！',
  nextGoal: '下次目标',
  clearMore: (count) => `再消除 ${count} 个 emoji`,
  accuracyGoal: (percent) => `正确率达到 ${percent}%`,
  tutorialTitle: '快速语音练习',
  tutorialBody: '先用3个慢速 emoji 练习。读出对应英文，武器就会自动发射。',
  tutorialPractice: '开始练习',
  tutorialProgress: (cleared) => `练习命中 ${cleared}/3`,
  tutorialCompleteTitle: '准备出击！',
  tutorialCompleteBody: '正式局需要坚持60秒，最后20秒会加速。',
  tutorialContinue: '继续',
  attemptNumber: (number) => `第 ${number} 次挑战`,
  challengeCompleted: (number) => `完成第 ${number} 次挑战`,
  careerBlasted: (number) => `累计炸掉 ${number} 个 emoji`,
  milestoneReached: (number) => `第 ${number} 次开口挑战！继续保持！`,
  newAccuracyRecord: '正确率刷新纪录！',
  newStreakRecord: '连对数刷新纪录！',
  newBest: '新纪录',
};

const ES_COPY: Copy = {
  title: 'Di y dispara', score: 'Puntuación', cleared: 'Eliminados', listening: 'Escuchando…', preparing: 'Preparando el reconocimiento de voz…',
  permissionTitle: 'Se necesita acceso al micrófono', permissionBody: 'Permite el acceso al micrófono y al reconocimiento de voz en los ajustes de iOS para jugar.',
  unsupportedTitle: 'Voz en el dispositivo no disponible', unsupportedBody: 'Di y dispara necesita el reconocimiento de voz en inglés en el dispositivo de Apple, que no está disponible aquí.', retryPermission: 'Comprobar de nuevo',
  learnedNeededTitle: 'Primero aprende un Emoji', learnedNeededBody: 'Completa un quiz de Aventura para que tus Emojis aprendidos aparezcan aquí.',
  gameOver: '¡La pila alcanzó la línea de peligro!', tryAgain: 'Intentar de nuevo', exit: 'Salir', start: 'Comenzar', pause: 'Pausa', paused: 'En pausa', time: 'Tiempo', rush: '¡SPRINT FINAL!',
  successTitle: '¡Has sobrevivido!', threeStarTitle: '¡Desafío de tres estrellas completado!', successBody: '¡Has aguantado los 60 segundos!', failureTitle: 'Fin de la partida',
  accuracy: 'Precisión', bestStreak: 'Mejor racha', blasted: 'Derribados', missed: 'Fallados', staminaReward: '¡Has ganado +1 de energía!', staminaBanked: '¡Has guardado +1 de energía para después!', staminaDailyLimit: 'Has alcanzado el límite diario de energía (3/3).',
  staminaRule: 'Consigue 3 estrellas para ganar +1 ❤️ · 80 % o más de precisión · Máx. 3 al día', staminaAlmost: '¡Casi! Consigue 3 estrellas para ganar energía.', staminaFailureEncouragement: '¡Sigue así! Sobrevive a la ronda y consigue 3 estrellas para ganar energía.',
  startGame: 'Comenzar partida', getReady: '¡Prepárate!', nextGoal: 'Siguiente objetivo', clearMore: n => `Elimina ${n} ${n === 1 ? 'Emoji más' : 'Emojis más'}`, accuracyGoal: n => `Alcanza un ${n} % de precisión`,
  tutorialTitle: 'Práctica rápida de voz', tutorialBody: 'Di la palabra en inglés de 3 Emojis lentos. Una respuesta correcta lanza el ataque.', tutorialPractice: 'Comenzar práctica', tutorialProgress: n => `${n}/3 aciertos de práctica`, tutorialCompleteTitle: '¡Listo para disparar!', tutorialCompleteBody: 'Ahora sobrevive durante 60 segundos. Los últimos 20 segundos son más rápidos.', tutorialContinue: 'Continuar',
  attemptNumber: n => `Desafío n.º ${n}`, challengeCompleted: n => `Desafío n.º ${n} completado`, careerBlasted: n => `${n} ${n === 1 ? 'Emoji derribado' : 'Emojis derribados'} en total`, milestoneReached: n => `¡${n} desafíos de voz! ¡Sigue así!`, newAccuracyRecord: '¡Nuevo récord de precisión!', newStreakRecord: '¡Nuevo récord de racha!', newBest: 'NUEVO RÉCORD',
};

const FR_COPY: Copy = {
  title: 'Dis et explose', score: 'Score', cleared: 'Éliminés', listening: 'Écoute…', preparing: 'Préparation de la reconnaissance vocale…',
  permissionTitle: 'Accès au microphone requis', permissionBody: 'Autorise le microphone et la reconnaissance vocale dans les réglages iOS pour jouer.', unsupportedTitle: 'Reconnaissance locale indisponible', unsupportedBody: 'Dis et explose nécessite la reconnaissance vocale anglaise locale d’Apple, indisponible sur cet appareil.', retryPermission: 'Vérifier à nouveau',
  learnedNeededTitle: 'Apprends d’abord un Emoji', learnedNeededBody: 'Termine un quiz Aventure pour que tes Emojis appris apparaissent ici.', gameOver: 'La pile a atteint la ligne de danger !', tryAgain: 'Réessayer', exit: 'Quitter', start: 'Démarrer', pause: 'Pause', paused: 'En pause', time: 'Temps', rush: 'SPRINT FINAL !',
  successTitle: 'Tu as survécu !', threeStarTitle: 'Défi trois étoiles terminé !', successBody: 'Tu as tenu pendant 60 secondes !', failureTitle: 'Partie terminée', accuracy: 'Précision', bestStreak: 'Meilleure série', blasted: 'Explosés', missed: 'Manqués',
  staminaReward: '+1 énergie gagnée !', staminaBanked: '+1 énergie mise de côté !', staminaDailyLimit: 'Limite quotidienne d’énergie atteinte (3/3).', staminaRule: 'Obtiens 3 étoiles pour gagner +1 ❤️ · Précision de 80 % ou plus · Max. 3/jour', staminaAlmost: 'Presque ! Obtiens 3 étoiles pour gagner de l’énergie.', staminaFailureEncouragement: 'Continue ! Survis à la manche et obtiens 3 étoiles pour gagner de l’énergie.',
  startGame: 'Démarrer la partie', getReady: 'Prépare-toi !', nextGoal: 'Prochain objectif', clearMore: n => `Élimine encore ${n} ${n === 1 ? 'Emoji' : 'Emojis'}`, accuracyGoal: n => `Atteins ${n} % de précision`, tutorialTitle: 'Entraînement vocal rapide', tutorialBody: 'Prononce le mot anglais de 3 Emojis lents. Une bonne réponse lance l’attaque.', tutorialPractice: 'Commencer l’entraînement', tutorialProgress: n => `${n}/3 réussites`, tutorialCompleteTitle: 'Prêt à exploser !', tutorialCompleteBody: 'Survis maintenant pendant 60 secondes. Les 20 dernières secondes accélèrent.', tutorialContinue: 'Continuer',
  attemptNumber: n => `Défi n° ${n}`, challengeCompleted: n => `Défi n° ${n} terminé`, careerBlasted: n => `${n} ${n === 1 ? 'Emoji explosé' : 'Emojis explosés'} au total`, milestoneReached: n => `${n} défis vocaux ! Continue !`, newAccuracyRecord: 'Nouveau record de précision !', newStreakRecord: 'Nouveau record de série !', newBest: 'NOUVEAU RECORD',
};

const DE_COPY: Copy = {
  title: 'Sprechen & Treffen', score: 'Punkte', cleared: 'Entfernt', listening: 'Hört zu…', preparing: 'Spracherkennung wird vorbereitet…', permissionTitle: 'Mikrofonzugriff erforderlich', permissionBody: 'Erlaube Mikrofon und Spracherkennung in den iOS-Einstellungen, um zu spielen.', unsupportedTitle: 'Lokale Spracherkennung nicht verfügbar', unsupportedBody: 'Sprechen & Treffen benötigt Apples lokale englische Spracherkennung, die auf diesem Gerät nicht verfügbar ist.', retryPermission: 'Erneut prüfen',
  learnedNeededTitle: 'Lerne zuerst ein Emoji', learnedNeededBody: 'Schließe ein Abenteuer-Quiz ab, damit deine gelernten Emojis hier erscheinen.', gameOver: 'Der Stapel hat die Gefahrenlinie erreicht!', tryAgain: 'Noch einmal', exit: 'Beenden', start: 'Start', pause: 'Pause', paused: 'Pausiert', time: 'Zeit', rush: 'ENDSPURT!', successTitle: 'Du hast überlebt!', threeStarTitle: 'Drei-Sterne-Challenge geschafft!', successBody: 'Du hast die vollen 60 Sekunden durchgehalten!', failureTitle: 'Spiel vorbei',
  accuracy: 'Genauigkeit', bestStreak: 'Beste Serie', blasted: 'Getroffen', missed: 'Verfehlt', staminaReward: '+1 Energie verdient!', staminaBanked: '+1 Energie für später gespeichert!', staminaDailyLimit: 'Tägliches Energielimit erreicht (3/3).', staminaRule: '3 Sterne bringen +1 ❤️ · Mindestens 80 % Genauigkeit · Max. 3/Tag', staminaAlmost: 'Fast! Erreiche 3 Sterne, um Energie zu verdienen.', staminaFailureEncouragement: 'Weiter so! Überstehe die Runde und erreiche 3 Sterne, um Energie zu verdienen.',
  startGame: 'Spiel starten', getReady: 'Mach dich bereit!', nextGoal: 'Nächstes Ziel', clearMore: n => `Entferne noch ${n} ${n === 1 ? 'Emoji' : 'Emojis'}`, accuracyGoal: n => `Erreiche ${n} % Genauigkeit`, tutorialTitle: 'Kurzes Sprechtraining', tutorialBody: 'Sprich das englische Wort für 3 langsame Emojis. Eine richtige Antwort startet den Angriff.', tutorialPractice: 'Training starten', tutorialProgress: n => `${n}/3 Trainingstreffer`, tutorialCompleteTitle: 'Bereit zum Treffen!', tutorialCompleteBody: 'Halte jetzt 60 Sekunden durch. Die letzten 20 Sekunden werden schneller.', tutorialContinue: 'Weiter',
  attemptNumber: n => `Challenge Nr. ${n}`, challengeCompleted: n => `Challenge Nr. ${n} geschafft`, careerBlasted: n => `${n} ${n === 1 ? 'Emoji' : 'Emojis'} insgesamt getroffen`, milestoneReached: n => `${n} Sprech-Challenges! Weiter so!`, newAccuracyRecord: 'Neuer Genauigkeitsrekord!', newStreakRecord: 'Neuer Serienrekord!', newBest: 'NEUER REKORD',
};

const JA_COPY: Copy = {
  title: '声でブラスト', score: 'スコア', cleared: '消去', listening: '聞き取り中…', preparing: '音声認識を準備中…', permissionTitle: 'マイクへのアクセスが必要です', permissionBody: 'プレイするには、iOSの設定でマイクと音声認識を許可してください。', unsupportedTitle: '端末内音声認識を利用できません', unsupportedBody: 'この機能に必要なAppleの端末内英語音声認識は、このデバイスでは利用できません。', retryPermission: 'もう一度確認',
  learnedNeededTitle: 'まず絵文字を1つ学ぼう', learnedNeededBody: '冒険クイズを完了すると、学習した絵文字がここに表示されます。', gameOver: '積み上がった絵文字が危険ラインに到達！', tryAgain: 'もう一度', exit: '終了', start: '開始', pause: '一時停止', paused: '一時停止中', time: '時間', rush: 'ラストスパート！', successTitle: '生き残りました！', threeStarTitle: '星3チャレンジ完了！', successBody: '60秒間耐え抜きました！', failureTitle: 'ゲームオーバー',
  accuracy: '正確率', bestStreak: '最高連続正解', blasted: '撃破', missed: 'ミス', staminaReward: '体力を1獲得！', staminaBanked: '体力を1、あとで使えるように保存しました！', staminaDailyLimit: '1日の体力報酬上限に達しました（3/3）。', staminaRule: '星3で体力 +1 ❤️ · 正確率80%以上 · 1日最大3回', staminaAlmost: 'あと少し！星3を獲得すると体力がもらえます。', staminaFailureEncouragement: 'その調子！最後まで生き残り、星3を獲得して体力をもらおう。',
  startGame: 'ゲーム開始', getReady: '準備！', nextGoal: '次の目標', clearMore: n => `あと${n}個の絵文字を消す`, accuracyGoal: n => `正確率${n}%を達成`, tutorialTitle: 'かんたん音声練習', tutorialBody: 'ゆっくり落ちる3個の絵文字の英語名を言いましょう。正解すると攻撃します。', tutorialPractice: '練習開始', tutorialProgress: n => `練習ヒット ${n}/3`, tutorialCompleteTitle: 'ブラスト準備完了！', tutorialCompleteBody: '60秒間生き残りましょう。最後の20秒はスピードアップします。', tutorialContinue: '続ける',
  attemptNumber: n => `チャレンジ #${n}`, challengeCompleted: n => `チャレンジ #${n} 完了`, careerBlasted: n => `累計${n}個の絵文字を撃破`, milestoneReached: n => `音声チャレンジ${n}回達成！その調子！`, newAccuracyRecord: '正確率の新記録！', newStreakRecord: '連続正解の新記録！', newBest: '新記録',
};

const KO_COPY: Copy = {
  title: '말하고 쏘기', score: '점수', cleared: '제거', listening: '듣는 중…', preparing: '음성 인식 준비 중…', permissionTitle: '마이크 접근 권한이 필요해요', permissionBody: '플레이하려면 iOS 설정에서 마이크와 음성 인식을 허용하세요.', unsupportedTitle: '기기 내 음성 인식을 사용할 수 없어요', unsupportedBody: '이 기능에 필요한 Apple의 기기 내 영어 음성 인식을 이 기기에서 사용할 수 없어요.', retryPermission: '다시 확인',
  learnedNeededTitle: '먼저 이모지 하나를 배우세요', learnedNeededBody: '모험 퀴즈를 완료하면 학습한 이모지가 여기에 나타나요.', gameOver: '이모지 더미가 위험선에 닿았어요!', tryAgain: '다시 시도', exit: '나가기', start: '시작', pause: '일시 정지', paused: '일시 정지됨', time: '시간', rush: '마지막 질주!', successTitle: '살아남았어요!', threeStarTitle: '별 3개 도전 완료!', successBody: '60초를 모두 버텼어요!', failureTitle: '게임 오버',
  accuracy: '정확도', bestStreak: '최고 연속 정답', blasted: '명중', missed: '놓침', staminaReward: '체력 +1 획득!', staminaBanked: '체력 +1을 나중을 위해 저장했어요!', staminaDailyLimit: '오늘의 체력 보상 한도에 도달했어요(3/3).', staminaRule: '별 3개로 체력 +1 ❤️ · 정확도 80% 이상 · 하루 최대 3회', staminaAlmost: '거의 다 왔어요! 별 3개를 얻으면 체력을 받을 수 있어요.', staminaFailureEncouragement: '계속하세요! 끝까지 버티고 별 3개를 얻어 체력을 받으세요.',
  startGame: '게임 시작', getReady: '준비하세요!', nextGoal: '다음 목표', clearMore: n => `이모지 ${n}개 더 제거`, accuracyGoal: n => `정확도 ${n}% 달성`, tutorialTitle: '빠른 음성 연습', tutorialBody: '천천히 떨어지는 이모지 3개의 영어 단어를 말하세요. 정답을 말하면 공격해요.', tutorialPractice: '연습 시작', tutorialProgress: n => `연습 명중 ${n}/3`, tutorialCompleteTitle: '발사 준비 완료!', tutorialCompleteBody: '이제 60초 동안 버티세요. 마지막 20초에는 속도가 빨라져요.', tutorialContinue: '계속하기',
  attemptNumber: n => `도전 #${n}`, challengeCompleted: n => `도전 #${n} 완료`, careerBlasted: n => `누적 이모지 ${n}개 명중`, milestoneReached: n => `음성 도전 ${n}회 달성! 계속하세요!`, newAccuracyRecord: '정확도 신기록!', newStreakRecord: '연속 정답 신기록!', newBest: '신기록',
};

const COPY_BY_LOCALE: Record<Locale, Copy> = {
  en: EN_COPY, es: ES_COPY, fr: FR_COPY, de: DE_COPY, ja: JA_COPY, ko: KO_COPY, 'zh-CN': ZH_COPY,
};

const STAY_LABEL: Record<Locale, string> = {
  en: 'Stay in Say & Blast',
  es: 'Seguir en Di y dispara',
  fr: 'Rester dans Dis et explose',
  de: 'Bei Sprechen & Treffen bleiben',
  ja: '声でブラストを続ける',
  ko: '말하고 쏘기 계속하기',
  'zh-CN': '留在开口出击',
};

function normalizeSpeech(text: string): string {
  const normalized = text
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  return normalized
    .split(' ')
    .map((token) => SPOKEN_NUMBER_TOKENS[token] ?? token)
    .join(' ');
}

function loadTutorialPhase(): TutorialPhase {
  try {
    return localStorage.getItem(TUTORIAL_SEEN_KEY) === '1' ? null : 'intro';
  } catch {
    return 'intro';
  }
}

function saveTutorialSeen(): void {
  try {
    localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
  } catch {
    // The tutorial may repeat when storage is unavailable.
  }
}

function compactSpeech(text: string): string {
  return normalizeSpeech(text)
    .split(' ')
    .filter(Boolean)
    .join('');
}

async function beginSpeechAnswerWithRecovery(
  words: readonly string[],
): Promise<{ cycleId: number }> {
  try {
    return await beginAppleSpeechAnswer(words);
  } catch {
    // The tutorial stops the native audio engine. If the first formal answer
    // arrives during that handoff, restore the engine before retrying.
    await startAppleSpeechRecognition([]);
    return beginAppleSpeechAnswer(words);
  }
}

function speechTokenMatches(token: string, targetToken: string): boolean {
  const normalizedToken = normalizeSpeech(token);
  const normalizedTarget = normalizeSpeech(targetToken);
  if (!normalizedToken || !normalizedTarget) return false;
  if (
    normalizedToken === normalizedTarget ||
    compactSpeech(normalizedToken) === compactSpeech(normalizedTarget)
  ) {
    return true;
  }
  const aliases = SPEECH_TARGET_ALIASES[normalizedTarget] ?? [];
  return aliases.some(
    (alias) =>
      normalizedToken === alias ||
      compactSpeech(normalizedToken) === compactSpeech(alias),
  );
}

function speechMatchesTarget(phrase: string, target: string): boolean {
  const normalizedPhrase = normalizeSpeech(phrase);
  const normalizedTarget = normalizeSpeech(target);
  if (!normalizedPhrase || !normalizedTarget) return false;
  if (
    normalizedPhrase === normalizedTarget ||
    compactSpeech(normalizedPhrase) === compactSpeech(normalizedTarget)
  ) {
    return true;
  }
  const phraseTokens = normalizedPhrase.split(' ').filter(Boolean);
  const targetTokens = normalizedTarget.split(' ').filter(Boolean);
  if (phraseTokens.length === 0 || targetTokens.length === 0) return false;
  if (phraseTokens.length !== targetTokens.length) return false;
  return phraseTokens.every((token, index) =>
    speechTokenMatches(token, targetTokens[index]),
  );
}

function speechIsOnlyTargetRepetitions(phrase: string, target: string): boolean {
  const phraseTokens = normalizeSpeech(phrase).split(' ').filter(Boolean);
  const targetTokens = normalizeSpeech(target).split(' ').filter(Boolean);
  if (phraseTokens.length === 0 || targetTokens.length === 0) return false;
  if (phraseTokens.length % targetTokens.length !== 0) return false;
  for (let index = 0; index < phraseTokens.length; index++) {
    if (
      !speechTokenMatches(
        phraseTokens[index],
        targetTokens[index % targetTokens.length],
      )
    ) {
      return false;
    }
  }
  return true;
}

function resultConfidence(event: AppleSpeechResult): number | null {
  if (typeof event.confidence === 'number' && event.confidence > 0) {
    return Math.max(0, Math.min(1, event.confidence));
  }
  const values = event.segments
    .map((segment) => segment.confidence)
    .filter(
      (value): value is number =>
        typeof value === 'number' && value > 0,
    );
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateSayBlastRating({
  cleared,
  accuracy,
}: {
  cleared: number;
  accuracy: number;
}): {
  stars: 1 | 2 | 3;
  clearGrade: number;
  accuracyGrade: number;
  twoStarClearTarget: number;
  threeStarClearTarget: number;
} {
  const threeStarClearTarget = 15;
  const twoStarClearTarget = 8;
  const clearGrade =
    cleared >= threeStarClearTarget ? 3 : cleared >= twoStarClearTarget ? 2 : 1;
  const accuracyGrade = accuracy >= 0.8 ? 3 : accuracy >= 0.65 ? 2 : 1;
  const total = clearGrade + accuracyGrade;
  return {
    stars: total >= 6 ? 3 : total >= 4 ? 2 : 1,
    clearGrade,
    accuracyGrade,
    twoStarClearTarget,
    threeStarClearTarget,
  };
}

function formatCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

export function SayBlastGame({
  learnedItems,
  progressUserId,
  onExit,
  returnToAdventure = false,
  onContinueAdventure,
  onRewardStamina,
  onValidExperience,
}: {
  learnedItems: WordItem[];
  progressUserId?: string | null;
  onExit: () => void;
  returnToAdventure?: boolean;
  onContinueAdventure?: () => void;
  onRewardStamina: () => 'granted' | 'banked' | 'daily-limit';
  onValidExperience: () => void;
}) {
  const { locale, ui } = useI18n();
  const copy = COPY_BY_LOCALE[locale];
  const playableItems = useMemo(() => {
    const byEmoji = new Map<string, WordItem>();
    for (const item of learnedItems) {
      if (!item.emoji || !item.word.trim() || byEmoji.has(item.emoji)) continue;
      byEmoji.set(item.emoji, item);
    }
    return [...byEmoji.values()];
  }, [learnedItems]);
  const practiceItems = useMemo(
    () =>
      [...playableItems]
        .sort((left, right) => left.word.length - right.word.length)
        .slice(0, 3),
    [playableItems],
  );

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const arenaShakeAnimationRef = useRef<Animation | null>(null);
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });
  const [permissionPhase, setPermissionPhase] = useState<PermissionPhase>('requesting');
  const [listening, setListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [drops, setDrops] = useState<FallingEmoji[]>([]);
  const dropsRef = useRef<FallingEmoji[]>([]);
  const preparingDropRef = useRef(false);
  const [dropPreparationRetryKey, setDropPreparationRetryKey] = useState(0);
  const [score, setScore] = useState(0);
  const [, setCleared] = useState(0);
  const clearedRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [careerStats, setCareerStats] = useState<SayBlastStats>(() =>
    loadSayBlastStats(progressUserId),
  );
  const careerStatsRef = useRef(careerStats);
  const [activeAttemptNumber, setActiveAttemptNumber] = useState<number | null>(null);
  const activeAttemptNumberRef = useRef<number | null>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const gameRunningRef = useRef(false);
  const [roundStarted, setRoundStarted] = useState(false);
  const roundStartedRef = useRef(false);
  const [countIn, setCountIn] = useState<number | null>(null);
  const countInRef = useRef<number | null>(null);
  countInRef.current = countIn;
  const appActiveRef = useRef(document.visibilityState === 'visible');
  const [tutorialPhase, setTutorialPhase] = useState<TutorialPhase>(loadTutorialPhase);
  const tutorialPracticeRef = useRef(false);
  const [tutorialCleared, setTutorialCleared] = useState(0);
  const tutorialClearedRef = useRef(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const remainingMsRef = useRef(GAME_DURATION_SECONDS * 1000);
  const rushActiveRef = useRef(false);
  const rushActive =
    secondsLeft > 0 && secondsLeft <= RUSH_DURATION_SECONDS;
  rushActiveRef.current = rushActive;
  const correctAttemptsRef = useRef(0);
  const missedAttemptsRef = useRef(0);
  const bestStreakRef = useRef(0);
  const staminaRewardGrantedRef = useRef(false);
  const correctStreakRef = useRef(0);
  const missStreakRef = useRef(0);
  const adaptiveSpeedRef = useRef(1);
  const [lastHeard, setLastHeard] = useState('');
  const [centerPrompt, setCenterPrompt] = useState<CenterPrompt | null>(null);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [explosion, setExplosion] = useState<Explosion | null>(null);
  const projectileSeqRef = useRef(0);
  const dropSeqRef = useRef(0);
  const validExperienceReportedRef = useRef(false);
  const centerPromptSeqRef = useRef(0);
  const phraseTimerRef = useRef<number | null>(null);
  const heardTextTimerRef = useRef<number | null>(null);
  const heardTextCycleRef = useRef<number | null>(null);
  const heardTextValueRef = useRef('');
  const answerSessionRef = useRef<AnswerSession | null>(null);
  const finalizedDropIdsRef = useRef(new Set<string>());
  const effectTimersRef = useRef<number[]>([]);
  const recognitionHandlerRef = useRef<(event: AppleSpeechResult) => void>(() => undefined);
  const landingGraceTimersRef = useRef(new Map<string, number>());

  const laneWidth = arenaSize.width / LANE_COUNT;
  const displayedAttemptNumber =
    activeAttemptNumber ?? careerStats.attemptsStarted + 1;

  const updateCareerStats = useCallback((next: SayBlastStats) => {
    careerStatsRef.current = next;
    setCareerStats(next);
  }, []);

  useEffect(() => {
    const next = loadSayBlastStats(progressUserId);
    careerStatsRef.current = next;
    setCareerStats(next);
    activeAttemptNumberRef.current = null;
    setActiveAttemptNumber(null);
  }, [progressUserId]);

  const beginOfficialAttempt = useCallback(() => {
    if (validExperienceReportedRef.current) return;
    validExperienceReportedRef.current = true;
    const next = recordSayBlastAttemptStarted(progressUserId);
    updateCareerStats(next);
    activeAttemptNumberRef.current = next.attemptsStarted;
    setActiveAttemptNumber(next.attemptsStarted);
    onValidExperience();
  }, [onValidExperience, progressUserId, updateCareerStats]);

  const recordCareerBlast = useCallback(() => {
    updateCareerStats(recordSayBlastBlasted(progressUserId));
  }, [progressUserId, updateCareerStats]);

  const updateDrops = useCallback((next: FallingEmoji[]) => {
    dropsRef.current = next;
    setDrops(next);
  }, []);

  const showHeardText = useCallback((text: string, cycleId: number) => {
    const normalizedText = normalizeSpeech(text);
    if (!normalizedText) return;
    if (
      heardTextCycleRef.current === cycleId &&
      heardTextValueRef.current === normalizedText
    ) {
      // Repeated Apple partial results are not new speech and must not keep
      // an unchanged caption alive or bring it back after the timeout.
      return;
    }
    if (heardTextTimerRef.current !== null) {
      window.clearTimeout(heardTextTimerRef.current);
    }
    heardTextCycleRef.current = cycleId;
    heardTextValueRef.current = normalizedText;
    setLastHeard(text);
    // Follow genuine transcript changes while the user is speaking. Once the
    // recognized text stops changing, keep it for at most 1.6 seconds.
    heardTextTimerRef.current = window.setTimeout(() => {
      heardTextTimerRef.current = null;
      setLastHeard('');
    }, HEARD_TEXT_VISIBLE_MS);
  }, []);

  const scheduleDropPreparationRetry = useCallback(() => {
    const timer = window.setTimeout(() => {
      const hasActiveDrop = dropsRef.current.some(
        (drop) =>
          drop.status === 'falling' ||
          drop.status === 'checking' ||
          drop.status === 'targeted',
      );
      if (
        gameRunningRef.current &&
        !gameOverRef.current &&
        !hasActiveDrop
      ) {
        setDropPreparationRetryKey((value) => value + 1);
      }
    }, 300);
    effectTimersRef.current.push(timer);
  }, []);

  const clearEffectTimers = useCallback(() => {
    for (const timer of effectTimersRef.current) window.clearTimeout(timer);
    effectTimersRef.current = [];
    if (phraseTimerRef.current !== null) {
      window.clearTimeout(phraseTimerRef.current);
      phraseTimerRef.current = null;
    }
    if (heardTextTimerRef.current !== null) {
      window.clearTimeout(heardTextTimerRef.current);
      heardTextTimerRef.current = null;
    }
    heardTextCycleRef.current = null;
    heardTextValueRef.current = '';
    setLastHeard('');
    for (const timer of landingGraceTimersRef.current.values()) {
      window.clearTimeout(timer);
    }
    landingGraceTimersRef.current.clear();
  }, []);

  const playBlastImpactFeedback = useCallback(() => {
    playSayBlastExplosionSfx();
    try {
      arenaShakeAnimationRef.current?.cancel();
      const arena = arenaRef.current;
      if (!arena?.animate) return;
      const animation = arena.animate(
        [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: 'translate3d(-7px, 3px, 0) rotate(-0.35deg)' },
          { transform: 'translate3d(6px, -3px, 0) rotate(0.3deg)' },
          { transform: 'translate3d(-5px, 2px, 0) rotate(-0.25deg)' },
          { transform: 'translate3d(4px, -1px, 0) rotate(0.18deg)' },
          { transform: 'translate3d(-2px, 1px, 0)' },
          { transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 260, easing: 'ease-out' },
      );
      arenaShakeAnimationRef.current = animation;
      animation.onfinish = () => {
        if (arenaShakeAnimationRef.current === animation) {
          arenaShakeAnimationRef.current = null;
        }
      };
    } catch {
      // Sound and haptics still provide feedback when WAAPI is unavailable.
    }
  }, []);

  const showCenterPrompt = useCallback(
    (text: string, durationMs = 950, detail?: string) => {
      const id = ++centerPromptSeqRef.current;
      setCenterPrompt({ id, text, detail });
      const timer = window.setTimeout(() => {
        setCenterPrompt((current) => (current?.id === id ? null : current));
      }, durationMs);
      effectTimersRef.current.push(timer);
    },
    [],
  );

  const recordCorrect = useCallback(
    (dropId: string) => {
      if (finalizedDropIdsRef.current.has(dropId)) return;
      finalizedDropIdsRef.current.add(dropId);
      const session = answerSessionRef.current;
      if (session?.dropId === dropId) session.resolved = true;
      if (tutorialPracticeRef.current) return;
      recordCareerBlast();
      correctAttemptsRef.current += 1;
      correctStreakRef.current += 1;
      bestStreakRef.current = Math.max(
        bestStreakRef.current,
        correctStreakRef.current,
      );
      missStreakRef.current = 0;
      adaptiveSpeedRef.current = Math.min(
        1.35,
        adaptiveSpeedRef.current +
          (correctStreakRef.current >= 3 ? 0.05 : 0.07),
      );
      setScore((value) => value + 100);
      const nextCleared = clearedRef.current + 1;
      clearedRef.current = nextCleared;
      setCleared(nextCleared);
    },
    [recordCareerBlast],
  );

  const recordWrong = useCallback(
    (dropId: string) => {
      if (finalizedDropIdsRef.current.has(dropId)) return;
      finalizedDropIdsRef.current.add(dropId);
      const session = answerSessionRef.current;
      if (session?.dropId === dropId) session.resolved = true;
      if (tutorialPracticeRef.current) return;
      missedAttemptsRef.current += 1;
      missStreakRef.current += 1;
      correctStreakRef.current = 0;
      adaptiveSpeedRef.current = Math.max(
        0.75,
        adaptiveSpeedRef.current - (missStreakRef.current >= 2 ? 0.12 : 0.06),
      );
    },
    [],
  );

  const showLandedMissed = useCallback(
    (word: string) => {
      showCenterPrompt('Oh! Missed!', 1100, word);
    },
    [showCenterPrompt],
  );

  const finishGame = useCallback(
    (kind: GameResult['kind']) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      gameRunningRef.current = false;
      const totalAttempts =
        correctAttemptsRef.current + missedAttemptsRef.current;
      const accuracy =
        totalAttempts > 0 ? correctAttemptsRef.current / totalAttempts : null;
      const rating =
        kind === 'success'
          ? calculateSayBlastRating({
              cleared: clearedRef.current,
              accuracy: accuracy ?? 0,
            })
          : null;
      const stars = rating?.stars ?? 0;
      let ratingTip = '';
      if (rating && stars < 3) {
        const weakestGrade = Math.min(rating.clearGrade, rating.accuracyGrade);
        if (rating.clearGrade === weakestGrade) {
          const target =
            rating.clearGrade === 1
              ? rating.twoStarClearTarget
              : rating.threeStarClearTarget;
          ratingTip = copy.clearMore(Math.max(1, target - clearedRef.current));
        } else if (rating.accuracyGrade === weakestGrade) {
          ratingTip = copy.accuracyGoal(
            rating.accuracyGrade === 1 ? 65 : 80,
          );
        }
      }
      let staminaReward: GameResult['staminaReward'] = null;
      if (kind === 'success' && stars === 3 && !staminaRewardGrantedRef.current) {
        staminaRewardGrantedRef.current = true;
        staminaReward = onRewardStamina();
      }
      const attemptNumber =
        activeAttemptNumberRef.current ?? careerStatsRef.current.attemptsStarted + 1;
      const completion = validExperienceReportedRef.current
        ? recordSayBlastRoundCompleted(
            { accuracy, bestStreak: bestStreakRef.current },
            progressUserId,
          )
        : {
            stats: careerStatsRef.current,
            newBestAccuracy: false,
            newBestStreak: false,
          };
      updateCareerStats(completion.stats);
      setGameResult({
        kind,
        stars,
        accuracy,
        bestStreak: bestStreakRef.current,
        blasted: clearedRef.current,
        missed: missedAttemptsRef.current,
        staminaReward,
        ratingTip,
        attemptNumber,
        careerTotalBlasted: completion.stats.totalBlasted,
        milestone: validExperienceReportedRef.current
          ? sayBlastAttemptMilestone(attemptNumber)
          : null,
        newBestAccuracy: completion.newBestAccuracy,
        newBestStreak: completion.newBestStreak,
      });
      setGameOver(true);
      setGameRunning(false);
      setListening(false);
      setProjectile(null);
      if (kind === 'success') triggerGameHaptic('majorSuccess');
      void stopAppleSpeechRecognition();
    },
    [copy, onRewardStamina, progressUserId, updateCareerStats],
  );

  const launchAttack = useCallback(
    (word: string): string | null => {
      if (gameOverRef.current || arenaSize.width <= 0 || arenaSize.height <= 0) return null;
      const normalizedWord = normalizeSpeech(word);
      const targets = dropsRef.current
        .filter(
          (drop) =>
            (drop.status === 'falling' || drop.status === 'checking') &&
            normalizeSpeech(drop.item.word) === normalizedWord,
        )
        .sort((a, b) => b.y - a.y);
      const target = targets[0];
      if (!target) return null;

      const landingTimer = landingGraceTimersRef.current.get(target.id);
      if (landingTimer !== undefined) {
        window.clearTimeout(landingTimer);
        landingGraceTimersRef.current.delete(target.id);
      }
      const nextDrops = dropsRef.current.map((drop) =>
        drop.id === target.id ? { ...drop, status: 'targeted' as const } : drop,
      );
      updateDrops(nextDrops);
      const x = target.lane * laneWidth + laneWidth / 2 - DROP_SIZE / 2;
      const projectileId = ++projectileSeqRef.current;
      setProjectile({
        id: projectileId,
        emoji: PROJECTILES[Math.floor(Math.random() * PROJECTILES.length)],
        fromX: arenaSize.width / 2 - 20,
        fromY: arenaSize.height - 42,
        toX: x + 5,
        toY: target.y + 5,
      });

      const hitTimer = window.setTimeout(() => {
        const stillTargeted = dropsRef.current.some(
          (drop) => drop.id === target.id && drop.status === 'targeted',
        );
        if (!stillTargeted) return;
        updateDrops(dropsRef.current.filter((drop) => drop.id !== target.id));
        setProjectile(null);
        setExplosion({ id: projectileId, x, y: target.y });
        playBlastImpactFeedback();
        triggerGameHaptic('sayBlastExplosion');
        if (tutorialPracticeRef.current) {
          const nextTutorialCleared = tutorialClearedRef.current + 1;
          tutorialClearedRef.current = nextTutorialCleared;
          setTutorialCleared(nextTutorialCleared);
          if (nextTutorialCleared >= 3) {
            tutorialPracticeRef.current = false;
            gameRunningRef.current = false;
            setGameRunning(false);
            setListening(false);
            updateDrops([]);
            saveTutorialSeen();
            setTutorialPhase('complete');
            void stopAppleSpeechRecognition();
          }
        }
        const explosionTimer = window.setTimeout(() => {
          setExplosion((current) => (current?.id === projectileId ? null : current));
        }, 320);
        effectTimersRef.current.push(explosionTimer);
      }, PROJECTILE_MS);
      effectTimersRef.current.push(hitTimer);
      return target.id;
    },
    [
      arenaSize.height,
      arenaSize.width,
      laneWidth,
      playBlastImpactFeedback,
      updateDrops,
    ],
  );

  const handleRecognizedWord = useCallback(
    (word: string) => {
      if (!gameRunningRef.current) return;
      const session = answerSessionRef.current;
      if (!session || session.resolved) return;
      const blastedDropId = launchAttack(word);
      if (blastedDropId) recordCorrect(blastedDropId);
    },
    [launchAttack, recordCorrect],
  );

  const rearmAnswerSession = useCallback(async (session: AnswerSession) => {
    if (
      session.resolved ||
      gameOverRef.current ||
      !gameRunningRef.current ||
      answerSessionRef.current !== session
    ) {
      return;
    }
    try {
      const { cycleId } = await beginSpeechAnswerWithRecovery([session.target]);
      if (
        session.resolved ||
        gameOverRef.current ||
        !gameRunningRef.current ||
        answerSessionRef.current !== session
      ) {
        return;
      }
      session.cycleId = cycleId;
      session.transcript = '';
      session.confidence = null;
      updateDrops(
        dropsRef.current.map((drop) =>
          drop.id === session.dropId
            ? { ...drop, recognitionCycleId: cycleId }
            : drop,
        ),
      );
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [updateDrops]);

  const evaluateSpeechAttempt = useCallback(
    (reason: 'final' | 'silence') => {
      phraseTimerRef.current = null;
      const session = answerSessionRef.current;
      if (!session || session.resolved || gameOverRef.current) return;
      const phrase = session.transcript.trim();
      if (
        phrase &&
        (speechMatchesTarget(phrase, session.target) ||
          speechIsOnlyTargetRepetitions(phrase, session.target))
      ) {
        session.transcript = '';
        handleRecognizedWord(session.target);
        return;
      }
      session.transcript = '';
      const phraseTokenCount = normalizeSpeech(phrase)
        .split(' ')
        .filter(Boolean).length;
      const targetTokenCount = normalizeSpeech(session.target)
        .split(' ')
        .filter(Boolean).length;
      if (
        reason === 'final' &&
        phrase &&
        phraseTokenCount >= targetTokenCount &&
        session.confidence !== null &&
        session.confidence >= MIN_WRONG_ANSWER_CONFIDENCE
      ) {
        recordWrong(session.dropId);
        return;
      }
      session.confidence = null;
      // The transcript remains visible, but an unmatched utterance never locks
      // the emoji unless Apple's final result was confident enough to be a
      // clearly different complete answer.
      if (reason === 'final' || phrase) void rearmAnswerSession(session);
    },
    [handleRecognizedWord, rearmAnswerSession, recordWrong],
  );

  const flushSpeechPhrase = useCallback(() => {
    phraseTimerRef.current = null;
    evaluateSpeechAttempt('silence');
  }, [evaluateSpeechAttempt]);

  recognitionHandlerRef.current = (event) => {
    if (!gameRunningRef.current) return;
    const session = answerSessionRef.current;
    if (!session || session.resolved) return;
    if (event.cycleId !== session.cycleId) return;
    const transcript = event.transcript.trim();
    if (!transcript) return;
    session.transcript = transcript;
    session.confidence = resultConfidence(event);
    showHeardText(transcript, event.cycleId);
    if (
      speechMatchesTarget(transcript, session.target) ||
      speechIsOnlyTargetRepetitions(transcript, session.target)
    ) {
      if (phraseTimerRef.current !== null) {
        window.clearTimeout(phraseTimerRef.current);
        phraseTimerRef.current = null;
      }
      handleRecognizedWord(session.target);
      return;
    }
    if (phraseTimerRef.current !== null) window.clearTimeout(phraseTimerRef.current);
    if (event.isFinal) {
      evaluateSpeechAttempt('final');
      return;
    }
    phraseTimerRef.current = window.setTimeout(
      flushSpeechPhrase,
      SPEECH_SILENCE_SETTLE_MS,
    );
  };

  const resetGame = useCallback(async () => {
    clearEffectTimers();
    gameOverRef.current = false;
    gameRunningRef.current = false;
    roundStartedRef.current = false;
    tutorialPracticeRef.current = false;
    preparingDropRef.current = false;
    dropsRef.current = [];
    setDrops([]);
    setScore(0);
    setCleared(0);
    clearedRef.current = 0;
    remainingMsRef.current = GAME_DURATION_SECONDS * 1000;
    correctAttemptsRef.current = 0;
    missedAttemptsRef.current = 0;
    bestStreakRef.current = 0;
    staminaRewardGrantedRef.current = false;
    correctStreakRef.current = 0;
    missStreakRef.current = 0;
    adaptiveSpeedRef.current = 1;
    tutorialClearedRef.current = 0;
    setGameOver(false);
    setGameResult(null);
    setGameRunning(false);
    setRoundStarted(false);
    setCountIn(null);
    setTutorialCleared(0);
    setSecondsLeft(GAME_DURATION_SECONDS);
    setListening(false);
    setMicLevel(0);
    setProjectile(null);
    setExplosion(null);
    setLastHeard('');
    setCenterPrompt(null);
    arenaShakeAnimationRef.current?.cancel();
    arenaShakeAnimationRef.current = null;
    answerSessionRef.current = null;
    finalizedDropIdsRef.current.clear();
    validExperienceReportedRef.current = false;
    activeAttemptNumberRef.current = null;
    setActiveAttemptNumber(null);
    await stopAppleSpeechRecognition();
    setPermissionPhase('ready');
  }, [clearEffectTimers]);

  const startSpeechForCurrentBoard = useCallback(async () => {
    await startAppleSpeechRecognition([]);
    const activeDrop = dropsRef.current.find(
      (drop) => drop.status === 'falling' || drop.status === 'checking',
    );
    if (!activeDrop) return;
    const { cycleId } = await beginSpeechAnswerWithRecovery([
      activeDrop.item.word,
    ]);
    answerSessionRef.current = {
      dropId: activeDrop.id,
      target: activeDrop.item.word,
      cycleId,
      resolved: false,
      transcript: '',
      confidence: null,
    };
    updateDrops(
      dropsRef.current.map((drop) =>
        drop.id === activeDrop.id ? { ...drop, recognitionCycleId: cycleId } : drop,
      ),
    );
  }, [updateDrops]);

  const startGame = useCallback(async () => {
    if (
      permissionPhase !== 'ready' ||
      gameOverRef.current ||
      gameRunningRef.current ||
      countIn !== null ||
      tutorialPhase !== null
    ) {
      return;
    }
    setLastHeard('');
    try {
      if (!roundStartedRef.current) {
        // Keep the microphone off during 3–2–1 so iOS cannot reconfigure or
        // capture the count-in audio. Recognition begins on the start chime.
        roundStartedRef.current = true;
        setRoundStarted(true);
        setCountIn(3);
      } else {
        await startSpeechForCurrentBoard();
        gameRunningRef.current = true;
        setGameRunning(true);
        setListening(true);
      }
    } catch {
      setPermissionPhase('error');
      setListening(false);
    }
  }, [countIn, permissionPhase, startSpeechForCurrentBoard, tutorialPhase]);

  useEffect(() => {
    if (countIn === null) return;
    if (loadSfxEnabled()) {
      void playAppleSpeechCountdownTone('beep').then((playedNatively) => {
        if (!playedNatively) playSayBlastCountdownBeep();
      });
    }
    const timer = window.setTimeout(() => {
      if (countIn > 1) {
        setCountIn(countIn - 1);
        return;
      }
      if (loadSfxEnabled()) {
        void playAppleSpeechCountdownTone('start').then((playedNatively) => {
          if (!playedNatively) playSayBlastCountdownStartChime();
        });
      }
      setCountIn(null);
      void startAppleSpeechRecognition([])
        .then(() => {
          if (gameOverRef.current || !appActiveRef.current) {
            void stopAppleSpeechRecognition();
            return;
          }
          gameRunningRef.current = true;
          setGameRunning(true);
          setListening(true);
        })
        .catch(() => {
          gameRunningRef.current = false;
          setGameRunning(false);
          setListening(false);
          setPermissionPhase('error');
        });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [countIn]);

  const startTutorialPractice = useCallback(async () => {
    if (
      permissionPhase !== 'ready' ||
      gameRunningRef.current ||
      practiceItems.length === 0
    ) {
      return;
    }
    setLastHeard('');
    tutorialClearedRef.current = 0;
    setTutorialCleared(0);
    updateDrops([]);
    try {
      await startAppleSpeechRecognition([]);
      tutorialPracticeRef.current = true;
      setTutorialPhase('practice');
      gameRunningRef.current = true;
      setGameRunning(true);
      setListening(true);
    } catch {
      setPermissionPhase('error');
      setListening(false);
    }
  }, [permissionPhase, practiceItems, updateDrops]);

  const finishTutorial = useCallback(async () => {
    tutorialPracticeRef.current = false;
    gameRunningRef.current = false;
    setGameRunning(false);
    setListening(false);
    await resetGame();
    setTutorialPhase(null);
  }, [resetGame]);

  const pauseGame = useCallback(async () => {
    if (!gameRunningRef.current) return;
    gameRunningRef.current = false;
    setGameRunning(false);
    setListening(false);
    answerSessionRef.current = null;
    if (phraseTimerRef.current !== null) {
      window.clearTimeout(phraseTimerRef.current);
      phraseTimerRef.current = null;
    }
    await stopAppleSpeechRecognition();
  }, []);

  useEffect(() => {
    const pauseForBackground = () => {
      appActiveRef.current = false;
      // Cancel a pending 3-2-1 as well as an already-running round. Otherwise
      // its timeout could start the official timer while the app is hidden.
      if (countInRef.current !== null) {
        countInRef.current = null;
        setCountIn(null);
        roundStartedRef.current = false;
        setRoundStarted(false);
      }
      void pauseGame();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') pauseForBackground();
      else appActiveRef.current = true;
    };
    // visibilitychange covers browser tab switches; Capacitor's lifecycle
    // event covers native app switches where WKWebView events can be unreliable.
    const nativeListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) appActiveRef.current = true;
      else pauseForBackground();
    });
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void nativeListener.then((handle) => handle.remove());
    };
  }, [pauseGame]);

  const authorizeAndStart = useCallback(async () => {
    if (playableItems.length === 0) return;
    if (!isAppleSpeechRecognitionAvailable()) {
      setPermissionPhase('unsupported');
      return;
    }
    setPermissionPhase('requesting');
    try {
      const current = await checkAppleSpeechPermissions();
      if (!current.onDeviceRecognitionSupported) {
        setPermissionPhase('unsupported');
        return;
      }
      const permissions = await requestAppleSpeechPermissions();
      if (
        !permissions.onDeviceRecognitionSupported ||
        permissions.microphone !== 'granted' ||
        permissions.speechRecognition !== 'granted'
      ) {
        setPermissionPhase('denied');
        return;
      }
      await resetGame();
    } catch {
      setPermissionPhase('error');
    }
  }, [playableItems.length, resetGame]);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const update = () => {
      const rect = arena.getBoundingClientRect();
      setArenaSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(arena);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let disposed = false;
    const handles: Array<{ remove: () => Promise<void> }> = [];
    void (async () => {
      const resultHandle = await addAppleSpeechResultListener((event) => {
        recognitionHandlerRef.current(event);
      });
      if (resultHandle) handles.push(resultHandle);
      const stateHandle = await addAppleSpeechStateListener((event) => {
        if (!disposed) {
          setListening(event.listening);
          if (!event.listening) setMicLevel(0);
        }
      });
      if (stateHandle) handles.push(stateHandle);
      const levelHandle = await addAppleSpeechLevelListener((event) => {
        if (!disposed) {
          setMicLevel((current) => current * 0.35 + event.level * 0.65);
        }
      });
      if (levelHandle) handles.push(levelHandle);
      if (!disposed) await authorizeAndStart();
    })();
    return () => {
      disposed = true;
      clearEffectTimers();
      arenaShakeAnimationRef.current?.cancel();
      arenaShakeAnimationRef.current = null;
      void stopAppleSpeechRecognition();
      for (const handle of handles) void handle.remove();
    };
  }, [authorizeAndStart, clearEffectTimers]);

  useEffect(() => {
    if (!gameRunning || gameOver || tutorialPhase === 'practice') return;
    let lastTime = performance.now();
    const timer = window.setInterval(() => {
      if (!gameRunningRef.current || gameOverRef.current) return;
      const now = performance.now();
      const elapsed = Math.max(0, now - lastTime);
      lastTime = now;
      const nextMs = Math.max(0, remainingMsRef.current - elapsed);
      remainingMsRef.current = nextMs;
      const nextSeconds = Math.ceil(nextMs / 1000);
      setSecondsLeft((current) =>
        current === nextSeconds ? current : nextSeconds,
      );
      if (nextMs <= 0) finishGame('success');
    }, 100);
    return () => window.clearInterval(timer);
  }, [finishGame, gameOver, gameRunning, tutorialPhase]);

  const activeDropCount = drops.reduce(
    (count, drop) =>
      drop.status === 'falling' ||
      drop.status === 'checking' ||
      drop.status === 'targeted'
        ? count + 1
        : count,
    0,
  );
  const activeAnswerDrop =
    drops.find(
      (drop) => drop.status === 'falling' || drop.status === 'checking',
    ) ?? null;
  const activeAnswerDropId = activeAnswerDrop?.id ?? '';
  const activeAnswerWord = activeAnswerDrop?.item.word ?? '';
  const activeAnswerCycleId = activeAnswerDrop?.recognitionCycleId ?? 0;

  useEffect(() => {
    if (!gameRunning || gameOver || !activeAnswerDropId || !activeAnswerWord) {
      if (phraseTimerRef.current !== null) {
        window.clearTimeout(phraseTimerRef.current);
        phraseTimerRef.current = null;
      }
      answerSessionRef.current = null;
      return;
    }
    if (
      answerSessionRef.current?.dropId === activeAnswerDropId &&
      answerSessionRef.current.cycleId === activeAnswerCycleId &&
      !answerSessionRef.current.resolved
    ) {
      return;
    }
    if (finalizedDropIdsRef.current.has(activeAnswerDropId)) {
      answerSessionRef.current = null;
      if (phraseTimerRef.current !== null) {
        window.clearTimeout(phraseTimerRef.current);
        phraseTimerRef.current = null;
      }
      return;
    }

    answerSessionRef.current = {
      dropId: activeAnswerDropId,
      target: activeAnswerWord,
      cycleId: activeAnswerCycleId,
      resolved: false,
      transcript: '',
      confidence: null,
    };
    setLastHeard('');
  }, [
    activeAnswerCycleId,
    activeAnswerDropId,
    activeAnswerWord,
    gameOver,
    gameRunning,
  ]);

  useEffect(() => {
    if (
      permissionPhase !== 'ready' ||
      !gameRunning ||
      gameOver ||
      arenaSize.height <= 0 ||
      activeDropCount > 0 ||
      preparingDropRef.current
    ) {
      return;
    }
    preparingDropRef.current = true;
    let cancelled = false;
    let preparationStarted = false;
    const timer = window.setTimeout(() => {
      preparationStarted = true;
      void (async () => {
        try {
          if (!gameRunningRef.current || gameOverRef.current) return;
          const lane = Math.floor(Math.random() * LANE_COUNT);
          const item =
            tutorialPhase === 'practice'
              ? practiceItems[
                  tutorialClearedRef.current % Math.max(1, practiceItems.length)
                ]
              : playableItems[Math.floor(Math.random() * playableItems.length)];
          if (!item) return;
          const { cycleId } = await beginSpeechAnswerWithRecovery([item.word]);
          if (
            cancelled ||
            !gameRunningRef.current ||
            gameOverRef.current ||
            dropsRef.current.some(
              (drop) =>
                drop.status === 'falling' ||
                drop.status === 'checking' ||
                drop.status === 'targeted',
            )
          ) {
            return;
          }
          const id = `say-drop-${++dropSeqRef.current}`;
          answerSessionRef.current = {
            dropId: id,
            target: item.word,
            cycleId,
            resolved: false,
            transcript: '',
            confidence: null,
          };
          setLastHeard('');
          updateDrops([
            ...dropsRef.current,
            {
              id,
              item,
              lane,
              y: -DROP_SIZE,
              speed:
                BASE_DROP_SPEED +
                Math.min(28, clearedRef.current * 0.6) +
                Math.random() * 10,
              status: 'falling' as const,
              spawnedAt: performance.now(),
              recognitionCycleId: cycleId,
            },
          ]);
          if (tutorialPhase === null) beginOfficialAttempt();
          setListening(true);
        } catch {
          setListening(false);
        } finally {
          preparingDropRef.current = false;
          const hasActiveDrop = dropsRef.current.some(
            (drop) =>
              drop.status === 'falling' ||
              drop.status === 'checking' ||
              drop.status === 'targeted',
          );
          if (
            gameRunningRef.current &&
            !gameOverRef.current &&
            !hasActiveDrop
          ) {
            scheduleDropPreparationRetry();
          }
        }
      })();
    },
    dropsRef.current.length === 0
      ? 0
      : tutorialPhase === 'practice'
        ? 500
        : rushActive
          ? RUSH_DROP_DELAY_MS
          : NEXT_DROP_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (!preparationStarted) preparingDropRef.current = false;
    };
  }, [
    activeDropCount,
    arenaSize.height,
    dropPreparationRetryKey,
    gameRunning,
    gameOver,
    permissionPhase,
    playableItems,
    practiceItems,
    beginOfficialAttempt,
    rushActive,
    scheduleDropPreparationRetry,
    tutorialPhase,
    updateDrops,
  ]);

  useEffect(() => {
    if (
      permissionPhase !== 'ready' ||
      !gameRunning ||
      gameOver ||
      arenaSize.height <= 0
    ) {
      return;
    }
    let frame = 0;
    let lastTime = performance.now();
    let lastPaint = lastTime;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (now - lastPaint >= 32) {
        lastPaint = now;
        const newlyCheckingDrops: FallingEmoji[] = [];
        const settledByLane = Array.from({ length: LANE_COUNT }, (_, lane) =>
          dropsRef.current
            .filter((drop) => drop.lane === lane && drop.status === 'settled')
            .sort((a, b) => b.y - a.y),
        );
        const next = dropsRef.current.map((drop) => {
          if (drop.status !== 'falling') return drop;
          const settledCount = settledByLane[drop.lane].length;
          const landingY =
            arenaSize.height - DROP_SIZE - settledCount * (DROP_SIZE * 0.86);
          const fallProgress = Math.max(
            0,
            Math.min(1, (drop.y + DROP_SIZE) / Math.max(1, landingY + DROP_SIZE)),
          );
          const normalFallAcceleration =
            NORMAL_DROP_START_MULTIPLIER +
            (NORMAL_DROP_END_MULTIPLIER - NORMAL_DROP_START_MULTIPLIER) * fallProgress;
          const speedMultiplier =
            (tutorialPracticeRef.current
              ? TUTORIAL_SPEED_MULTIPLIER
              : adaptiveSpeedRef.current) *
            (rushActiveRef.current ? RUSH_SPEED_MULTIPLIER : normalFallAcceleration);
          const y = Math.min(
            landingY,
            drop.y + drop.speed * speedMultiplier * dt * 2,
          );
          if (y < landingY) return { ...drop, y };
          const checking = {
            ...drop,
            y: landingY,
            status: 'checking' as const,
          };
          newlyCheckingDrops.push(checking);
          return checking;
        });
        updateDrops(next);
        for (const landed of newlyCheckingDrops) {
          if (landingGraceTimersRef.current.has(landed.id)) continue;
          const timer = window.setTimeout(() => {
            landingGraceTimersRef.current.delete(landed.id);
            if (gameOverRef.current) return;
            const current = dropsRef.current.find(
              (drop) => drop.id === landed.id,
            );
            if (!current || current.status !== 'checking') return;
            const settled = {
              ...current,
              status: 'settled' as const,
            };
            updateDrops(
              dropsRef.current.map((drop) =>
                drop.id === landed.id ? settled : drop,
              ),
            );
            recordWrong(settled.id);
            showLandedMissed(settled.item.word);
          }, LANDING_SPEECH_GRACE_MS);
          landingGraceTimersRef.current.set(landed.id, timer);
        }
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [
    arenaSize.height,
    gameRunning,
    gameOver,
    permissionPhase,
    recordWrong,
    showLandedMissed,
    updateDrops,
  ]);

  const blocked = playableItems.length === 0 || permissionPhase !== 'ready';

  return (
    <div className="fixed inset-0 z-[180] flex flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_10%,#d8f7ff_0%,#8bdcf6_34%,#5784d9_68%,#312d72_100%)] text-white">
      <div
        className="relative z-20 flex items-center justify-between gap-3 px-4 pb-3"
        style={{ paddingTop: 'max(14px, env(safe-area-inset-top))' }}
      >
        <motion.button
          type="button"
          whileTap={MOTION_PRESS_TAP}
          onClick={onExit}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/60 bg-white/20 shadow-lg backdrop-blur-md"
          aria-label={copy.exit}
        >
          <X size={20} aria-hidden />
        </motion.button>
        <div className="min-w-0 text-center">
          <div className="truncate text-xl font-black tracking-tight">
            🎤 {copy.title}
          </div>
          <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-bold text-white/85">
            {listening ? <Mic size={12} aria-hidden /> : <MicOff size={12} aria-hidden />}
            {permissionPhase === 'requesting' ? copy.preparing : copy.listening}
            <span
              className="ml-1 flex h-3 items-end gap-[2px]"
              aria-hidden
            >
              {[0.25, 0.45, 0.7, 1].map((weight) => (
                <span
                  key={weight}
                  className="w-[3px] rounded-full bg-emerald-200 transition-[height] duration-75"
                  style={{
                    height: listening
                      ? `${Math.max(2, 2 + micLevel * weight * 10)}px`
                      : '2px',
                  }}
                />
              ))}
            </span>
          </div>
        </div>
        <motion.div
          className={cn(
            'min-w-[88px] rounded-2xl border px-3 py-1.5 text-center shadow-lg backdrop-blur-md',
            rushActive
              ? 'border-rose-200 bg-rose-500/80'
              : 'border-white/50 bg-white/20',
          )}
          animate={rushActive && gameRunning ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={
            rushActive && gameRunning
              ? { duration: 0.8, repeat: Infinity }
              : { duration: 0.15 }
          }
        >
          <div className="text-[8px] font-black uppercase tracking-wider text-white/80">
            {rushActive ? copy.rush : copy.time}
          </div>
          <div className="text-xl font-black tabular-nums">
            {formatCountdown(secondsLeft)}
          </div>
          <div className="text-[9px] font-black text-white/80">
            {copy.score} {score}
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 flex min-h-10 items-center justify-between gap-3 px-4 pb-3">
        {tutorialPhase === null ? (
          <div className="rounded-full border border-white/40 bg-[#17154c]/30 px-3 py-2 text-[11px] font-black text-white/90 shadow-sm backdrop-blur">
            🏁 {copy.attemptNumber(displayedAttemptNumber)}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center justify-end gap-3">
          {roundStarted && countIn === null && tutorialPhase === null && (
            <motion.button
              type="button"
              whileTap={MOTION_PRESS_TAP}
              onClick={() => void (gameRunning ? pauseGame() : startGame())}
              disabled={blocked || gameOver}
              className={cn(
                'flex min-w-[92px] items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-black shadow-md',
                gameRunning
                  ? 'border-amber-100/80 bg-amber-300 text-amber-950'
                  : 'border-emerald-100/80 bg-emerald-400 text-emerald-950',
                (blocked || gameOver) && 'cursor-not-allowed opacity-45',
              )}
              aria-label={gameRunning ? copy.pause : copy.start}
            >
              {gameRunning ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
              {gameRunning ? copy.pause : copy.start}
            </motion.button>
          )}
          {roundStarted &&
            !gameRunning &&
            countIn === null &&
            permissionPhase === 'ready' &&
            !gameOver ? (
            <div className="rounded-full border border-white/40 bg-[#17154c]/35 px-3 py-2 text-[11px] font-black backdrop-blur">
              {copy.paused}
            </div>
          ) : null}
        </div>
      </div>

      <div ref={arenaRef} className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence>
          {rushActive && gameRunning && (
            <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
              <motion.div
                className="rounded-full border border-rose-100 bg-rose-500/90 px-5 py-2 text-sm font-black tracking-wider text-white shadow-lg"
                initial={{ opacity: 0, y: -14, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: [1, 1.06, 1] }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                ⚡ {copy.rush}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {tutorialPhase === 'practice' && (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
            <div className="rounded-full border border-emerald-100 bg-emerald-500/90 px-4 py-2 text-xs font-black text-white shadow-lg">
              🎓 {copy.tutorialProgress(tutorialCleared)}
            </div>
          </div>
        )}

        {permissionPhase === 'ready' &&
          tutorialPhase === null &&
          !roundStarted &&
          countIn === null &&
          !gameOver && (
            <div className="absolute inset-x-0 top-[34%] z-[60] flex justify-center px-6">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border border-white/60 bg-[#17154c]/35 px-4 py-2 text-center text-[11px] font-black text-white shadow-md backdrop-blur">
                  ⭐ {copy.staminaRule}
                </div>
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => void startGame()}
                  className="flex min-w-[210px] items-center justify-center gap-3 rounded-[28px] border-2 border-white bg-gradient-to-b from-emerald-300 to-emerald-500 px-8 py-5 text-xl font-black text-emerald-950 shadow-[0_12px_0_#087f5b,0_20px_36px_rgba(23,21,76,0.35)]"
                  initial={{ opacity: 0, scale: 0.75, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  <Play size={24} fill="currentColor" aria-hidden />
                  {copy.startGame}
                </motion.button>
              </div>
            </div>
          )}

        <AnimatePresence>
          {countIn !== null && (
            <motion.div
              key={countIn}
              className="pointer-events-none absolute inset-0 z-[65] grid place-items-center"
              initial={{ opacity: 0, scale: 0.45 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.45 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-white/90">
                  {copy.getReady}
                </div>
                <div className="mt-1 text-8xl font-black text-white drop-shadow-[0_6px_0_#155e75]">
                  {countIn}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {permissionPhase === 'ready' && tutorialPhase === 'intro' && (
          <div className="absolute inset-0 z-[65] grid place-items-center bg-[#17133d]/48 px-6 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-sm rounded-[30px] border border-white/80 bg-white/96 px-6 py-7 text-center text-sky-950 shadow-2xl"
              initial={{ opacity: 0, scale: 0.78, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
            >
              <div className="text-5xl">🎙️</div>
              <h2 className="mt-3 text-2xl font-black">{copy.tutorialTitle}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-sky-800/80">
                {copy.tutorialBody}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                {practiceItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-0 flex-1 rounded-2xl bg-sky-50 px-2 py-3"
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="mt-1 truncate text-[10px] font-black text-sky-800">
                      {item.word}
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={() => void startTutorialPractice()}
                className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
              >
                <Mic size={17} aria-hidden />
                {copy.tutorialPractice}
              </motion.button>
            </motion.div>
          </div>
        )}

        {permissionPhase === 'ready' && tutorialPhase === 'complete' && (
          <div className="absolute inset-0 z-[65] grid place-items-center bg-[#17133d]/48 px-6 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-sm rounded-[30px] border border-white/80 bg-white/96 px-6 py-7 text-center text-sky-950 shadow-2xl"
              initial={{ opacity: 0, scale: 0.76, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
            >
              <div className="text-5xl">🎉</div>
              <h2 className="mt-3 text-2xl font-black">
                {copy.tutorialCompleteTitle}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-sky-800/80">
                {copy.tutorialCompleteBody}
              </p>
              <div className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">
                ⭐ {copy.staminaRule}
              </div>
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={() => void finishTutorial()}
                className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
              >
                {copy.tutorialContinue}
              </motion.button>
            </motion.div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#17133d]/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-3xl opacity-70">
          🏰
        </div>

        {drops.map((drop) => {
          const x = drop.lane * laneWidth + laneWidth / 2 - DROP_SIZE / 2;
          return (
            <motion.div
              key={drop.id}
              className={cn(
                'pointer-events-none absolute flex flex-col items-center justify-center rounded-[18px] border border-white/80 bg-white/90 shadow-[0_8px_18px_rgba(26,33,80,0.28)]',
                drop.status === 'targeted' && 'ring-4 ring-amber-300',
              )}
              style={{ width: DROP_SIZE, height: DROP_SIZE, left: x, top: drop.y }}
              animate={
                drop.status === 'targeted'
                  ? { scale: [1, 1.13, 0.96, 1.08], rotate: [0, -8, 7, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={
                drop.status === 'targeted'
                  ? { duration: 0.36, repeat: Infinity }
                  : { duration: 0.12 }
              }
            >
              <span
                className={cn(
                  'leading-none',
                  drop.status === 'settled' ? 'text-[27px]' : 'text-[34px]',
                )}
              >
                {drop.item.emoji}
              </span>
              {drop.status === 'settled' && (
                <span className="mt-0.5 max-w-[48px] truncate px-0.5 text-[8px] font-black leading-none text-sky-950">
                  {drop.item.word}
                </span>
              )}
            </motion.div>
          );
        })}

        <AnimatePresence>
          {projectile && (
            <motion.div
              key={projectile.id}
              className="pointer-events-none absolute z-30 text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
              initial={{ x: projectile.fromX, y: projectile.fromY, scale: 0.7, rotate: -15 }}
              animate={{ x: projectile.toX, y: projectile.toY, scale: 1.25, rotate: 12 }}
              exit={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: PROJECTILE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
            >
              {projectile.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {explosion && (
            <motion.div
              key={explosion.id}
              className="pointer-events-none absolute z-40 grid place-items-center text-5xl"
              style={{ left: explosion.x, top: explosion.y }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.5, 1.1, 2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
            >
              💥
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {lastHeard && gameRunning && !centerPrompt && (
            <motion.div
              key={lastHeard}
              className="pointer-events-none absolute inset-x-5 top-[43%] z-40 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              aria-live="polite"
            >
              <div className="truncate text-xl font-bold text-white/92 drop-shadow-[0_2px_5px_rgba(23,21,76,0.45)]">
                {lastHeard}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {centerPrompt && (
            <motion.div
              key={centerPrompt.id}
              className="pointer-events-none absolute inset-x-0 top-[43%] z-50 mx-auto w-fit max-w-[88%] rounded-[22px] bg-rose-600/88 px-6 py-3 text-center text-3xl font-black text-white shadow-[0_8px_24px_rgba(127,29,29,0.38)]"
              initial={{ opacity: 0, scale: 0.65, y: 16 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.65, 1.12, 1, 0.9], y: [16, 0, 0, -18] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
            >
              <div>{centerPrompt.text}</div>
              {centerPrompt.detail && (
                <div className="mt-1 max-w-[280px] truncate text-sm font-bold text-rose-100">
                  {centerPrompt.detail}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {blocked && (
          <div className="absolute inset-0 z-[70] grid place-items-center bg-[#17133d]/55 px-6 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-[28px] border border-white/70 bg-white/95 px-6 py-7 text-center text-sky-950 shadow-2xl">
              <div className="text-5xl" aria-hidden>
                {playableItems.length === 0 ? '📚' : permissionPhase === 'unsupported' ? '📱' : '🎙️'}
              </div>
              <h2 className="mt-3 text-xl font-black">
                {playableItems.length === 0
                  ? copy.learnedNeededTitle
                  : permissionPhase === 'unsupported'
                    ? copy.unsupportedTitle
                    : permissionPhase === 'requesting'
                      ? copy.preparing
                      : copy.permissionTitle}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-sky-800/80">
                {playableItems.length === 0
                  ? copy.learnedNeededBody
                  : permissionPhase === 'unsupported'
                    ? copy.unsupportedBody
                    : copy.permissionBody}
              </p>
              {playableItems.length > 0 &&
                permissionPhase !== 'requesting' &&
                permissionPhase !== 'unsupported' && (
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={() => void authorizeAndStart()}
                    className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
                  >
                    {copy.retryPermission}
                  </motion.button>
                )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={onExit}
                className="candy-sheet-action-btn candy-sheet-action-btn-blue mt-2 w-full"
              >
                {copy.exit}
              </motion.button>
            </div>
          </div>
        )}

        {gameOver && gameResult && (
          <div className="absolute inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#17133d]/62 px-6 py-4 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-sm rounded-[30px] border border-white/80 bg-white/96 px-6 py-7 text-center text-sky-950 shadow-2xl"
              initial={{ opacity: 0, scale: 0.72, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 25 }}
            >
              <div className="text-5xl" aria-hidden>
                {gameResult.kind === 'success' ? '🏆' : '💥'}
              </div>
              <h2 className="mt-3 text-2xl font-black">
                {gameResult.kind === 'success'
                  ? gameResult.staminaReward === 'granted'
                    ? `❤️ ${copy.staminaReward}`
                    : gameResult.staminaReward === 'banked'
                      ? `❤️ ${copy.staminaBanked}`
                      : gameResult.staminaReward === 'daily-limit'
                        ? copy.threeStarTitle
                        : copy.successTitle
                  : copy.failureTitle}
              </h2>
              <p
                className={cn(
                  'mt-1 text-sm font-bold',
                  gameResult.kind === 'success'
                    ? 'text-emerald-600'
                    : 'text-rose-600',
                )}
              >
                {gameResult.kind === 'success'
                  ? gameResult.staminaReward === 'daily-limit'
                    ? copy.staminaDailyLimit
                    : copy.successBody
                  : copy.gameOver}
              </p>

              {gameResult.kind === 'success' && (
                <div className="mt-4 flex justify-center gap-1 text-4xl">
                  {[1, 2, 3].map((star) => (
                    <motion.span
                      key={star}
                      initial={{ opacity: 0, scale: 0, rotate: -25 }}
                      animate={{
                        opacity: star <= gameResult.stars ? 1 : 0.25,
                        scale: 1,
                        rotate: 0,
                        filter:
                          star <= gameResult.stars
                            ? 'grayscale(0)'
                            : 'grayscale(1)',
                      }}
                      transition={{ delay: star * 0.14, type: 'spring' }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-fuchsia-50 px-3 py-4">
                  <div className="text-[10px] font-bold text-fuchsia-700">
                    {copy.accuracy}
                  </div>
                  <div className="text-xl font-black">
                    {gameResult.accuracy === null
                      ? '—'
                      : `${Math.round(gameResult.accuracy * 100)}%`}
                  </div>
                  {gameResult.newBestAccuracy && (
                    <div className="mt-1 text-[9px] font-black tracking-wide text-emerald-600">
                      🏆 {copy.newBest}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl bg-amber-50 px-3 py-4">
                  <div className="text-[10px] font-bold text-amber-700">
                    {copy.bestStreak}
                  </div>
                  <div className="text-xl font-black">{gameResult.bestStreak}</div>
                  {gameResult.newBestStreak && (
                    <div className="mt-1 text-[9px] font-black tracking-wide text-emerald-600">
                      🏆 {copy.newBest}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl bg-sky-50 px-3 py-4">
                  <div className="text-[10px] font-bold text-sky-700">
                    {copy.blasted}
                  </div>
                  <div className="text-xl font-black">{gameResult.blasted}</div>
                </div>
                <div className="rounded-2xl bg-rose-50 px-3 py-4">
                  <div className="text-[10px] font-bold text-rose-700">
                    {copy.missed}
                  </div>
                  <div className="text-xl font-black">{gameResult.missed}</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-black text-sky-800/70">
                {copy.score}: {score}
              </div>

              <div className="mt-3 rounded-2xl bg-violet-50 px-4 py-3 text-violet-900">
                <div className="text-sm font-black">
                  🏁 {copy.challengeCompleted(gameResult.attemptNumber)}
                </div>
                <div className="mt-1 text-xs font-bold text-violet-700/80">
                  {copy.careerBlasted(gameResult.careerTotalBlasted)}
                </div>
              </div>

              {gameResult.milestone !== null && (
                <div className="mt-3 rounded-2xl bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-3 text-sm font-black text-rose-700">
                  🎉 {copy.milestoneReached(gameResult.milestone)}
                </div>
              )}

              {(gameResult.newBestAccuracy || gameResult.newBestStreak) && (
                <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                  🏆{' '}
                  {[
                    gameResult.newBestAccuracy ? copy.newAccuracyRecord : null,
                    gameResult.newBestStreak ? copy.newStreakRecord : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                </div>
              )}

              {gameResult.kind === 'success' && gameResult.ratingTip && (
                <div className="mt-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-black text-sky-800">
                  🎯 {copy.nextGoal}: {gameResult.ratingTip}
                </div>
              )}

              {gameResult.staminaReward === null && (
                <div className="mt-3 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 px-4 py-3 text-sm font-black text-rose-700">
                  ❤️{' '}
                  {gameResult.kind === 'success'
                    ? copy.staminaAlmost
                    : copy.staminaFailureEncouragement}
                </div>
              )}

              {returnToAdventure && gameResult.staminaReward === 'granted' && onContinueAdventure ? (
                <>
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={onContinueAdventure}
                    className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
                  >
                    ⚡️ {ui.deadMachine.continueSet}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={() => void resetGame()}
                    className="candy-sheet-action-btn candy-sheet-action-btn-blue mt-2 w-full"
                  >
                    <RotateCcw size={16} aria-hidden />
                    {STAY_LABEL[locale]}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => void resetGame()}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
                >
                  <RotateCcw size={16} aria-hidden />
                  {copy.tryAgain}
                </motion.button>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={onExit}
                className={returnToAdventure && gameResult.staminaReward === 'granted'
                  ? 'mt-3 px-3 py-1.5 text-xs font-bold text-sky-900/55'
                  : 'candy-sheet-action-btn candy-sheet-action-btn-blue mt-2 w-full'}
              >
                {returnToAdventure ? ui.deadMachine.later : copy.exit}
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
