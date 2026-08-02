import { useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';
import { assetUrl } from '../../lib/assetUrl';
import { LegalDocSheet } from './LegalDocSheet';

type LegalConsentModalProps = {
  open: boolean;
  onAccept: () => void;
};

type DocKind = 'terms' | 'privacy';

export function LegalConsentModal({ open, onAccept }: LegalConsentModalProps) {
  const { t } = useI18n();
  const [doc, setDoc] = useState<DocKind | null>(null);

  const termsHref = assetUrl('terms.html');
  const privacyHref = assetUrl('privacy.html');
  const docTitle = doc === 'terms' ? t.consent.termsLink : t.consent.privacyLink;
  const docHref = doc === 'terms' ? termsHref : privacyHref;

  const openDoc = (kind: DocKind) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setDoc(kind);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="legal-consent-modal"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="fixed inset-0 z-[130] flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label={t.consent.dialogAria}
          aria-labelledby="legal-consent-title"
          aria-describedby="legal-consent-body"
        >
          <motion.div className="absolute inset-0 bg-black/50" aria-hidden />
          <motion.div
            variants={MOTION_MODAL_CARD}
            className="legal-consent-modal relative w-full max-w-[320px]"
          >
            <h2 id="legal-consent-title" className="legal-consent-title">
              {t.consent.title}
            </h2>

            <div className="legal-consent-logo-wrap" aria-hidden>
              <img
                src={assetUrl('splash-logo.webp')}
                alt=""
                className="legal-consent-logo"
                width={88}
                height={88}
                decoding="async"
              />
            </div>

            <div id="legal-consent-body" className="legal-consent-body">
              <p>{t.consent.intro}</p>
              <p className="legal-consent-agree">
                {t.consent.agreeBefore}
                <a className="legal-consent-link" href={termsHref} onClick={openDoc('terms')}>
                  {t.consent.termsLink}
                </a>
                {t.consent.agreeAnd}
                <a className="legal-consent-link" href={privacyHref} onClick={openDoc('privacy')}>
                  {t.consent.privacyLink}
                </a>
                {t.consent.agreeAfter}
              </p>
            </div>

            <div className="legal-consent-actions">
              <motion.button
                type="button"
                className="legal-consent-accept"
                onClick={onAccept}
                whileTap={MOTION_PRESS_TAP}
              >
                {t.consent.accept}
              </motion.button>
            </div>
          </motion.div>

          <LegalDocSheet
            open={doc !== null}
            title={docTitle}
            src={docHref}
            onClose={() => setDoc(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
