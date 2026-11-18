import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Locale } from '../../i18n/types';
import { NOTIFICATION_SETTINGS_COPY } from '../../i18n/notificationSettingsCopy';
import { NOTIFICATION_SCOPE_COPY } from '../../i18n/notificationScopeCopy';
import { deferLearningReminder, recordInlineReminderView, shouldOfferLearningReminder, type LearningReminderResult } from '../../lib/learningNotificationsV2';

const COPY: Record<Locale, { title: (count: number) => string; body: string; later: string }> = {
  'zh-CN': { title: n => `你已经学会了 ${n} 个新词！`, body: '每天一分钟，也是在进步。\n让我提醒你，把这份进步坚持下去。', later: '暂时不用' },
  en: { title: n => `You’ve learned ${n} new ${n === 1 ? 'word' : 'words'}!`, body: 'A minute a day is a little progress.\nLet me remind you to keep it going.', later: 'Not now' },
  es: { title: n => `¡Has aprendido ${n} palabras nuevas!`, body: 'Un minuto al día también es progreso.\nDéjame recordártelo para seguir avanzando.', later: 'Ahora no' },
  fr: { title: n => `Tu as appris ${n} nouveaux mots !`, body: 'Une minute par jour, c’est déjà un progrès.\nLaisse-moi te rappeler de continuer.', later: 'Pas maintenant' },
  de: { title: n => `Du hast ${n} neue Wörter gelernt!`, body: 'Eine Minute am Tag ist ein kleiner Fortschritt.\nLass mich dich ans Weitermachen erinnern.', later: 'Jetzt nicht' },
  ja: { title: n => `${n}個の新しい単語を学びました！`, body: '毎日1分でも、一歩ずつ前進。\n続けられるよう、お知らせします。', later: '今はしない' },
  ko: { title: n => `새 단어 ${n}개를 배웠어요!`, body: '하루 1분도 작은 발전이에요.\n계속할 수 있도록 알려드릴게요.', later: '지금은 괜찮아요' },
};

export type LearningReminderCardHandle = { continueWith: (action: () => void) => void };

export const LearningReminderCard = forwardRef<LearningReminderCardHandle, {
  count: number;
  locale: Locale;
  onEnable: () => Promise<LearningReminderResult>;
}>(function LearningReminderCard({ count, locale, onEnable }, ref) {
  const [visible, setVisible] = useState(() => shouldOfferLearningReminder());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const viewNumber = useRef(0);
  const cardRef = useRef<HTMLElement | null>(null);
  const enableRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();
  const copy = COPY[locale];
  const settingsCopy = NOTIFICATION_SETTINGS_COPY[locale];
  useEffect(() => {
    if (visible && viewNumber.current === 0) viewNumber.current = recordInlineReminderView();
  }, [visible]);
  useImperativeHandle(ref, () => ({
    continueWith(action) {
      if (visible && viewNumber.current >= 2) deferLearningReminder();
      action();
    },
  }));
  const finishChoice = () => {
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <aside ref={cardRef} className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-3 text-left">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-lg" aria-hidden>🔔</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-black leading-snug text-sky-950">{copy.title(count)}</h3>
          <p className="mt-1 whitespace-pre-line text-[11px] font-semibold leading-relaxed text-sky-800/75">{copy.body}</p>
          <p className="mt-1 text-[10px] font-semibold leading-relaxed text-sky-800/65">{NOTIFICATION_SCOPE_COPY[locale].scope}</p>
          {message ? <p className="mt-2 text-[11px] font-bold text-sky-900" role="status">{message}</p> : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <motion.button ref={enableRef} type="button" disabled={busy}
              animate={reduceMotion || busy ? { boxShadow: '0 0 0 0 rgba(56,189,248,0)' } : { boxShadow: ['0 0 0 0 rgba(56,189,248,0)', '0 0 12px 3px rgba(56,189,248,0.45)', '0 0 0 0 rgba(56,189,248,0)'] }}
              transition={{ duration: 2.4, repeat: reduceMotion || busy ? 0 : Infinity, ease: 'easeInOut' }}
              className="min-h-9 rounded-xl bg-sky-500 px-3 text-[11px] font-black text-white shadow-sm disabled:opacity-50" onClick={() => {
              if (busy) return;
              setBusy(true);
              void onEnable().then(result => {
                if (result !== 'enabled') deferLearningReminder();
                if (result === 'enabled') finishChoice();
                else {
                  viewNumber.current = 0;
                  setMessage(result === 'denied' ? settingsCopy.permissionDenied : settingsCopy.unavailable);
                }
              }).catch(() => {
                deferLearningReminder();
                viewNumber.current = 0;
                setMessage(settingsCopy.unavailable);
              }).finally(() => setBusy(false));
            }}>{settingsCopy.remindMe}</motion.button>
            <button type="button" disabled={busy} className="min-h-9 px-1 text-[11px] font-bold text-sky-700" onClick={() => { deferLearningReminder(); finishChoice(); }}>{copy.later}</button>
          </div>
        </div>
      </div>
    </aside>
  );
});
