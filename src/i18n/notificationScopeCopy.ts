import type { Locale } from './types';

type NotificationScopeCopy = {
  notifications: string;
  learning: string;
  scope: string;
  allOnHint: string;
  newContent: string;
  contentDescription: string;
  comingSoon: string;
  comingSoonShort: string;
  saved: string;
};

export const NOTIFICATION_SCOPE_COPY: Record<Locale, NotificationScopeCopy> = {
  'zh-CN': {
    comingSoonShort: '即将推出',
    notifications: '通知提醒', learning: '学习提醒',
    scope: '包括学习提醒、新课程与特别活动。',
    allOnHint: '一次开启全部类别，之后可分别关闭。',
    newContent: '新内容与活动', contentDescription: '新课程、新玩法与特别活动。',
    comingSoon: '接收偏好会保存，新内容通知即将推出。', saved: '通知偏好已保存',
  },
  en: {
    comingSoonShort: 'Coming soon',
    notifications: 'Notifications', learning: 'Learning reminders',
    scope: 'Learning reminders, new courses, and special events.',
    allOnHint: 'Turn on all categories at once. Adjust them individually anytime.',
    newContent: 'New content & events', contentDescription: 'New courses, new ways to play, and special events.',
    comingSoon: 'Your preference is saved. New content notifications are coming soon.', saved: 'Notification preferences saved',
  },
  es: {
    comingSoonShort: 'Próximamente',
    notifications: 'Notificaciones', learning: 'Recordatorios de aprendizaje',
    scope: 'Recordatorios de aprendizaje, cursos nuevos y eventos especiales.',
    allOnHint: 'Activa todas las categorías a la vez y ajústalas cuando quieras.',
    newContent: 'Novedades y eventos', contentDescription: 'Cursos nuevos, nuevas formas de jugar y eventos especiales.',
    comingSoon: 'Tu preferencia se guarda. Las notificaciones de novedades llegarán pronto.', saved: 'Preferencias guardadas',
  },
  fr: {
    comingSoonShort: 'Bientôt disponible',
    notifications: 'Notifications', learning: 'Rappels d’apprentissage',
    scope: 'Rappels d’apprentissage, nouveaux cours et événements spéciaux.',
    allOnHint: 'Active toutes les catégories, puis ajuste-les à tout moment.',
    newContent: 'Nouveautés et événements', contentDescription: 'Nouveaux cours, nouvelles façons de jouer et événements spéciaux.',
    comingSoon: 'Ta préférence est enregistrée. Les notifications de nouveautés arrivent bientôt.', saved: 'Préférences enregistrées',
  },
  de: {
    comingSoonShort: 'Demnächst',
    notifications: 'Mitteilungen', learning: 'Lern-Erinnerungen',
    scope: 'Lern-Erinnerungen, neue Kurse und besondere Events.',
    allOnHint: 'Alle Kategorien gemeinsam aktivieren und jederzeit einzeln anpassen.',
    newContent: 'Neuigkeiten & Events', contentDescription: 'Neue Kurse, neue Spielmöglichkeiten und besondere Events.',
    comingSoon: 'Deine Einstellung wird gespeichert. Mitteilungen zu Neuigkeiten folgen bald.', saved: 'Einstellungen gespeichert',
  },
  ja: {
    comingSoonShort: '近日公開',
    notifications: '通知', learning: '学習のお知らせ',
    scope: '学習のお知らせ、新しいコース、特別イベント。',
    allOnHint: 'すべての通知を一度にオンにして、後から個別に変更できます。',
    newContent: '新しいコンテンツとイベント', contentDescription: '新しいコース、遊び方、特別イベント。',
    comingSoon: '設定は保存されます。新しいコンテンツの通知は近日公開です。', saved: '通知設定を保存しました',
  },
  ko: {
    comingSoonShort: '곧 제공',
    notifications: '알림', learning: '학습 알림',
    scope: '학습 알림, 새 코스, 특별 이벤트를 포함해요.',
    allOnHint: '모든 알림을 한 번에 켜고 나중에 각각 조정할 수 있어요.',
    newContent: '새 콘텐츠 및 이벤트', contentDescription: '새 코스, 새로운 플레이 방식, 특별 이벤트.',
    comingSoon: '설정이 저장됩니다. 새 콘텐츠 알림은 곧 제공돼요.', saved: '알림 설정을 저장했어요',
  },
};
