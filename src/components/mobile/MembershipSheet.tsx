import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Crown, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_SHEET_PANEL, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import type { MembershipPlan } from '../../membership/MembershipProvider';
import { MEMBERSHIP_COPY } from '../../membership/membershipCopy';
import { useModalDialog } from './useModalDialog';

type MembershipSheetProps = {
  open: boolean;
  mode: 'welcome' | 'paywall';
  expired?: boolean;
  signedIn: boolean;
  monthlyDisplayPrice: string;
  annualDisplayPrice: string;
  onStartTrial: () => void;
  onSelectPlan: (plan: MembershipPlan) => boolean;
  onContinueFree: () => void;
  onRestore: () => void;
  onClose: () => void;
};

export function MembershipSheet({
  open,
  mode,
  expired = false,
  signedIn,
  monthlyDisplayPrice,
  annualDisplayPrice,
  onStartTrial,
  onSelectPlan,
  onContinueFree,
  onRestore,
  onClose,
}: MembershipSheetProps) {
  const { locale, t } = useI18n();
  const copy = MEMBERSHIP_COPY[locale];
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const dialogRef = useModalDialog({
    open,
    onClose,
    closeOnEscape: mode === 'paywall',
  });

  useEffect(() => {
    if (open) setStatusMessage(null);
  }, [open, mode]);

  const choosePlan = (plan: MembershipPlan) => {
    setStatusMessage(null);
    if (!onSelectPlan(plan)) setStatusMessage(copy.purchasePending);
  };

  const restore = () => {
    setStatusMessage(copy.purchasePending);
    onRestore();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key={`membership-${mode}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="auth-sheet-overlay membership-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={mode === 'welcome' ? copy.trialTitle : copy.paywallTitle}
          tabIndex={-1}
          onClick={mode === 'welcome' ? undefined : onClose}
        >
          <motion.div className="auth-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="auth-sheet-panel membership-sheet-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="auth-sheet-handle" aria-hidden />
            {mode === 'paywall' && (
              <button
                type="button"
                className="auth-sheet-close membership-sheet-close"
                onClick={onClose}
                aria-label={t.common.close}
              >
                <X size={16} aria-hidden />
              </button>
            )}

            <div className="membership-crown" aria-hidden>
              <Crown size={31} strokeWidth={2.6} />
            </div>
            <h2 className="membership-title">
              {mode === 'welcome'
                ? copy.trialTitle
                : expired
                  ? copy.expiredTitle
                  : copy.paywallTitle}
            </h2>
            <p className="membership-lead">
              {mode === 'welcome' ? copy.trialBody : copy.paywallBody}
            </p>

            {mode === 'welcome' ? (
              <>
                <div className="membership-no-charge">✓ {copy.noCharge}</div>
                <motion.button
                  type="button"
                  className="membership-primary"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onStartTrial}
                >
                  {copy.startLearning}
                </motion.button>
              </>
            ) : (
              <>
                <ul className="membership-benefits">
                  {copy.benefits.map((benefit) => (
                    <li key={benefit}>
                      <span aria-hidden><Check size={14} strokeWidth={3} /></span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {!signedIn && (
                  <div className="membership-account-note">
                    {copy.accountRequired}
                  </div>
                )}

                <motion.button
                  type="button"
                  className="membership-plan membership-plan-annual"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => choosePlan('annual')}
                >
                  <span className="membership-plan-badge">{copy.recommended}</span>
                  <span>
                    <strong>{copy.annual}</strong>
                    <small>{annualDisplayPrice} {copy.perYear}</small>
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  className="membership-plan"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => choosePlan('monthly')}
                >
                  <span>
                    <strong>{copy.monthly}</strong>
                    <small>{monthlyDisplayPrice} {copy.perMonth}</small>
                  </span>
                </motion.button>

                {statusMessage && (
                  <p className="auth-sheet-status auth-sheet-status-ok">
                    {statusMessage}
                  </p>
                )}

                <button
                  type="button"
                  className="membership-free"
                  onClick={onContinueFree}
                >
                  {copy.continueFree}
                </button>
                <button type="button" className="membership-restore" onClick={restore}>
                  {copy.restore}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
