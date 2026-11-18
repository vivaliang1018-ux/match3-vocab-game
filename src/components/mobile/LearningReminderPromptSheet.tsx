import { AnimatePresence, motion } from 'motion/react';
import type { Locale } from '../../i18n/types';
import { NOTIFICATION_SETTINGS_COPY } from '../../i18n/notificationSettingsCopy';
import { useModalDialog } from './useModalDialog';

export function LearningReminderPromptSheet({ open, kind, locale, busy, onEnable, onLater }: {
  open: boolean;
  kind: 'learning' | 'stamina';
  locale: Locale;
  busy: boolean;
  onEnable: () => void;
  onLater: () => void;
}) {
  const copy = NOTIFICATION_SETTINGS_COPY[locale];
  const dialogRef = useModalDialog({ open, onClose: onLater });
  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={dialogRef} className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-[2px]" role="dialog" aria-modal="true" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="w-full max-w-[20rem] rounded-[28px] border-2 border-sky-200 bg-[#fffaf5] p-5 text-center shadow-2xl" initial={{ scale: 0.88, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}>
            <div className="text-5xl" aria-hidden>{kind === 'stamina' ? '⚡️🔔' : '🧠🔔'}</div>
            <h2 className="mt-3 text-xl font-black text-sky-950">{kind === 'stamina' ? copy.staminaPromptTitle : copy.promptTitle}</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-sky-900/70">{kind === 'stamina' ? copy.staminaPromptBody : copy.promptBody}</p>
            <button type="button" disabled={busy} onClick={onEnable} className="mt-5 min-h-12 w-full rounded-2xl bg-gradient-to-b from-pink-400 to-pink-600 text-sm font-black text-white shadow-[0_4px_0_#be185d] disabled:opacity-50">{copy.remindMe}</button>
            <button type="button" disabled={busy} onClick={onLater} className="mt-2 min-h-10 w-full text-xs font-black text-sky-800/60">{copy.later}</button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
