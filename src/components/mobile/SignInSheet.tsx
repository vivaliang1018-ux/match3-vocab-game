import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, X } from 'lucide-react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_SHEET_PANEL, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../i18n';

type SignInSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function SignInSheet({ open, onClose }: SignInSheetProps) {
  const { t } = useI18n();
  const {
    busy,
    lastError,
    signInGoogle,
    signInApple,
    signInEmail,
    signUpEmail,
    clearError,
    configured,
    user,
  } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setMode('signIn');
    clearError();
  }, [open, clearError]);

  useEffect(() => {
    if (open && user) onClose();
  }, [open, user, onClose]);

  const errorText =
    lastError === 'popup_closed'
      ? t.auth.errorPopupClosed
      : lastError === 'invalid_credentials'
        ? t.auth.errorInvalidCredentials
        : lastError === 'email_in_use'
          ? t.auth.errorEmailInUse
          : lastError === 'weak_password'
            ? t.auth.errorWeakPassword
            : lastError === 'too_many_requests'
              ? t.auth.errorTooManyRequests
              : lastError === 'not_configured'
                ? t.auth.errorNotConfigured
                : lastError === 'provider_disabled'
                  ? t.auth.errorProviderDisabled
                  : lastError
                    ? t.auth.errorUnknown
                    : null;

  const switchMode = (next: 'signIn' | 'signUp') => {
    clearError();
    setMode(next);
  };

  const submitEmail = async () => {
    if (!email.trim() || password.length < 6) return;
    if (mode === 'signIn') {
      await signInEmail(email, password);
    } else {
      await signUpEmail(email, password);
    }
  };

  const sheet = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sign-in-sheet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="auth-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.auth.dialogAria}
          onClick={onClose}
        >
          <motion.div className="auth-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="auth-sheet-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-sheet-handle" aria-hidden />

            <div className="auth-sheet-header">
              <h2 className="auth-sheet-title">
                {mode === 'signUp' ? t.auth.emailSignUpCta : t.auth.dialogTitle}
              </h2>
              <button
                type="button"
                className="auth-sheet-close"
                aria-label={t.common.close}
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>

            <p className="auth-sheet-lead">{t.auth.dialogBody}</p>

            {!configured && <p className="auth-sheet-warn">{t.auth.errorNotConfigured}</p>}

            <div className="auth-sheet-fields">
              <label className="auth-sheet-field">
                <span>{t.auth.email}</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                />
              </label>

              <label className="auth-sheet-field">
                <span>{t.auth.password}</span>
                <input
                  type="password"
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void submitEmail();
                    }
                  }}
                  placeholder="••••••••"
                />
              </label>

              {errorText && <p className="auth-sheet-error">{errorText}</p>}

              <motion.button
                type="button"
                disabled={busy || !configured || !email.trim() || password.length < 6}
                className="auth-sheet-btn auth-sheet-btn-primary"
                whileTap={busy ? undefined : MOTION_PRESS_TAP}
                onClick={() => void submitEmail()}
              >
                <Mail size={15} aria-hidden />
                {mode === 'signIn' ? t.auth.emailSignInCta : t.auth.emailSignUpCta}
              </motion.button>

              <p className="auth-sheet-switch">
                {mode === 'signIn' ? (
                  <>
                    {t.auth.noAccount}{' '}
                    <button type="button" onClick={() => switchMode('signUp')}>
                      {t.auth.switchToSignUp}
                    </button>
                  </>
                ) : (
                  <>
                    {t.auth.hasAccount}{' '}
                    <button type="button" onClick={() => switchMode('signIn')}>
                      {t.auth.switchToSignIn}
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Footer always visible — not inside a clipped scroll parent */}
            <div className="auth-sheet-footer">
              <div className="auth-sheet-divider">
                <span>{t.auth.socialDivider}</span>
              </div>
              <div className="auth-sheet-social-row">
                <button
                  type="button"
                  disabled={busy || !configured}
                  className="auth-sheet-btn auth-sheet-btn-apple"
                  onClick={() => void signInApple()}
                >
                  <AppleMark />
                  Apple
                </button>
                <button
                  type="button"
                  disabled={busy || !configured}
                  className="auth-sheet-btn auth-sheet-btn-google"
                  onClick={() => void signInGoogle()}
                >
                  <GoogleMark />
                  Google
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(sheet, document.body);
}

function AppleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.2 3.02-.9.96-2.4 1.7-3.66 1.6-.1-1.1.4-2.24 1.2-3.08.9-.96 2.46-1.66 3.66-1.54zM20.5 17.2c-.56 1.28-.83 1.85-1.55 2.98-1 1.56-2.4 3.5-4.15 3.52-1.55.02-1.95-1-4.05-1-2.1 0-2.55.98-4.08 1.02-1.72.04-3.04-1.7-4.05-3.25C.9 17.4-.7 12.7.9 9.5c1.02-2.05 2.85-3.35 4.8-3.35 1.78 0 2.9 1.16 4.38 1.16 1.42 0 2.28-1.16 4.32-1.16 1.55 0 3.18.84 4.2 2.3-3.7 2.02-3.1 7.28.9 8.75z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
