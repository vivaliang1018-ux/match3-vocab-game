import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, LockKeyhole, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_SHEET_PANEL, MOTION_VIGNETTE } from '../../lib/motionChoreography';

export type AccountPromptKind = 'soft' | 'streak';

type AccountPromptSheetProps = {
  open: boolean;
  kind: AccountPromptKind;
  discoveredCount: number;
  onCreateAccount: () => void;
  onSignIn: () => void;
  onDismiss: () => void;
};

export function AccountPromptSheet({
  open,
  kind,
  discoveredCount,
  onCreateAccount,
  onSignIn,
  onDismiss,
}: AccountPromptSheetProps) {
  const { t, ui } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const streak = kind === 'streak';
  const title = streak
    ? ui.accountPrompt.streakTitle
    : ui.accountPrompt.collectionTitle;
  const body = streak
    ? ui.accountPrompt.streakBody
    : ui.accountPrompt.collectionBody(discoveredCount);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="auth-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={onDismiss}
        >
          <motion.div className="auth-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="auth-sheet-panel account-nudge-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="auth-sheet-handle" aria-hidden />
            <button type="button" className="auth-sheet-close account-nudge-close" onClick={onDismiss} aria-label={t.common.close}>
              <X size={16} />
            </button>
            <div className="account-nudge-icon" aria-hidden>
              {streak ? <Flame size={30} /> : <LockKeyhole size={30} />}
            </div>
            <h2 className="account-nudge-title">{title}</h2>
            <p className="account-nudge-body">{body}</p>

            <motion.button
              type="button"
              whileTap={MOTION_PRESS_TAP}
              className="auth-sheet-btn auth-sheet-btn-primary account-nudge-primary"
              onClick={onCreateAccount}
            >
              {ui.accountPrompt.create}
            </motion.button>
            <button type="button" className="account-nudge-sign-in" onClick={onSignIn}>
              {ui.accountPrompt.signIn}
            </button>
            <button type="button" className="account-nudge-skip" onClick={onDismiss}>
              {streak ? ui.accountPrompt.continueWithoutStreak : ui.accountPrompt.notNow}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
