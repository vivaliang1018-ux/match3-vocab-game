import type { Locale } from './types';

export type AppUiCopy = {
  progressSaved: string;
  home: {
    continueAdventure: string;
    startAdventure: string;
    welcomeBack: string;
    readyToStart: string;
    todaysProgress: string;
    reviewReady: (n: number) => string;
    sayBlastStaminaEntry: string;
  };
  accountPrompt: {
    streakTitle: string;
    collectionTitle: string;
    streakBody: string;
    collectionBody: (n: number) => string;
    create: string;
    signIn: string;
    continueWithoutStreak: string;
    notNow: string;
  };
  roundResult: {
    aria: string;
    reviewUnlocked: string;
    categoryUnlocked: string;
    collectionAdded: (n: number) => string;
    dayStreak: (n: number) => string;
    strengthened: string;
    discovered: (n: number) => string;
    perfect: string;
    setComplete: string;
    congratulations: string;
    awardReady: string;
    claimed: string;
    claim: string;
    nextGoal: string;
    startReview: string;
    nextSet: string;
    viewCollection: string;
  };
  deadMachine: {
    continueSet: string;
    chargedHint: string;
    earnStamina: string;
    earnStaminaHint: string;
    reinforce: string;
    reinforceHint: string;
    playMood: string;
    playMoodHint: string;
    playReview: string;
    chargingComplete: string;
    machineReady: string;
    nextStamina: string;
    later: string;
  };
  learned: {
    ready: string;
    fortified: string;
    growing: string;
    learnedCount: (n: number) => string;
    shieldsDue: (n: number) => string;
    dueHint: string;
    reviewSix: string;
    startReview: string;
    stable: string;
    stableUntilTomorrow: string;
    nextReview: (countdown: string) => string;
    myWords: string;
    all: string;
    reinforce: string;
    empty: string;
    shieldReady: string;
    growingWithCountdown: (countdown: string) => string;
  };
  game: {
    newDiscovery: string;
    complete: string;
    swapTutorial: string;
    reviewTutorial: string;
    freeMoveHint: string;
    crossMoveHint: string;
  };
  mode: {
    moodDescription: string;
    moodDailyLimitReached: string;
    sayBlastNeedsWords: string;
  };
  resultGoals: {
    reviewChoice: string;
    categoryUnlock: (n: number) => string;
    strengthen: string;
    discoverSix: string;
    forcedReview: string;
    anotherTheme: string;
  };
  rescue: {
    wrong: (n: number) => string;
    failed: string;
    offerTitle: string;
    offerBody: (n: number) => string;
    save: string;
    retryTitle: string;
    retryBody: string;
    continueMoves: string;
  };
};

const en: AppUiCopy = {
  progressSaved: 'Progress saved',
  home: { continueAdventure: 'Continue Adventure', startAdventure: 'Start Adventure', welcomeBack: 'Welcome back', readyToStart: 'Ready to start', todaysProgress: 'Today’s progress', reviewReady: n => `${n} ${n === 1 ? 'word is' : 'words are'} ready to review`, sayBlastStaminaEntry: 'Say & Blast · 3 stars +1 stamina' },
  accountPrompt: { streakTitle: 'Protect your 7-day streak', collectionTitle: 'Keep your collection safe', streakBody: 'Sign in to continue a 7-day streak and keep it safely backed up.', collectionBody: n => `You’ve discovered ${n} ${n === 1 ? 'emoji' : 'emojis'}. Create an account to back up your collection and keep your progress across devices.`, create: 'Create account', signIn: 'Already have an account? Sign in', continueWithoutStreak: 'Continue without the long-term streak', notNow: 'Not now' },
  roundResult: { aria: 'Set results', reviewUnlocked: 'Memory Challenge unlocked', categoryUnlocked: 'Category Mode unlocked', collectionAdded: n => `Collection +${n}`, dayStreak: n => `${n}-day streak`, strengthened: 'Memory strengthened!', discovered: n => `${n} new ${n === 1 ? 'Emoji' : 'Emojis'} discovered!`, perfect: '✨ Perfect Memory Check!', setComplete: '🎉 Set complete!', congratulations: 'Congratulations!', awardReady: 'Achievement badge unlocked', claimed: '✓ Claimed', claim: 'Claim achievement & badge', nextGoal: 'Next goal: ', startReview: 'Start Memory Challenge', nextSet: 'Next set', viewCollection: 'View these Emojis in my collection' },
  deadMachine: { continueSet: 'Continue to the next set', chargedHint: 'The machine is charged', earnStamina: 'Earn stamina in Say & Blast', earnStaminaHint: 'Earn 3 stars for +1 stamina', reinforce: 'Reinforce memory', reinforceHint: 'Adventure is paused; Memory Challenge is ready', playMood: 'Play Mood Board', playMoodHint: 'A lighter mode that costs no stamina', playReview: 'Play Memory Challenge', chargingComplete: 'Charging complete', machineReady: 'The machine is ready for the next set.', nextStamina: 'Next stamina', later: 'Play later' },
  learned: { ready: 'Ready to reinforce', fortified: 'Fortified', growing: 'Growing', learnedCount: n => `${n} ${n === 1 ? 'word' : 'words'} learned`, shieldsDue: n => `${n} memory ${n === 1 ? 'shield needs' : 'shields need'} reinforcement`, dueHint: 'Start with the words that need you most', reviewSix: 'Review 6 →', startReview: 'Start review →', stable: 'Memory shields stable', stableUntilTomorrow: 'Shields stable · Come back tomorrow', nextReview: c => `Next review ${c}`, myWords: 'My words', all: 'All', reinforce: 'Reinforce', empty: 'No words here yet', shieldReady: 'Memory shield ready to reinforce', growingWithCountdown: c => `Next review ${c}` },
  game: { newDiscovery: 'New discovery', complete: 'Complete', swapTutorial: 'Match 3 identical Emoji\nUses 1 move', reviewTutorial: 'Use the prompt to find 3 matching Emoji', freeMoveHint: 'Match 4 identical Emoji\nRefund this move', crossMoveHint: 'Make a T or cross match\nEarn +1 move' },
  mode: {
    moodDescription: 'One color theme each day · up to 3 boards',
    moodDailyLimitReached: 'Mood Board limit reached for today — come back tomorrow',
    sayBlastNeedsWords: 'Complete the first Adventure set to learn 6 words',
  },
  resultGoals: { reviewChoice: 'Keep reviewing or return to new words', categoryUnlock: n => `${n} more ${n === 1 ? 'set' : 'sets'} → 🧩 Category Mode`, strengthen: 'Strengthen these words in Memory Challenge', discoverSix: 'Discover the next 6 emoji names', forcedReview: 'Three sets complete — try Memory Challenge', anotherTheme: 'Try another theme or six more words' },
  rescue: { wrong: n => `Wrong match! ${n} ${n === 1 ? 'chance' : 'chances'} left`, failed: 'Oh no 😅 Challenge failed', offerTitle: 'So close! Here’s a chance to save it 💗', offerBody: n => `${n > 0 ? `${n} ${n === 1 ? 'word' : 'words'} left. ` : ''}Match the prompted emoji before time runs out to revive.`, save: 'Save it!', retryTitle: 'Rescue failed 😵‍💫', retryBody: 'Try the set again with 8 bonus moves!', continueMoves: 'Continue · +8 moves' },
};

const zhCN: AppUiCopy = {
  progressSaved: '进度已保存',
  home: { continueAdventure: '继续闯关', startAdventure: '开始闯关', welcomeBack: '欢迎回来', readyToStart: '准备开始', todaysProgress: '今日进度', reviewReady: n => `${n} 个词需要复习`, sayBlastStaminaEntry: '开口出击 · 三星 +1 体力' },
  accountPrompt: { streakTitle: '守护你的 7 天连续记录', collectionTitle: '保护你的 Emoji 图鉴', streakBody: '登录后才能建立 7 天及以上的长期连续记录，并在云端安全保存进度。', collectionBody: n => `你已经发现了 ${n} 个 Emoji。创建账户即可备份图鉴并跨设备保存进度。`, create: '创建账户', signIn: '已有账户？登录', continueWithoutStreak: '暂不登录，继续普通游戏', notNow: '暂时不要' },
  roundResult: { aria: '本组结算', reviewUnlocked: '记忆挑战已解锁', categoryUnlocked: '分类模式已解锁', collectionAdded: n => `图鉴 +${n}`, dayStreak: n => `连续 ${n} 天`, strengthened: '记忆加深了！', discovered: n => `已经发现了 ${n} 个 Emoji！`, perfect: '✨ 完美记忆检查！', setComplete: '🎉 本组完成！', congratulations: '恭喜你！', awardReady: '新成就和徽章已解锁', claimed: '✓ 已领取', claim: '领取成就和徽章', nextGoal: '下一个目标：', startReview: '开始记忆挑战', nextSet: '下一组', viewCollection: '看看刚加入图鉴的 Emoji' },
  deadMachine: { continueSet: '继续下一组', chargedHint: '机器已经充好电了', earnStamina: '去开口出击 练发音', earnStaminaHint: '三星通关 · +1 体力', reinforce: '加固记忆护盾', reinforceHint: '冒险暂停，记忆挑战仍可继续', playMood: '玩心情色盘', playMoodHint: '换个轻松玩法，不消耗体力', playReview: '来一局记忆挑战', chargingComplete: '充电完成', machineReady: '机器已经准备好，可以继续下一组。', nextStamina: '下一点体力', later: '稍后再玩' },
  learned: { ready: '可加固', fortified: '已稳固', growing: '正在扎根', learnedCount: n => `已学 ${n} 个单词`, shieldsDue: n => `${n} 个词的记忆护盾需要加固`, dueHint: '先从最需要巩固的词开始', reviewSix: '进入记忆挑战 →', startReview: '开始加固 →', stable: '记忆护盾稳定', stableUntilTomorrow: '护盾稳定 · 明日再来', nextReview: c => `下次复习：${c}`, myWords: '我的单词', all: '全部', reinforce: '待加固', empty: '这里暂时没有单词', shieldReady: '记忆护盾变弱 · 可加固', growingWithCountdown: c => `正在扎根 · ${c}` },
  game: { newDiscovery: '首次发现', complete: '已完成', swapTutorial: '连成 3 个相同 Emoji\n消耗 1 步', reviewTutorial: '根据提示词，找到对应可连成3个的 Emoji', freeMoveHint: '连成 4 个相同 Emoji\n将不消耗步数', crossMoveHint: '连成 T 字或十字\n奖励 +1 步！' },
  mode: {
    moodDescription: '每天固定一个色系 · 最多 3 盘',
    moodDailyLimitReached: '今日心情棋盘次数已用完，明天再来吧',
    sayBlastNeedsWords: '完成第 1 组闯关，学会 6 个单词后开始',
  },
  resultGoals: { reviewChoice: '选择继续复习，或回到新词闯关', categoryUnlock: n => `再完成 ${n} 组 → 🧩 分类模式`, strengthen: '现在用刚学过的词完成记忆挑战', discoverSix: '继续发现下一组 6 个新词', forcedReview: '已完成三组闯关，来试试记忆挑战', anotherTheme: '换一个主题，或继续新的六个词' },
  rescue: { wrong: n => `答错了！还剩 ${n} 次机会`, failed: '哎呀 😅 闯关失败', offerTitle: '差一点！给你机会救回来 💗', offerBody: n => `${n > 0 ? `还有 ${n} 个词差一点。` : ''}根据提示，在限时内匹配 Emoji，成功即可复活。`, save: '救回来！', retryTitle: '复活失败 😵‍💫', retryBody: '重新挑战，并获得 8 步助力！', continueMoves: '继续闯关 · +8 步' },
};

const es: AppUiCopy = {
  progressSaved: 'Progreso guardado',
  home: { continueAdventure: 'Continuar la aventura', startAdventure: 'Comenzar la aventura', welcomeBack: 'Te damos la bienvenida de nuevo', readyToStart: 'Todo listo para empezar', todaysProgress: 'Progreso de hoy', reviewReady: n => `${n} ${n === 1 ? 'palabra está' : 'palabras están'} lista${n === 1 ? '' : 's'} para repasar`, sayBlastStaminaEntry: 'Di y dispara · 3 estrellas +1 energía' },
  accountPrompt: { streakTitle: 'Protege tu racha de 7 días', collectionTitle: 'Protege tu colección', streakBody: 'Inicia sesión para mantener una racha de 7 días y guardar una copia de seguridad.', collectionBody: n => `Has descubierto ${n} ${n === 1 ? 'emoji' : 'emojis'}. Crea una cuenta para guardar tu colección y tu progreso en todos tus dispositivos.`, create: 'Crear una cuenta', signIn: '¿Ya tienes una cuenta? Inicia sesión', continueWithoutStreak: 'Continuar sin la racha larga', notNow: 'Ahora no' },
  roundResult: { aria: 'Resultados del set', reviewUnlocked: 'Desafío de memoria desbloqueado', categoryUnlocked: 'Modo por categorías desbloqueado', collectionAdded: n => `Colección +${n}`, dayStreak: n => `Racha de ${n} días`, strengthened: '¡Memoria reforzada!', discovered: n => `¡${n} ${n === 1 ? 'Emoji nuevo descubierto' : 'Emojis nuevos descubiertos'}!`, perfect: '✨ ¡Control de memoria perfecto!', setComplete: '🎉 ¡Set completado!', congratulations: '¡Felicidades!', awardReady: 'Logro e insignia desbloqueados', claimed: '✓ Recibido', claim: 'Recibir logro e insignia', nextGoal: 'Siguiente objetivo: ', startReview: 'Iniciar el desafío de memoria', nextSet: 'Siguiente set', viewCollection: 'Ver estos Emojis en mi colección' },
  deadMachine: { continueSet: 'Continuar con el siguiente set', chargedHint: 'La máquina está cargada', earnStamina: 'Ganar energía en Di y dispara', earnStaminaHint: 'Consigue 3 estrellas para ganar +1 de energía', reinforce: 'Reforzar la memoria', reinforceHint: 'La aventura está en pausa; el desafío de memoria está disponible', playMood: 'Jugar al tablero de colores', playMoodHint: 'Un modo más relajado que no consume energía', playReview: 'Jugar al desafío de memoria', chargingComplete: 'Carga completada', machineReady: 'La máquina está lista para el siguiente set.', nextStamina: 'Próximo punto de energía', later: 'Jugar más tarde' },
  learned: { ready: 'Listo para reforzar', fortified: 'Reforzado', growing: 'En progreso', learnedCount: n => `${n} ${n === 1 ? 'palabra aprendida' : 'palabras aprendidas'}`, shieldsDue: n => `${n} ${n === 1 ? 'escudo necesita' : 'escudos necesitan'} refuerzo`, dueHint: 'Empieza por las palabras que más lo necesitan', reviewSix: 'Repasar 6 →', startReview: 'Empezar el repaso →', stable: 'Escudos de memoria estables', stableUntilTomorrow: 'Escudos estables · Vuelve mañana', nextReview: c => `Próximo repaso ${c}`, myWords: 'Mis palabras', all: 'Todas', reinforce: 'Reforzar', empty: 'Aún no hay palabras aquí', shieldReady: 'Escudo de memoria listo para reforzar', growingWithCountdown: c => `Próximo repaso ${c}` },
  game: { newDiscovery: 'Nuevo descubrimiento', complete: 'Completado', swapTutorial: 'Junta 3 Emoji iguales\nCada intercambio usa 1 movimiento', reviewTutorial: 'Sigue la pista y junta 3 Emoji correspondientes', freeMoveHint: 'Junta 4 Emoji iguales\nSe devuelve este movimiento', crossMoveHint: 'Forma una T o una cruz\nObtienes +1 movimiento' },
  mode: {
    moodDescription: 'Un tema de color al día · hasta 3 tableros',
    moodDailyLimitReached: 'Límite diario del tablero de colores alcanzado — vuelve mañana',
    sayBlastNeedsWords: 'Completa el primer set de Aventura para aprender 6 palabras',
  },
  resultGoals: { reviewChoice: 'Sigue repasando o vuelve a las palabras nuevas', categoryUnlock: n => `${n} ${n === 1 ? 'set más' : 'sets más'} → 🧩 Modo por categorías`, strengthen: 'Refuerza estas palabras en el desafío de memoria', discoverSix: 'Descubre los nombres de los próximos 6 Emojis', forcedReview: 'Tres sets completados: prueba el desafío de memoria', anotherTheme: 'Prueba otro tema u otras seis palabras' },
  rescue: { wrong: n => `¡Combinación incorrecta! Queda${n === 1 ? '' : 'n'} ${n} ${n === 1 ? 'intento' : 'intentos'}`, failed: 'Oh, no 😅 Desafío fallido', offerTitle: '¡Por poco! Tienes una oportunidad para salvarlo 💗', offerBody: n => `${n > 0 ? `Queda${n === 1 ? '' : 'n'} ${n} ${n === 1 ? 'palabra' : 'palabras'}. ` : ''}Combina el Emoji indicado antes de que se acabe el tiempo para revivir.`, save: '¡Salvar!', retryTitle: 'El rescate ha fallado 😵‍💫', retryBody: '¡Repite el set con 8 movimientos extra!', continueMoves: 'Continuar · +8 movimientos' },
};

const fr: AppUiCopy = {
  progressSaved: 'Progression enregistrée',
  home: { continueAdventure: 'Continuer l’aventure', startAdventure: 'Commencer l’aventure', welcomeBack: 'Bon retour', readyToStart: 'Prêt à commencer', todaysProgress: 'Progression du jour', reviewReady: n => `${n} ${n === 1 ? 'mot est prêt' : 'mots sont prêts'} à être révisé${n === 1 ? '' : 's'}`, sayBlastStaminaEntry: 'Dis et explose · 3 étoiles +1 énergie' },
  accountPrompt: { streakTitle: 'Protège ta série de 7 jours', collectionTitle: 'Protège ta collection', streakBody: 'Connecte-toi pour poursuivre une série de 7 jours et la sauvegarder en toute sécurité.', collectionBody: n => `Tu as découvert ${n} ${n === 1 ? 'emoji' : 'emojis'}. Crée un compte pour sauvegarder ta collection et ta progression sur tous tes appareils.`, create: 'Créer un compte', signIn: 'Tu as déjà un compte ? Connecte-toi', continueWithoutStreak: 'Continuer sans la longue série', notNow: 'Pas maintenant' },
  roundResult: { aria: 'Résultats de la série', reviewUnlocked: 'Défi de mémoire débloqué', categoryUnlocked: 'Mode Catégorie débloqué', collectionAdded: n => `Collection +${n}`, dayStreak: n => `Série de ${n} jours`, strengthened: 'Mémoire renforcée !', discovered: n => `${n} ${n === 1 ? 'nouvel Emoji découvert' : 'nouveaux Emojis découverts'} !`, perfect: '✨ Test de mémoire parfait !', setComplete: '🎉 Série terminée !', congratulations: 'Félicitations !', awardReady: 'Succès et badge débloqués', claimed: '✓ Récupéré', claim: 'Récupérer le succès et le badge', nextGoal: 'Prochain objectif : ', startReview: 'Lancer le défi de mémoire', nextSet: 'Série suivante', viewCollection: 'Voir ces Emojis dans ma collection' },
  deadMachine: { continueSet: 'Continuer avec la série suivante', chargedHint: 'La machine est chargée', earnStamina: 'Gagner de l’énergie dans Dis et explose', earnStaminaHint: 'Obtiens 3 étoiles pour gagner +1 énergie', reinforce: 'Renforcer la mémoire', reinforceHint: 'L’aventure est en pause ; le défi de mémoire est disponible', playMood: 'Jouer au tableau de couleurs', playMoodHint: 'Un mode plus tranquille qui ne consomme pas d’énergie', playReview: 'Jouer au défi de mémoire', chargingComplete: 'Recharge terminée', machineReady: 'La machine est prête pour la série suivante.', nextStamina: 'Prochain point d’énergie', later: 'Jouer plus tard' },
  learned: { ready: 'Prêt à renforcer', fortified: 'Renforcé', growing: 'En progression', learnedCount: n => `${n} ${n === 1 ? 'mot appris' : 'mots appris'}`, shieldsDue: n => `${n} ${n === 1 ? 'bouclier doit' : 'boucliers doivent'} être renforcé${n === 1 ? '' : 's'}`, dueHint: 'Commence par les mots qui en ont le plus besoin', reviewSix: 'Réviser 6 →', startReview: 'Commencer la révision →', stable: 'Boucliers de mémoire stables', stableUntilTomorrow: 'Boucliers stables · Reviens demain', nextReview: c => `Prochaine révision ${c}`, myWords: 'Mes mots', all: 'Tous', reinforce: 'À renforcer', empty: 'Aucun mot ici pour le moment', shieldReady: 'Bouclier de mémoire prêt à être renforcé', growingWithCountdown: c => `Prochaine révision ${c}` },
  game: { newDiscovery: 'Nouvelle découverte', complete: 'Terminé', swapTutorial: 'Aligne 3 Emoji identiques\nChaque échange utilise 1 coup', reviewTutorial: 'Suis l’indice et aligne 3 Emoji correspondants', freeMoveHint: 'Aligne 4 Emoji identiques\nCe coup est rendu', crossMoveHint: 'Forme un T ou une croix\nGagne +1 coup' },
  mode: {
    moodDescription: 'Un thème de couleur par jour · jusqu’à 3 plateaux',
    moodDailyLimitReached: 'Limite quotidienne du tableau de couleurs atteinte — reviens demain',
    sayBlastNeedsWords: 'Termine la première série Aventure pour apprendre 6 mots',
  },
  resultGoals: { reviewChoice: 'Continue à réviser ou retourne aux nouveaux mots', categoryUnlock: n => `Encore ${n} ${n === 1 ? 'série' : 'séries'} → 🧩 Mode Catégorie`, strengthen: 'Renforce ces mots dans le défi de mémoire', discoverSix: 'Découvre le nom des 6 prochains Emojis', forcedReview: 'Trois séries terminées : essaie le défi de mémoire', anotherTheme: 'Essaie un autre thème ou six nouveaux mots' },
  rescue: { wrong: n => `Mauvaise association ! Il reste ${n} ${n === 1 ? 'essai' : 'essais'}`, failed: 'Oh non 😅 Défi échoué', offerTitle: 'Presque ! Tu as une chance de le sauver 💗', offerBody: n => `${n > 0 ? `Il reste ${n} ${n === 1 ? 'mot' : 'mots'}. ` : ''}Associe l’Emoji indiqué avant la fin du temps pour revenir en jeu.`, save: 'Le sauver !', retryTitle: 'Sauvetage échoué 😵‍💫', retryBody: 'Recommence la série avec 8 coups supplémentaires !', continueMoves: 'Continuer · +8 coups' },
};

const de: AppUiCopy = {
  progressSaved: 'Fortschritt gespeichert',
  home: { continueAdventure: 'Abenteuer fortsetzen', startAdventure: 'Abenteuer starten', welcomeBack: 'Willkommen zurück', readyToStart: 'Bereit zum Start', todaysProgress: 'Heutiger Fortschritt', reviewReady: n => `${n} ${n === 1 ? 'Wort ist' : 'Wörter sind'} zur Wiederholung bereit`, sayBlastStaminaEntry: 'Sprechen & Treffen · 3 Sterne +1 Energie' },
  accountPrompt: { streakTitle: 'Schütze deine 7-Tage-Serie', collectionTitle: 'Schütze deine Sammlung', streakBody: 'Melde dich an, um deine 7-Tage-Serie fortzusetzen und sicher zu speichern.', collectionBody: n => `Du hast ${n} ${n === 1 ? 'Emoji' : 'Emojis'} entdeckt. Erstelle ein Konto, um deine Sammlung und deinen Fortschritt geräteübergreifend zu sichern.`, create: 'Konto erstellen', signIn: 'Du hast schon ein Konto? Anmelden', continueWithoutStreak: 'Ohne Langzeitserie fortfahren', notNow: 'Nicht jetzt' },
  roundResult: { aria: 'Set-Ergebnis', reviewUnlocked: 'Gedächtnis-Challenge freigeschaltet', categoryUnlocked: 'Kategoriemodus freigeschaltet', collectionAdded: n => `Sammlung +${n}`, dayStreak: n => `${n}-Tage-Serie`, strengthened: 'Gedächtnis gestärkt!', discovered: n => `${n} ${n === 1 ? 'neues Emoji entdeckt' : 'neue Emojis entdeckt'}!`, perfect: '✨ Perfekter Gedächtnistest!', setComplete: '🎉 Set abgeschlossen!', congratulations: 'Glückwunsch!', awardReady: 'Erfolg und Abzeichen freigeschaltet', claimed: '✓ Abgeholt', claim: 'Erfolg und Abzeichen abholen', nextGoal: 'Nächstes Ziel: ', startReview: 'Gedächtnis-Challenge starten', nextSet: 'Nächstes Set', viewCollection: 'Diese Emojis in meiner Sammlung ansehen' },
  deadMachine: { continueSet: 'Mit dem nächsten Set fortfahren', chargedHint: 'Die Maschine ist aufgeladen', earnStamina: 'Energie in Sprechen & Treffen verdienen', earnStaminaHint: '3 Sterne bringen +1 Energie', reinforce: 'Gedächtnis stärken', reinforceHint: 'Das Abenteuer pausiert; die Gedächtnis-Challenge ist bereit', playMood: 'Farbtafel spielen', playMoodHint: 'Ein entspannter Modus ohne Energieverbrauch', playReview: 'Gedächtnis-Challenge spielen', chargingComplete: 'Aufladen abgeschlossen', machineReady: 'Die Maschine ist für das nächste Set bereit.', nextStamina: 'Nächster Energiepunkt', later: 'Später spielen' },
  learned: { ready: 'Bereit zum Stärken', fortified: 'Gefestigt', growing: 'Im Aufbau', learnedCount: n => `${n} ${n === 1 ? 'Wort gelernt' : 'Wörter gelernt'}`, shieldsDue: n => `${n} ${n === 1 ? 'Gedächtnisschild muss' : 'Gedächtnisschilde müssen'} gestärkt werden`, dueHint: 'Beginne mit den Wörtern, die es am nötigsten haben', reviewSix: '6 wiederholen →', startReview: 'Wiederholung starten →', stable: 'Gedächtnisschilde stabil', stableUntilTomorrow: 'Schilde stabil · Komm morgen wieder', nextReview: c => `Nächste Wiederholung ${c}`, myWords: 'Meine Wörter', all: 'Alle', reinforce: 'Stärken', empty: 'Hier sind noch keine Wörter', shieldReady: 'Gedächtnisschild bereit zum Stärken', growingWithCountdown: c => `Nächste Wiederholung ${c}` },
  game: { newDiscovery: 'Neue Entdeckung', complete: 'Abgeschlossen', swapTutorial: 'Verbinde 3 gleiche Emoji\nJeder Tausch kostet 1 Zug', reviewTutorial: 'Folge dem Hinweis und verbinde 3 passende Emoji', freeMoveHint: 'Verbinde 4 gleiche Emoji\nDieser Zug wird erstattet', crossMoveHint: 'Bilde ein T oder Kreuz\nErhalte +1 Zug' },
  mode: {
    moodDescription: 'Jeden Tag ein Farbthema · bis zu 3 Spielfelder',
    moodDailyLimitReached: 'Tageslimit der Farbtafel erreicht — komm morgen wieder',
    sayBlastNeedsWords: 'Schließe das erste Abenteuer-Set ab und lerne 6 Wörter',
  },
  resultGoals: { reviewChoice: 'Weiter wiederholen oder zu neuen Wörtern zurückkehren', categoryUnlock: n => `Noch ${n} ${n === 1 ? 'Set' : 'Sets'} → 🧩 Kategoriemodus`, strengthen: 'Stärke diese Wörter in der Gedächtnis-Challenge', discoverSix: 'Entdecke die Namen der nächsten 6 Emojis', forcedReview: 'Drei Sets geschafft – probiere die Gedächtnis-Challenge', anotherTheme: 'Probiere ein anderes Thema oder sechs weitere Wörter' },
  rescue: { wrong: n => `Falsches Match! Noch ${n} ${n === 1 ? 'Versuch' : 'Versuche'}`, failed: 'Oh nein 😅 Challenge fehlgeschlagen', offerTitle: 'Fast geschafft! Du kannst es noch retten 💗', offerBody: n => `${n > 0 ? `Noch ${n} ${n === 1 ? 'Wort' : 'Wörter'}. ` : ''}Verbinde das angezeigte Emoji rechtzeitig, um zurückzukehren.`, save: 'Retten!', retryTitle: 'Rettung fehlgeschlagen 😵‍💫', retryBody: 'Versuche das Set erneut mit 8 Bonuszügen!', continueMoves: 'Weiter · +8 Züge' },
};

const ja: AppUiCopy = {
  progressSaved: '進捗を保存しました',
  home: { continueAdventure: '冒険を続ける', startAdventure: '冒険を始める', welcomeBack: 'おかえりなさい', readyToStart: '準備完了', todaysProgress: '今日の進捗', reviewReady: n => `${n}語が復習できます`, sayBlastStaminaEntry: 'Say & Blast · 星3で体力 +1' },
  accountPrompt: { streakTitle: '7日連続記録を守ろう', collectionTitle: 'コレクションを守ろう', streakBody: 'ログインすると、7日連続記録を続けて安全にバックアップできます。', collectionBody: n => `${n}個の絵文字を発見しました。アカウントを作成すると、コレクションと進捗を端末間で保存できます。`, create: 'アカウントを作成', signIn: 'アカウントをお持ちですか？ログイン', continueWithoutStreak: '長期連続記録なしで続ける', notNow: '今はしない' },
  roundResult: { aria: 'セット結果', reviewUnlocked: '記憶チャレンジをアンロックしました', categoryUnlocked: 'カテゴリーモードをアンロックしました', collectionAdded: n => `コレクション +${n}`, dayStreak: n => `${n}日連続`, strengthened: '記憶が強化されました！', discovered: n => `${n}個の新しい絵文字を発見！`, perfect: '✨ 完璧な記憶チェック！', setComplete: '🎉 セット完了！', congratulations: 'おめでとう！', awardReady: '実績とバッジをアンロック', claimed: '✓ 受取済み', claim: '実績とバッジを受け取る', nextGoal: '次の目標：', startReview: '記憶チャレンジを始める', nextSet: '次のセット', viewCollection: 'コレクションに追加された絵文字を見る' },
  deadMachine: { continueSet: '次のセットへ進む', chargedHint: 'マシンの充電が完了しました', earnStamina: '声でブラストして体力を獲得', earnStaminaHint: '星3つで体力 +1', reinforce: '記憶を強化する', reinforceHint: '冒険は一時停止中ですが、記憶チャレンジは遊べます', playMood: 'カラーボードで遊ぶ', playMoodHint: '体力を消費しない気軽なモード', playReview: '記憶チャレンジで遊ぶ', chargingComplete: '充電完了', machineReady: '次のセットを始められます。', nextStamina: '次の体力', later: 'あとで遊ぶ' },
  learned: { ready: '強化できます', fortified: '定着済み', growing: '定着中', learnedCount: n => `${n}語を学習済み`, shieldsDue: n => `${n}語の記憶を強化できます`, dueHint: '最も復習が必要な単語から始めましょう', reviewSix: '6語を復習 →', startReview: '復習を始める →', stable: '記憶は安定しています', stableUntilTomorrow: '記憶は安定中 · また明日', nextReview: c => `次の復習：${c}`, myWords: '学習した単語', all: 'すべて', reinforce: '要復習', empty: 'ここにはまだ単語がありません', shieldReady: '記憶を強化できます', growingWithCountdown: c => `次の復習：${c}` },
  game: { newDiscovery: '初めての発見', complete: '完了', swapTutorial: '同じEmojiを3つそろえる\n1回の交換で1手消費', reviewTutorial: 'ヒントに合うEmojiを3つそろえる', freeMoveHint: '同じEmojiを4つそろえる\nこの1手は返却', crossMoveHint: 'T字または十字にそろえる\n手数 +1' },
  mode: {
    moodDescription: '毎日1つのカラーテーマ · 最大3ボード',
    moodDailyLimitReached: '今日のカラーボード上限に達しました。また明日',
    sayBlastNeedsWords: '最初の冒険セットを完了して6語学ぼう',
  },
  resultGoals: { reviewChoice: '復習を続けるか、新しい単語の冒険に戻りましょう', categoryUnlock: n => `あと${n}セット → 🧩 カテゴリーモード`, strengthen: '記憶チャレンジで今覚えた単語を強化しましょう', discoverSix: '次の6個の絵文字名を発見しましょう', forcedReview: '3セット完了 — 記憶チャレンジに挑戦しましょう', anotherTheme: '別のテーマまたは新しい6語に挑戦しましょう' },
  rescue: { wrong: n => `間違いです！残り${n}回`, failed: '残念 😅 チャレンジ失敗', offerTitle: 'あと少し！復活のチャンスです 💗', offerBody: n => `${n > 0 ? `残り${n}語です。` : ''}時間内に指定された絵文字をそろえると復活できます。`, save: '復活する！', retryTitle: '復活失敗 😵‍💫', retryBody: 'ボーナス8手でもう一度挑戦！', continueMoves: '続ける · +8手' },
};

const ko: AppUiCopy = {
  progressSaved: '진행 상황이 저장되었습니다',
  home: { continueAdventure: '모험 계속하기', startAdventure: '모험 시작하기', welcomeBack: '다시 오신 것을 환영해요', readyToStart: '시작할 준비가 되었어요', todaysProgress: '오늘의 진행 상황', reviewReady: n => `${n}개 단어를 복습할 수 있어요`, sayBlastStaminaEntry: 'Say & Blast · 별 3개 체력 +1' },
  accountPrompt: { streakTitle: '7일 연속 기록을 지키세요', collectionTitle: '컬렉션을 안전하게 보관하세요', streakBody: '로그인하면 7일 연속 기록을 이어 가고 안전하게 백업할 수 있어요.', collectionBody: n => `${n}개의 이모지를 발견했어요. 계정을 만들면 컬렉션과 진행 상황을 여러 기기에 저장할 수 있어요.`, create: '계정 만들기', signIn: '계정이 있나요? 로그인', continueWithoutStreak: '장기 연속 기록 없이 계속하기', notNow: '나중에' },
  roundResult: { aria: '세트 결과', reviewUnlocked: '기억력 도전 잠금 해제', categoryUnlocked: '카테고리 모드 잠금 해제', collectionAdded: n => `컬렉션 +${n}`, dayStreak: n => `${n}일 연속`, strengthened: '기억이 강화되었어요!', discovered: n => `새로운 이모지 ${n}개를 발견했어요!`, perfect: '✨ 완벽한 기억력 확인!', setComplete: '🎉 세트 완료!', congratulations: '축하해요!', awardReady: '업적과 배지를 잠금 해제했어요', claimed: '✓ 받음', claim: '업적과 배지 받기', nextGoal: '다음 목표: ', startReview: '기억력 도전 시작', nextSet: '다음 세트', viewCollection: '컬렉션에 새로 추가된 이모지 보기' },
  deadMachine: { continueSet: '다음 세트 계속하기', chargedHint: '기계 충전이 완료되었어요', earnStamina: '말하고 쏘기에서 체력 얻기', earnStaminaHint: '별 3개를 얻으면 체력 +1', reinforce: '기억 강화하기', reinforceHint: '모험은 일시 정지되었지만 기억력 도전은 할 수 있어요', playMood: '컬러 보드 플레이', playMoodHint: '체력을 쓰지 않는 가벼운 모드', playReview: '기억력 도전 플레이', chargingComplete: '충전 완료', machineReady: '다음 세트를 시작할 준비가 되었어요.', nextStamina: '다음 체력', later: '나중에 플레이' },
  learned: { ready: '강화 가능', fortified: '강화됨', growing: '자리 잡는 중', learnedCount: n => `${n}개 단어 학습 완료`, shieldsDue: n => `${n}개 단어의 기억을 강화할 수 있어요`, dueHint: '복습이 가장 필요한 단어부터 시작하세요', reviewSix: '6개 복습 →', startReview: '복습 시작 →', stable: '기억이 안정적이에요', stableUntilTomorrow: '기억 안정 · 내일 다시 오세요', nextReview: c => `다음 복습 ${c}`, myWords: '내 단어', all: '전체', reinforce: '복습 필요', empty: '아직 단어가 없어요', shieldReady: '기억을 강화할 수 있어요', growingWithCountdown: c => `다음 복습 ${c}` },
  game: { newDiscovery: '새로운 발견', complete: '완료', swapTutorial: '같은 Emoji 3개를 맞추세요\n교환하면 1회를 사용해요', reviewTutorial: '힌트에 맞는 Emoji 3개를 맞추세요', freeMoveHint: '같은 Emoji 4개를 맞추세요\n이동 1회를 돌려받아요', crossMoveHint: 'T자 또는 십자로 맞추세요\n이동 +1회' },
  mode: {
    moodDescription: '매일 하나의 색상 테마 · 최대 3보드',
    moodDailyLimitReached: '오늘의 컬러 보드 한도에 도달했어요. 내일 다시 오세요',
    sayBlastNeedsWords: '첫 모험 세트를 완료하고 단어 6개를 배워 보세요',
  },
  resultGoals: { reviewChoice: '복습을 계속하거나 새로운 단어 모험으로 돌아가세요', categoryUnlock: n => `${n}세트 더 완료 → 🧩 카테고리 모드`, strengthen: '기억력 도전에서 방금 배운 단어를 강화하세요', discoverSix: '다음 이모지 이름 6개를 발견하세요', forcedReview: '3세트 완료 — 기억력 도전에 도전하세요', anotherTheme: '다른 테마나 새로운 단어 6개에 도전하세요' },
  rescue: { wrong: n => `틀렸어요! 기회가 ${n}번 남았어요`, failed: '이런 😅 도전 실패', offerTitle: '아깝네요! 되살릴 기회가 있어요 💗', offerBody: n => `${n > 0 ? `${n}개 단어가 남았어요. ` : ''}시간이 끝나기 전에 제시된 이모지를 맞추면 부활할 수 있어요.`, save: '되살리기!', retryTitle: '부활 실패 😵‍💫', retryBody: '보너스 이동 8회로 세트에 다시 도전하세요!', continueMoves: '계속하기 · +8회' },
};

export const APP_UI_COPY: Record<Locale, AppUiCopy> = {
  en,
  es,
  fr,
  de,
  ja,
  ko,
  'zh-CN': zhCN,
};
