import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import type { Locale } from '../../i18n/types';
import { NOTIFICATION_SETTINGS_COPY } from '../../i18n/notificationSettingsCopy';
import { NOTIFICATION_SCOPE_COPY } from '../../i18n/notificationScopeCopy';
import {
  disableLearningReminders,
  enableLearningReminders,
  formatLearningReminderTime,
  getLearningReminderDiagnostics,
  readLearningReminderSettings,
  setLearningReminderCategory,
  setLearningReminderTime,
  type LearningReminderCategory,
  type LearningReminderDiagnostics,
  type LearningReminderContext,
} from '../../lib/learningNotificationsV2';
import { useModalDialog } from './useModalDialog';

type Props = {
  open: boolean;
  locale: Locale;
  hasPremiumAccess: boolean;
  playedToday: boolean;
  reminderGameState?: Pick<LearningReminderContext, 'dueReviewCount' | 'staminaValue' | 'nextStaminaAt'>;
  onClose: () => void;
  onStatus: (message: string) => void;
};

export function NotificationSettingsSheet({ open, locale, hasPremiumAccess, playedToday, reminderGameState, onClose, onStatus }: Props) {
  const copy = NOTIFICATION_SETTINGS_COPY[locale];
  const scopeCopy = NOTIFICATION_SCOPE_COPY[locale];
  const [settings, setSettings] = useState(readLearningReminderSettings);
  const [diagnostics, setDiagnostics] = useState<LearningReminderDiagnostics | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const dialogRef = useModalDialog({ open, onClose });
  const context = { locale, hasPremiumAccess, playedToday, ...reminderGameState };

  const reload = async () => {
    setSettings(readLearningReminderSettings());
    setDiagnostics(await getLearningReminderDiagnostics());
  };

  useEffect(() => {
    if (!open) return;
    setNotice(null);
    void reload();
    const update = () => { void reload(); };
    const listener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) update();
    });
    window.addEventListener('lingomatch-reminders-changed', update);
    return () => {
      window.removeEventListener('lingomatch-reminders-changed', update);
      void listener.then(handle => handle.remove());
    };
  }, [open, locale]);

  const run = async (
    action: () => Promise<'enabled' | 'disabled' | 'denied' | 'unavailable'>,
    successMessage?: string,
  ) => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await action();
      await reload();
      const message = result === 'denied'
        ? copy.permissionDenied
        : result === 'unavailable'
          ? copy.unavailable
          : successMessage ?? (result === 'enabled' ? copy.enabled : copy.disabled);
      setNotice(message);
      onStatus(message);
    } catch (error) {
      console.warn('[match3] unable to update notification settings', error);
      onStatus(copy.unavailable);
      setNotice(copy.unavailable);
    } finally {
      setBusy(false);
    }
  };

  const toggleCategory = (category: LearningReminderCategory, enabled: boolean) => {
    void run(() => setLearningReminderCategory(category, enabled, context), scopeCopy.saved);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-[220] flex items-end justify-center bg-slate-950/45 p-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label={copy.settingsTitle}
          tabIndex={-1}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-[28px] border-2 border-sky-200 bg-[#fffaf5] p-4 shadow-2xl"
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            onClick={event => event.stopPropagation()}
          >
            <header className="mb-3 flex shrink-0 items-center gap-3">
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-sky-900" aria-label={copy.later}>
                <ChevronLeft size={22} />
              </button>
              <div>
                <h2 className="text-lg font-black text-sky-950">{copy.settingsTitle}</h2>
              </div>
            </header>

            <div className="min-h-0 overflow-y-auto overscroll-contain" data-notification-settings-scroll>
            <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white">
              <SettingSwitch label={scopeCopy.notifications} enabled={settings.enabled} disabled={busy} onChange={enabled => {
                void run(() => enabled ? enableLearningReminders(context) : disableLearningReminders());
              }} />
              <h3 className="bg-sky-50 px-4 py-2 text-[11px] font-black text-sky-700">{scopeCopy.learning}</h3>
              <SettingSwitch label={copy.smartReview} enabled={settings.reviewEnabled} disabled={busy || !settings.enabled} onChange={enabled => toggleCategory('review', enabled)} />
              <SettingSwitch label={copy.streak} enabled={settings.streakEnabled} disabled={busy || !settings.enabled} onChange={enabled => toggleCategory('streak', enabled)} />
              <SettingSwitch label={copy.stamina} enabled={settings.staminaEnabled} disabled={busy || !settings.enabled} onChange={enabled => toggleCategory('stamina', enabled)} />
              <label className="flex min-h-12 items-center gap-3 border-t border-sky-100 px-4 py-2 text-sm font-black text-sky-950">
                <span className="flex-1">{copy.reminderTime}</span>
                <input
                  type="time"
                  value={formatLearningReminderTime(settings)}
                  min="08:00"
                  max="21:00"
                  disabled={busy || !settings.enabled}
                  className="rounded-xl border border-sky-200 bg-sky-50 px-2 py-1.5 font-black text-sky-900 disabled:opacity-40"
                  onChange={event => void run(() => setLearningReminderTime(event.target.value, context))}
                />
              </label>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-sky-100 bg-white">
              <SettingSwitch label={scopeCopy.newContent} description={scopeCopy.comingSoonShort} enabled={settings.newContentEnabled} disabled={busy || !settings.enabled} onChange={enabled => toggleCategory('newContent', enabled)} />
            </div>
            </div>

            {(notice || (diagnostics && diagnostics.permission !== 'granted')) && <footer className="shrink-0 pt-3">
            {diagnostics && diagnostics.permission !== 'granted' && (
              <p className="mb-2 text-center text-[11px] font-semibold text-sky-800/70">
                {diagnostics.available ? copy.permissionDenied : copy.unavailable}
              </p>
            )}
            {notice && <p className="mt-2 text-center text-[11px] font-black text-emerald-700" role="status">{notice}</p>}

            </footer>}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function SettingSwitch({ label, description, enabled, disabled, onChange }: { label: string; description?: string; enabled: boolean; disabled: boolean; onChange: (enabled: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} disabled={disabled} onClick={() => onChange(!enabled)} className="flex min-h-12 w-full items-center gap-3 border-b border-sky-100 px-4 py-2 text-left disabled:opacity-40">
      <span className="flex-1 text-sm font-black text-sky-950">
        {label}
        {description && <span className="mt-0.5 block text-[10px] font-semibold text-sky-700/65">{description}</span>}
      </span>
      <span className={`relative h-7 w-12 rounded-full transition ${enabled ? 'bg-emerald-400' : 'bg-slate-200'}`} aria-hidden>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
  );
}
