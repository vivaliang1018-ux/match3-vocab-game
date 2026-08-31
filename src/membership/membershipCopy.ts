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
  annual: string;
  perYear: string;
  monthly: string;
  perMonth: string;
  recommended: string;
  continueFree: string;
  restore: string;
  accountRequired: string;
  createAccount: string;
  purchasePending: string;
  categoryLocked: string;
  statusTrial: string;
  statusPremium: string;
  statusFree: string;
  remaining: (days: number, hours: number) => string;
  viewPlans: string;
};

const en: MembershipCopy = {
  plus: 'LingoMatch Plus', trialTitle: 'Your 7-day Plus experience is ready', trialBody: 'Use Category learning and your complete Learned library for 7 days.', noCharge: 'No payment method needed · You will not be charged automatically', startLearning: 'Start learning', paywallTitle: 'Unlock LingoMatch Plus', expiredTitle: 'Your Plus experience has ended', paywallBody: 'Your learning progress is safe. Choose a plan to keep using Plus features, or continue free.', benefits: ['Learn by category', 'Open your complete Learned library', 'Filter words by memory status'], annual: 'Annual', perYear: '/ year', monthly: 'Monthly', perMonth: '/ month', recommended: 'BEST VALUE', continueFree: 'Continue free', restore: 'Restore purchases', accountRequired: 'Create an account or sign in before purchasing. Your trial progress will be kept.', createAccount: 'Create account to continue', purchasePending: 'App Store checkout will be connected in the purchase integration step.', categoryLocked: 'Plus · Learn by emoji theme', statusTrial: 'Plus experience', statusPremium: 'Plus member', statusFree: 'Free plan', remaining: (days, hours) => days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`, viewPlans: 'View Plus',
};

const zhCN: MembershipCopy = {
  plus: 'LingoMatch Plus', trialTitle: '7 天 Plus 体验已开启', trialBody: '7 天内可以使用分类学习和完整已学词库。', noCharge: '无需绑定付款方式 · 不会自动扣费', startLearning: '开始学习', paywallTitle: '解锁 LingoMatch Plus', expiredTitle: 'Plus 免费体验已结束', paywallBody: '你的学习记录已经保留。选择会员方案继续使用 Plus，或者继续使用免费版。', benefits: ['按分类自由学习', '查看完整已学词库', '按记忆状态筛选单词'], annual: '年度会员', perYear: '/ 年', monthly: '月度会员', perMonth: '/ 月', recommended: '推荐', continueFree: '继续使用免费版', restore: '恢复购买', accountRequired: '购买会员前需要创建账户或登录，体验期间的进度会保留。', createAccount: '创建账户并继续', purchasePending: '真实 App Store 付款将在内购接入阶段连接。', categoryLocked: 'Plus · 按 Emoji 主题分类学习', statusTrial: 'Plus 免费体验', statusPremium: 'Plus 会员', statusFree: '免费版', remaining: (days, hours) => days > 0 ? `还剩 ${days} 天 ${hours} 小时` : `还剩 ${hours} 小时`, viewPlans: '查看 Plus',
};

const es: MembershipCopy = {
  ...en, trialTitle: 'Tu experiencia Plus de 7 días está lista', trialBody: 'Usa el aprendizaje por categorías y toda tu biblioteca durante 7 días.', noCharge: 'Sin método de pago · No se cobrará automáticamente', startLearning: 'Empezar a aprender', paywallTitle: 'Desbloquea LingoMatch Plus', expiredTitle: 'Tu experiencia Plus ha terminado', continueFree: 'Continuar gratis', restore: 'Restaurar compras', accountRequired: 'Crea una cuenta o inicia sesión antes de comprar.', createAccount: 'Crear cuenta y continuar', categoryLocked: 'Plus · Aprende por tema de emoji', statusTrial: 'Experiencia Plus', statusPremium: 'Miembro Plus', statusFree: 'Plan gratis', perYear: '/ año', perMonth: '/ mes', viewPlans: 'Ver Plus',
};
const fr: MembershipCopy = {
  ...en, trialTitle: 'Ton expérience Plus de 7 jours est prête', trialBody: 'Utilise les catégories et toute ta bibliothèque Appris pendant 7 jours.', noCharge: 'Aucun moyen de paiement · Aucun débit automatique', startLearning: 'Commencer', paywallTitle: 'Débloquer LingoMatch Plus', expiredTitle: 'Ton expérience Plus est terminée', continueFree: 'Continuer gratuitement', restore: 'Restaurer les achats', accountRequired: 'Crée un compte ou connecte-toi avant l’achat.', createAccount: 'Créer un compte', categoryLocked: 'Plus · Apprendre par thème emoji', statusTrial: 'Expérience Plus', statusPremium: 'Membre Plus', statusFree: 'Version gratuite', perYear: '/ an', perMonth: '/ mois', viewPlans: 'Voir Plus',
};
const de: MembershipCopy = {
  ...en, trialTitle: 'Dein 7-tägiges Plus-Erlebnis ist bereit', trialBody: 'Nutze Kategorien und deine vollständige Wortliste 7 Tage lang.', noCharge: 'Keine Zahlungsmethode · Keine automatische Abbuchung', startLearning: 'Lernen starten', paywallTitle: 'LingoMatch Plus freischalten', expiredTitle: 'Dein Plus-Erlebnis ist beendet', continueFree: 'Kostenlos weitermachen', restore: 'Käufe wiederherstellen', accountRequired: 'Erstelle vor dem Kauf ein Konto oder melde dich an.', createAccount: 'Konto erstellen', categoryLocked: 'Plus · Nach Emoji-Thema lernen', statusTrial: 'Plus-Erlebnis', statusPremium: 'Plus-Mitglied', statusFree: 'Kostenlos', perYear: '/ Jahr', perMonth: '/ Monat', viewPlans: 'Plus ansehen',
};
const ja: MembershipCopy = {
  ...en, trialTitle: '7日間のPlus体験が始まりました', trialBody: 'カテゴリ学習と学習済み単語の全リストを7日間利用できます。', noCharge: '支払い方法は不要 · 自動課金されません', startLearning: '学習を始める', paywallTitle: 'LingoMatch Plusを利用する', expiredTitle: 'Plus体験が終了しました', continueFree: '無料版を続ける', restore: '購入を復元', accountRequired: '購入前にアカウントを作成するかログインしてください。', createAccount: 'アカウントを作成', categoryLocked: 'Plus · 絵文字テーマ別に学習', statusTrial: 'Plus体験', statusPremium: 'Plus会員', statusFree: '無料版', perYear: '/ 年', perMonth: '/ 月', viewPlans: 'Plusを見る',
};
const ko: MembershipCopy = {
  ...en, trialTitle: '7일 Plus 체험이 시작됐어요', trialBody: '카테고리 학습과 전체 학습 단어를 7일 동안 이용하세요.', noCharge: '결제 수단 불필요 · 자동 결제되지 않아요', startLearning: '학습 시작', paywallTitle: 'LingoMatch Plus 잠금 해제', expiredTitle: 'Plus 체험이 종료됐어요', continueFree: '무료로 계속하기', restore: '구매 복원', accountRequired: '구매 전에 계정을 만들거나 로그인하세요.', createAccount: '계정 만들기', categoryLocked: 'Plus · 이모지 테마별 학습', statusTrial: 'Plus 체험', statusPremium: 'Plus 회원', statusFree: '무료 플랜', perYear: '/년', perMonth: '/월', viewPlans: 'Plus 보기',
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
