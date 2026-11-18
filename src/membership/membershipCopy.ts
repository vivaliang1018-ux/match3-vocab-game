import type { Locale } from '../i18n';

type MembershipCopy = {
  plus: string;
  trialTitle: string;
  trialBody: string;
  noCharge: string;
  startLearning: string;
  paywallTitle: string;
  expiredTitle: string;
  paywallBody: string;
  benefits: [string, string, string];
  lifetime: string;
  oneTimePurchase: string;
  continueFree: string;
  restore: string;
  accountRequired: string;
  createAccount: string;
  purchasePending: string;
  pendingApproval: string;
  purchaseError: string;
  restoreEmpty: string;
  terms: string;
  privacy: string;
  categoryLocked: string;
  statusTrial: string;
  statusPremium: string;
  statusFree: string;
  remaining: (days: number, hours: number) => string;
  viewPlans: string;
  profileSummary: string;
  profileActiveSummary: string;
};

const en: MembershipCopy = {
  plus: 'LingoMatch Plus', trialTitle: 'Your 7-day Plus experience is ready', trialBody: 'Use Category learning and your complete Learned library for 7 days.', noCharge: 'No payment method needed · You will not be charged automatically', startLearning: 'Start learning', paywallTitle: 'Unlock LingoMatch Plus', expiredTitle: 'Your Plus experience has ended', paywallBody: 'Permanently unlock the Classic Emoji collection and its included game modes, or continue free.', benefits: ['Unlimited Classic Emoji boards', 'Three Mood Boards each day', 'No daily energy limit across current courses'], lifetime: 'Unlock permanently', oneTimePurchase: 'One-time purchase · Classic Emoji collection · No subscription', continueFree: 'Continue free', restore: 'Restore purchase', accountRequired: 'Sign in to sync learning progress across devices.', createAccount: 'Create account to continue', purchasePending: 'This App Store product is unavailable right now.', pendingApproval: 'Purchase pending approval. Access will update automatically.', purchaseError: 'Purchase could not be completed. Please try again.', restoreEmpty: 'No Plus purchase was found for this Apple Account.', terms: 'Terms of Use', privacy: 'Privacy Policy', categoryLocked: 'Learn by emoji theme', statusTrial: 'Plus experience', statusPremium: 'Plus member', statusFree: 'Free plan', remaining: (days, hours) => days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`, viewPlans: 'View Plus', profileSummary: 'Remove daily energy limits and play three Mood Boards each day', profileActiveSummary: 'Active · All Plus benefits are available',
};

const zhCN: MembershipCopy = {
  plus: 'LingoMatch Plus', trialTitle: '7 天 Plus 体验已开启', trialBody: '7 天内可以使用分类学习和完整已学词库。', noCharge: '无需绑定付款方式 · 不会自动扣费', startLearning: '开始学习', paywallTitle: '解锁 LingoMatch Plus', expiredTitle: 'Plus 免费体验已结束', paywallBody: '永久解锁经典 Emoji 内容和已包含的游戏模式；也可以继续使用免费版。', benefits: ['经典 Emoji 棋盘不限次数', '每天 3 局 Mood Board', '当前全部课程不受每日体力限制'], lifetime: '永久解锁 Plus', oneTimePurchase: '一次购买 · 经典 Emoji 内容 · 不自动续费', continueFree: '继续使用免费版', restore: '恢复购买', accountRequired: '登录后可以跨设备同步学习进度。', createAccount: '创建账户并继续', purchasePending: '暂时无法读取 App Store 商品。', pendingApproval: '购买正在等待批准，生效后会自动更新。', purchaseError: '购买未能完成，请稍后重试。', restoreEmpty: '这个 Apple 账户没有可恢复的 Plus 买断记录。', terms: '使用条款', privacy: '隐私政策', categoryLocked: '按 Emoji 主题分类学习', statusTrial: 'Plus 免费体验', statusPremium: 'Plus 会员', statusFree: '免费版', remaining: (days, hours) => days > 0 ? `还剩 ${days} 天 ${hours} 小时` : `还剩 ${hours} 小时`, viewPlans: '查看 Plus', profileSummary: '取消每日体力限制，并每天玩 3 局心情棋盘', profileActiveSummary: '已开通 · 全部 Plus 权益可用',
};

const es: MembershipCopy = {
  ...en, trialTitle: 'Tu experiencia Plus de 7 días está lista', trialBody: 'Usa el aprendizaje por categorías y toda tu biblioteca durante 7 días.', noCharge: 'Sin método de pago · No se cobrará automáticamente', startLearning: 'Empezar a aprender', paywallTitle: 'Desbloquea LingoMatch Plus', expiredTitle: 'Tu experiencia Plus ha terminado', continueFree: 'Continuar gratis', restore: 'Restaurar compra', createAccount: 'Crear cuenta y continuar', categoryLocked: 'Aprende por tema de emoji', statusTrial: 'Experiencia Plus', statusPremium: 'Miembro Plus', statusFree: 'Plan gratis', viewPlans: 'Ver Plus', profileSummary: 'Elimina el límite diario de energía y juega 3 Mood Boards al día', profileActiveSummary: 'Activo · Todos los beneficios Plus disponibles', lifetime: 'Desbloquear para siempre', oneTimePurchase: 'Pago único · Colección Emoji clásica · Sin suscripción',
  paywallBody: 'Desbloquea para siempre la colección Emoji clásica y sus modos de juego, o continúa gratis.',
  benefits: ['Tableros de Emoji clásicos sin límite', '3 Mood Boards al día', 'Sin límite diario de energía en los cursos actuales'],
  accountRequired: 'Inicia sesión para sincronizar tu progreso entre dispositivos.',
  purchasePending: 'Los productos de App Store no están disponibles ahora.',
  pendingApproval: 'La compra está pendiente de aprobación. El acceso se actualizará automáticamente.',
  purchaseError: 'No se pudo completar la compra. Inténtalo de nuevo.',
  restoreEmpty: 'No se encontró una compra de Plus en esta cuenta de Apple.',
  terms: 'Términos de uso', privacy: 'Política de privacidad',
  remaining: (days, hours) => days > 0 ? `${days} d ${hours} h restantes` : `${hours} h restantes`,
};
const fr: MembershipCopy = {
  ...en, trialTitle: 'Ton expérience Plus de 7 jours est prête', trialBody: 'Utilise les catégories et toute ta bibliothèque Appris pendant 7 jours.', noCharge: 'Aucun moyen de paiement · Aucun débit automatique', startLearning: 'Commencer', paywallTitle: 'Débloquer LingoMatch Plus', expiredTitle: 'Ton expérience Plus est terminée', continueFree: 'Continuer gratuitement', restore: 'Restaurer l’achat', createAccount: 'Créer un compte', categoryLocked: 'Apprendre par thème emoji', statusTrial: 'Expérience Plus', statusPremium: 'Membre Plus', statusFree: 'Version gratuite', viewPlans: 'Voir Plus', profileSummary: 'Supprime la limite d’énergie quotidienne et joue 3 Mood Boards par jour', profileActiveSummary: 'Actif · Tous les avantages Plus sont disponibles', lifetime: 'Débloquer à vie', oneTimePurchase: 'Achat unique · Collection Emoji classique · Sans abonnement',
  paywallBody: 'Débloque à vie la collection Emoji classique et ses modes de jeu, ou continue gratuitement.',
  benefits: ['Plateaux Emoji classiques illimités', '3 Mood Boards par jour', 'Aucune limite d’énergie quotidienne dans les cours actuels'],
  accountRequired: 'Connecte-toi pour synchroniser ta progression entre appareils.',
  purchasePending: 'Les produits de l’App Store sont momentanément indisponibles.',
  pendingApproval: 'L’achat attend une approbation. L’accès sera mis à jour automatiquement.',
  purchaseError: 'Impossible de finaliser l’achat. Réessaie.',
  restoreEmpty: 'Aucun achat Plus trouvé pour ce compte Apple.',
  terms: 'Conditions d’utilisation', privacy: 'Politique de confidentialité',
  remaining: (days, hours) => days > 0 ? `${days} j ${hours} h restants` : `${hours} h restantes`,
};
const de: MembershipCopy = {
  ...en, trialTitle: 'Dein 7-tägiges Plus-Erlebnis ist bereit', trialBody: 'Nutze Kategorien und deine vollständige Wortliste 7 Tage lang.', noCharge: 'Keine Zahlungsmethode · Keine automatische Abbuchung', startLearning: 'Lernen starten', paywallTitle: 'LingoMatch Plus freischalten', expiredTitle: 'Dein Plus-Erlebnis ist beendet', continueFree: 'Kostenlos weitermachen', restore: 'Kauf wiederherstellen', createAccount: 'Konto erstellen', categoryLocked: 'Nach Emoji-Thema lernen', statusTrial: 'Plus-Erlebnis', statusPremium: 'Plus-Mitglied', statusFree: 'Kostenlos', viewPlans: 'Plus ansehen', profileSummary: 'Tägliches Energielimit entfernen und 3 Mood Boards pro Tag spielen', profileActiveSummary: 'Aktiv · Alle Plus-Vorteile sind verfügbar', lifetime: 'Dauerhaft freischalten', oneTimePurchase: 'Einmalkauf · Klassische Emoji-Sammlung · Kein Abo',
  paywallBody: 'Schalte die klassische Emoji-Sammlung und ihre Spielmodi dauerhaft frei oder spiele kostenlos weiter.',
  benefits: ['Unbegrenzte klassische Emoji-Spielfelder', '3 Mood Boards pro Tag', 'Kein tägliches Energielimit in aktuellen Kursen'],
  accountRequired: 'Melde dich an, um deinen Lernfortschritt zwischen Geräten zu synchronisieren.',
  purchasePending: 'App-Store-Produkte sind derzeit nicht verfügbar.',
  pendingApproval: 'Der Kauf wartet auf Genehmigung. Der Zugang wird automatisch aktualisiert.',
  purchaseError: 'Der Kauf konnte nicht abgeschlossen werden. Bitte versuche es erneut.',
  restoreEmpty: 'Für diesen Apple Account wurde kein Plus-Kauf gefunden.',
  terms: 'Nutzungsbedingungen', privacy: 'Datenschutz',
  remaining: (days, hours) => days > 0 ? `Noch ${days} T. ${hours} Std.` : `Noch ${hours} Std.`,
};
const ja: MembershipCopy = {
  ...en, trialTitle: '7日間のPlus体験が始まりました', trialBody: 'カテゴリ学習と学習済み単語の全リストを7日間利用できます。', noCharge: '支払い方法は不要 · 自動課金されません', startLearning: '学習を始める', paywallTitle: 'LingoMatch Plusを利用する', expiredTitle: 'Plus体験が終了しました', continueFree: '無料版を続ける', restore: '購入を復元', createAccount: 'アカウントを作成', categoryLocked: '絵文字テーマ別に学習', statusTrial: 'Plus体験', statusPremium: 'Plus会員', statusFree: '無料版', viewPlans: 'Plusを見る', profileSummary: '毎日の体力制限なし・Mood Boardを毎日3回プレイ', profileActiveSummary: '利用中 · すべてのPlus特典が使えます', lifetime: '永久にアンロック', oneTimePurchase: '買い切り · 定番の絵文字コレクション · サブスクリプションなし',
  paywallBody: '定番の絵文字コレクションと対応ゲームモードを永久にアンロックするか、無料版を続けてください。',
  benefits: ['定番の絵文字ボードを回数制限なしでプレイ', 'Mood Boardは毎日3回', '現在の全コースで毎日の体力制限なし'],
  accountRequired: 'ログインすると学習記録を端末間で同期できます。',
  purchasePending: '現在App Storeの商品を読み込めません。',
  pendingApproval: '購入は承認待ちです。承認後に利用状況が自動更新されます。',
  purchaseError: '購入を完了できませんでした。もう一度お試しください。',
  restoreEmpty: 'このApple Accountに復元できるPlus購入はありません。',
  terms: '利用規約', privacy: 'プライバシーポリシー',
  remaining: (days, hours) => days > 0 ? `残り${days}日${hours}時間` : `残り${hours}時間`,
};
const ko: MembershipCopy = {
  ...en, trialTitle: '7일 Plus 체험이 시작됐어요', trialBody: '카테고리 학습과 전체 학습 단어를 7일 동안 이용하세요.', noCharge: '결제 수단 불필요 · 자동 결제되지 않아요', startLearning: '학습 시작', paywallTitle: 'LingoMatch Plus 잠금 해제', expiredTitle: 'Plus 체험이 종료됐어요', continueFree: '무료로 계속하기', restore: '구매 복원', createAccount: '계정 만들기', categoryLocked: '이모지 테마별 학습', statusTrial: 'Plus 체험', statusPremium: 'Plus 회원', statusFree: '무료 플랜', viewPlans: 'Plus 보기', profileSummary: '일일 체력 제한 없이 Mood Board를 하루 3회 플레이', profileActiveSummary: '이용 중 · 모든 Plus 혜택을 사용할 수 있어요', lifetime: '영구 잠금 해제', oneTimePurchase: '1회 구매 · 클래식 이모지 콜렉션 · 구독 없음',
  paywallBody: '클래식 이모지 콜렉션과 포함된 게임 모드를 영구 잠금 해제하거나 무료로 계속하세요.',
  benefits: ['클래식 이모지 보드 무제한', 'Mood Board 하루 3회', '현재 모든 코스에서 일일 체력 제한 없음'],
  accountRequired: '로그인하면 여러 기기에서 학습 기록을 동기화할 수 있어요.',
  purchasePending: '현재 App Store 상품을 불러올 수 없습니다.',
  pendingApproval: '구매 승인을 기다리는 중입니다. 승인되면 이용 권한이 자동으로 업데이트됩니다.',
  purchaseError: '구매를 완료하지 못했습니다. 다시 시도해 주세요.',
  restoreEmpty: '이 Apple 계정에서 복원할 Plus 구매를 찾지 못했습니다.',
  terms: '이용 약관', privacy: '개인정보 처리방침',
  remaining: (days, hours) => days > 0 ? `${days}일 ${hours}시간 남음` : `${hours}시간 남음`,
};

export const MEMBERSHIP_COPY: Record<Locale, MembershipCopy> = {
  en,
  es,
  fr,
  de,
  ja,
  ko,
  'zh-CN': zhCN,
};

export function membershipRemainingParts(remainingMs: number) {
  const totalHours = Math.max(0, Math.ceil(remainingMs / (60 * 60 * 1000)));
  return { days: Math.floor(totalHours / 24), hours: totalHours % 24 };
}
