import type { Locale } from './types';

export type RewardedAdCopy = {
  watch: string;
  watchReward: string;
  practiceForEnergy: string;
  practiceReward: string;
  reviewWhileWaiting: string;
  remaining: (n: number) => string;
  loading: string;
  unavailable: string;
  dailyLimit: string;
  rewarded: string;
  unlockPlus: (displayPrice: string | null) => string;
  privacyChoices: string;
  privacyUpdated: string;
  privacyUnavailable: string;
};

export const REWARDED_AD_COPY: Record<Locale, RewardedAdCopy> = {
  en: { watch: 'Watch an ad', watchReward: 'Refill to 3 ⚡', practiceForEnergy: 'Practice speaking', practiceReward: 'Say & Blast · Restore 1 ⚡', reviewWhileWaiting: 'Review while waiting', remaining: n => `${n} ad ${n === 1 ? 'refill' : 'refills'} left today`, loading: 'Preparing ad…', unavailable: 'No ad is available right now. Please try again shortly.', dailyLimit: 'Today’s 2 ad refills have been used.', rewarded: 'Stamina refilled to 3!', unlockPlus: price => price ? `Go Unlimited · ${price} once` : 'Go Unlimited · one-time purchase', privacyChoices: 'Ad privacy choices', privacyUpdated: 'Ad privacy choices updated.', privacyUnavailable: 'Privacy choices are unavailable right now.' },
  'zh-CN': { watch: '看一段广告', watchReward: '体力恢复至 3 ⚡', practiceForEnergy: '练习口语', practiceReward: 'Say & Blast · 恢复 1 ⚡', reviewWhileWaiting: '等待时复习', remaining: n => `今天还可恢复 ${n} 次`, loading: '正在准备广告…', unavailable: '暂时没有可用广告，请稍后再试。', dailyLimit: '今天 2 次广告恢复机会已用完。', rewarded: '体力已恢复到 3 点！', unlockPlus: price => price ? `无限畅玩 · ${price} 买断` : '无限畅玩 · 一次买断', privacyChoices: '广告隐私选项', privacyUpdated: '广告隐私选项已更新。', privacyUnavailable: '暂时无法打开广告隐私选项。' },
  es: { watch: 'Ver un anuncio', watchReward: 'Recarga a 3 ⚡', practiceForEnergy: 'Practica la pronunciación', practiceReward: 'Say & Blast · Recupera 1 ⚡', reviewWhileWaiting: 'Repasa mientras esperas', remaining: n => `${n} recarga${n === 1 ? '' : 's'} con anuncio hoy`, loading: 'Preparando anuncio…', unavailable: 'No hay anuncios disponibles. Inténtalo de nuevo en breve.', dailyLimit: 'Ya usaste las 2 recargas de hoy.', rewarded: '¡Energía recargada a 3!', unlockPlus: price => price ? `Juego ilimitado · ${price} una vez` : 'Juego ilimitado · pago único', privacyChoices: 'Privacidad de anuncios', privacyUpdated: 'Preferencias de anuncios actualizadas.', privacyUnavailable: 'Las opciones de privacidad no están disponibles.' },
  fr: { watch: 'Regarder une pub', watchReward: 'Recharge à 3 ⚡', practiceForEnergy: 'Entraîne ta prononciation', practiceReward: 'Say & Blast · Récupère 1 ⚡', reviewWhileWaiting: 'Réviser en attendant', remaining: n => `${n} recharge${n === 1 ? '' : 's'} avec pub aujourd’hui`, loading: 'Préparation de la publicité…', unavailable: 'Aucune publicité disponible. Réessayez dans un instant.', dailyLimit: 'Les 2 recharges publicitaires du jour sont utilisées.', rewarded: 'Énergie rechargée à 3 !', unlockPlus: price => price ? `Jeu illimité · ${price} une fois` : 'Jeu illimité · achat unique', privacyChoices: 'Confidentialité des annonces', privacyUpdated: 'Choix publicitaires mis à jour.', privacyUnavailable: 'Les options de confidentialité sont indisponibles.' },
  de: { watch: 'Werbung ansehen', watchReward: 'Auf 3 auffüllen ⚡', practiceForEnergy: 'Aussprache üben', practiceReward: 'Say & Blast · 1 Energie zurück ⚡', reviewWhileWaiting: 'Beim Warten wiederholen', remaining: n => `Heute noch ${n} Werbe-Aufladung${n === 1 ? '' : 'en'}`, loading: 'Werbung wird vorbereitet…', unavailable: 'Gerade ist keine Werbung verfügbar. Versuche es gleich noch einmal.', dailyLimit: 'Die 2 Werbe-Aufladungen für heute sind verbraucht.', rewarded: 'Energie auf 3 aufgefüllt!', unlockPlus: price => price ? `Unbegrenzt spielen · einmalig ${price}` : 'Unbegrenzt spielen · Einmalkauf', privacyChoices: 'Datenschutz für Anzeigen', privacyUpdated: 'Anzeigenauswahl aktualisiert.', privacyUnavailable: 'Datenschutzoptionen sind derzeit nicht verfügbar.' },
  ja: { watch: '広告を見る', watchReward: '体力を3に回復 ⚡', practiceForEnergy: '発音を練習', practiceReward: 'Say & Blast · 体力1回復 ⚡', reviewWhileWaiting: '待ち時間に復習', remaining: n => `本日の広告回復 あと${n}回`, loading: '広告を準備しています…', unavailable: '現在利用できる広告がありません。少し待ってからお試しください。', dailyLimit: '本日の広告回復2回を使い切りました。', rewarded: '体力が3に回復しました！', unlockPlus: price => price ? `無制限プレイ · ${price}（買い切り）` : '無制限プレイ · 買い切り', privacyChoices: '広告のプライバシー設定', privacyUpdated: '広告の設定を更新しました。', privacyUnavailable: '現在プライバシー設定を開けません。' },
  ko: { watch: '광고 보기', watchReward: '체력 3으로 회복 ⚡', practiceForEnergy: '발음 연습', practiceReward: 'Say & Blast · 체력 1 회복 ⚡', reviewWhileWaiting: '기다리며 복습하기', remaining: n => `오늘 광고 회복 ${n}회 남음`, loading: '광고 준비 중…', unavailable: '지금은 광고를 불러올 수 없어요. 잠시 후 다시 시도해 주세요.', dailyLimit: '오늘 광고 회복 2회를 모두 사용했어요.', rewarded: '체력이 3으로 회복됐어요!', unlockPlus: price => price ? `무제한 플레이 · ${price} 한 번만 결제` : '무제한 플레이 · 1회 결제', privacyChoices: '광고 개인정보 선택', privacyUpdated: '광고 개인정보 선택이 업데이트됐어요.', privacyUnavailable: '지금은 개인정보 옵션을 열 수 없어요.' },
};
