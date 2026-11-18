import type { Locale } from './types';

export type NotificationSettingsCopy = {
  reminders: string;
  settingsTitle: string;
  summaryOn: string;
  summaryOff: string;
  allOnHint: string;
  reminderTime: string;
  smartReview: string;
  streak: string;
  stamina: string;
  systemAllowed: string;
  systemDenied: string;
  pendingCount: (count: number) => string;
  promptTitle: string;
  promptBody: string;
  staminaPromptTitle: string;
  staminaPromptBody: string;
  remindMe: string;
  later: string;
  enabled: string;
  disabled: string;
  permissionDenied: string;
  unavailable: string;
};

export const NOTIFICATION_SETTINGS_COPY: Record<Locale, NotificationSettingsCopy> = {
  'zh-CN': {
    reminders: '学习提醒',
    settingsTitle: '通知设置', summaryOn: '已开启', summaryOff: '已关闭',
    allOnHint: '开启时默认包含智能复习、连续学习和体力恢复提醒。',
    reminderTime: '提醒时间',
    smartReview: '智能复习', streak: '连续学习', stamina: '体力恢复',
    systemAllowed: '系统通知权限：已允许', systemDenied: '系统通知权限：未允许',
    pendingCount: count => `已安排 ${count} 条提醒`, promptTitle: '要我帮你记住吗？',
    promptBody: '开启一次，就会默认收到智能复习、连续学习和体力恢复提醒；之后可在“我的”中分别调整。',
    staminaPromptTitle: '体力恢复后提醒你？', staminaPromptBody: '现在开启通知，体力恢复、该复习或连续学习需要你时，我会提醒你。',
    remindMe: '提醒我', later: '以后再说',
    enabled: '每日提醒已开启',
    disabled: '学习提醒已关闭',
    permissionDenied: '通知权限未开启，请到系统设置中允许 LingoMatch 通知。',
    unavailable: '当前设备暂不支持学习提醒。',
  },
  en: {
    reminders: 'Daily reminder',
    settingsTitle: 'Notification settings', summaryOn: 'On', summaryOff: 'Off',
    allOnHint: 'Turning reminders on includes review, streak, and energy alerts by default.',
    reminderTime: 'Reminder time',
    smartReview: 'Smart review', streak: 'Learning streak', stamina: 'Energy refill',
    systemAllowed: 'System notifications: allowed', systemDenied: 'System notifications: not allowed',
    pendingCount: count => `${count} reminders scheduled`, promptTitle: 'Want a little reminder?',
    promptBody: 'One tap turns on review, streak, and energy reminders. You can adjust each one later in Profile.',
    staminaPromptTitle: 'Remind you when energy refills?', staminaPromptBody: 'Turn on reminders for refilled energy, words ready to review, and your learning streak.',
    remindMe: 'Remind me', later: 'Maybe later',
    enabled: 'Daily reminder is on',
    disabled: 'Daily reminder is off',
    permissionDenied: 'Notifications are off. Allow LingoMatch notifications in Settings.',
    unavailable: 'Learning reminders are not available on this device.',
  },
  es: {
    reminders: 'Recordatorio diario',
    settingsTitle: 'Notificaciones', summaryOn: 'Sí', summaryOff: 'No', allOnHint: 'Incluye repaso, racha y energía.',
    reminderTime: 'Hora del recordatorio',
    smartReview: 'Repaso inteligente', streak: 'Racha', stamina: 'Energía recargada', systemAllowed: 'Notificaciones del sistema: permitidas', systemDenied: 'Notificaciones del sistema: no permitidas', pendingCount: count => `${count} recordatorios programados`, promptTitle: '¿Quieres un recordatorio?', promptBody: 'Activa a la vez el repaso, la racha y la energía.', staminaPromptTitle: '¿Avisarte cuando vuelva la energía?', staminaPromptBody: 'Te avisaremos de la energía, el repaso y tu racha.', remindMe: 'Avisarme', later: 'Más tarde',
    enabled: 'Recordatorio diario activado',
    disabled: 'Recordatorio diario desactivado',
    permissionDenied: 'Las notificaciones están desactivadas. Permite las notificaciones de LingoMatch en Ajustes.',
    unavailable: 'Los recordatorios no están disponibles en este dispositivo.',
  },
  fr: {
    reminders: 'Rappel quotidien',
    settingsTitle: 'Notifications', summaryOn: 'Activés', summaryOff: 'Désactivés', allOnHint: 'Inclut révision, série et énergie.',
    reminderTime: 'Heure du rappel',
    smartReview: 'Révision intelligente', streak: 'Série', stamina: 'Énergie rechargée', systemAllowed: 'Notifications système : autorisées', systemDenied: 'Notifications système : refusées', pendingCount: count => `${count} rappels programmés`, promptTitle: 'Un petit rappel ?', promptBody: 'Active la révision, la série et l’énergie en une fois.', staminaPromptTitle: 'Te prévenir quand l’énergie revient ?', staminaPromptBody: 'Reçois les rappels d’énergie, de révision et de série.', remindMe: 'Me prévenir', later: 'Plus tard',
    enabled: 'Rappel quotidien activé',
    disabled: 'Rappel quotidien désactivé',
    permissionDenied: 'Les notifications sont désactivées. Autorisez LingoMatch dans les Réglages.',
    unavailable: 'Les rappels ne sont pas disponibles sur cet appareil.',
  },
  de: {
    reminders: 'Tägliche Erinnerung',
    settingsTitle: 'Mitteilungen', summaryOn: 'An', summaryOff: 'Aus', allOnHint: 'Enthält Wiederholung, Serie und Energie.',
    reminderTime: 'Erinnerungszeit',
    smartReview: 'Intelligente Wiederholung', streak: 'Lernserie', stamina: 'Energie aufgefüllt', systemAllowed: 'Systemmitteilungen: erlaubt', systemDenied: 'Systemmitteilungen: nicht erlaubt', pendingCount: count => `${count} Erinnerungen geplant`, promptTitle: 'Kleine Erinnerung gewünscht?', promptBody: 'Aktiviert Wiederholung, Serie und Energie gemeinsam.', staminaPromptTitle: 'Bei voller Energie erinnern?', staminaPromptBody: 'Erhalte Energie-, Wiederholungs- und Serienerinnerungen.', remindMe: 'Erinnere mich', later: 'Später',
    enabled: 'Tägliche Erinnerung aktiviert',
    disabled: 'Tägliche Erinnerung deaktiviert',
    permissionDenied: 'Mitteilungen sind deaktiviert. Erlaube LingoMatch Mitteilungen in den Einstellungen.',
    unavailable: 'Erinnerungen sind auf diesem Gerät nicht verfügbar.',
  },
  ja: {
    reminders: '毎日のお知らせ',
    settingsTitle: '通知設定', summaryOn: 'オン', summaryOff: 'オフ', allOnHint: '復習・連続学習・体力回復をまとめてオンにします。',
    reminderTime: '通知時刻',
    smartReview: 'スマート復習', streak: '連続学習', stamina: '体力回復', systemAllowed: 'システム通知：許可済み', systemDenied: 'システム通知：未許可', pendingCount: count => `${count}件の通知を予定`, promptTitle: '学習をお知らせしますか？', promptBody: '復習・連続学習・体力回復を一度にオンにします。', staminaPromptTitle: '体力回復をお知らせしますか？', staminaPromptBody: '体力・復習・連続学習をお知らせします。', remindMe: '通知する', later: 'あとで',
    enabled: '毎日のお知らせをオンにしました',
    disabled: '毎日のお知らせをオフにしました',
    permissionDenied: '通知がオフです。設定で LingoMatch の通知を許可してください。',
    unavailable: 'このデバイスでは学習通知を利用できません。',
  },
  ko: {
    reminders: '매일 학습 알림',
    settingsTitle: '알림 설정', summaryOn: '켜짐', summaryOff: '꺼짐', allOnHint: '복습, 연속 학습, 체력 알림을 함께 켭니다.',
    reminderTime: '알림 시간',
    smartReview: '스마트 복습', streak: '연속 학습', stamina: '체력 회복', systemAllowed: '시스템 알림: 허용됨', systemDenied: '시스템 알림: 허용 안 됨', pendingCount: count => `${count}개 알림 예약됨`, promptTitle: '학습 알림을 받을까요?', promptBody: '복습, 연속 학습, 체력 알림을 한 번에 켭니다.', staminaPromptTitle: '체력이 차면 알려드릴까요?', staminaPromptBody: '체력, 복습, 연속 학습 알림을 받을 수 있어요.', remindMe: '알려 주세요', later: '나중에',
    enabled: '매일 학습 알림을 켰어요',
    disabled: '매일 학습 알림을 껐어요',
    permissionDenied: '알림이 꺼져 있어요. 설정에서 LingoMatch 알림을 허용해 주세요.',
    unavailable: '이 기기에서는 학습 알림을 사용할 수 없어요.',
  },
};
