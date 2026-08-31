import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useModalDialog } from './useModalDialog';

type LegalDocSheetProps = {
  open: boolean;
  title: string;
  src: string;
  onClose: () => void;
};

/** Full-screen in-app viewer for bundled legal HTML (works on Capacitor iOS). */
export function LegalDocSheet({ open, title, src, onClose }: LegalDocSheetProps) {
  const { t } = useI18n();
  const dialogRef = useModalDialog({ open, onClose });

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="legal-doc-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="legal-doc-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
        >
          <div className="legal-doc-sheet-bar">
            <span className="legal-doc-sheet-title">{title}</span>
            <button
              type="button"
              className="legal-doc-sheet-close"
              onClick={onClose}
              aria-label={t.common.close}
            >
              <X size={18} aria-hidden />
            </button>
          </div>
          <iframe className="legal-doc-sheet-frame" src={src} title={title} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
