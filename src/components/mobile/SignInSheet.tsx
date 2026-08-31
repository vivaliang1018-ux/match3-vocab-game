import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, X } from 'lucide-react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_SHEET_PANEL, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../i18n';
import { useModalDialog } from './useModalDialog';

type SignInSheetProps = {
  open: boolean;
  onClose: () => void;
  initialMode?: 'signIn' | 'signUp';
};

function mapAuthCode(
  code: string | null,
  t: ReturnType<typeof useI18n>['t'],
): string | null {
  if (!code || code === 'redirect_pending') return null;
  if (code === 'popup_closed') return t.auth.errorPopupClosed;
  if (code === 'invalid_credentials') return t.auth.errorInvalidCredentials;
  if (code === 'email_in_use') return t.auth.errorEmailInUse;
  if (code === 'weak_password') return t.auth.errorWeakPassword;
  if (code === 'too_many_requests') return t.auth.errorTooManyRequests;
  if (code === 'not_configured') return t.auth.errorNotConfigured;
  if (code === 'provider_disabled') return t.auth.errorProviderDisabled;
  if (code === 'network') return t.auth.errorNetwork;
  return t.auth.errorUnknown;
}

export function SignInSheet({ open, onClose, initialMode = 'signIn' }: SignInSheetProps) {
  const { t } = useI18n();
  const {
    busy,
    signInGoogle,
    signInApple,
    signInEmail,
    signUpEmail,
    sendPasswordReset,
    clearError,
    configured,
    user,
  } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const wasOpen = useRef(false);
  const dialogRef = useModalDialog({ open, onClose });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setMode(initialMode);
      setStatusError(null);
      setSuccessMsg(null);
      clearError();
    }
    wasOpen.current = open;
  }, [open, clearError, initialMode]);

  useEffect(() => {
    if (!open || !user || !successMsg) return;
    const id = window.setTimeout(() => onClose(), 900);
    return () => window.clearTimeout(id);
  }, [open, user, successMsg, onClose]);

  useEffect(() => {
    if (open && user && !successMsg && !busy) onClose();
  }, [open, user, successMsg, busy, onClose]);

  const switchMode = (next: 'signIn' | 'signUp') => {
    clearError();
    setStatusError(null);
    setSuccessMsg(null);
    setMode(next);
  };

  const submitEmail = async () => {
    setStatusError(null);
    setSuccessMsg(null);
    if (!email.trim() || password.length < 6) {
      setStatusError(t.auth.errorNeedEmail);
      return;
    }
    const code =
      mode === 'signIn'
        ? await signInEmail(email, password)
        : await signUpEmail(email, password);
    if (code) {
      setStatusError(mapAuthCode(code, t));
      return;
    }
    setSuccessMsg(mode === 'signIn' ? t.auth.successSignIn : t.auth.successSignUp);
  };

  const submitPasswordReset = async () => {
    setStatusError(null);
    setSuccessMsg(null);
    if (!email.trim() || !email.includes('@')) {
      setStatusError(t.auth.resetPasswordNeedEmail);
      return;
    }
    const code = await sendPasswordReset(email);
    if (code) {
      setStatusError(
        code === 'invalid_email' ? t.profile.accountInvalidEmail : mapAuthCode(code, t),
      );
      return;
    }
    setSuccessMsg(t.auth.resetPasswordSent);
  };

  const sheet = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="sign-in-sheet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="auth-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.auth.dialogAria}
          tabIndex={-1}
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
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => {
                    setStatusError(null);
                    setSuccessMsg(null);
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
                    setStatusError(null);
                    setSuccessMsg(null);
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

              {statusError && (
                <p className="auth-sheet-status auth-sheet-status-error" role="alert">
                  {statusError}
                </p>
              )}
              {successMsg && !statusError && (
                <p className="auth-sheet-status auth-sheet-status-ok" role="status">
                  {successMsg}
                </p>
              )}

              <motion.button
                type="button"
                disabled={busy || !configured}
                className="auth-sheet-btn auth-sheet-btn-primary"
                whileTap={busy ? undefined : MOTION_PRESS_TAP}
                onClick={() => void submitEmail()}
              >
                <Mail size={15} aria-hidden />
                {busy
                  ? mode === 'signIn'
                    ? t.auth.emailSigningIn
                    : t.auth.emailSigningUp
                  : mode === 'signIn'
                    ? t.auth.emailSignInCta
                    : t.auth.emailSignUpCta}
              </motion.button>

              {mode === 'signIn' && (
                <p className="auth-sheet-switch">
                  <button type="button" disabled={busy || !configured} onClick={() => void submitPasswordReset()}>
                    {t.auth.forgotPassword}
                  </button>
                </p>
              )}

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

            <div className="auth-sheet-footer">
              <div className="auth-sheet-divider">
                <span>{t.auth.socialDivider}</span>
              </div>
              <div className="auth-sheet-social-row">
                <button
                  type="button"
                  disabled={busy || !configured}
                  className="auth-sheet-btn auth-sheet-btn-apple"
                  onClick={() => {
                    void (async () => {
                      setStatusError(null);
                      const code = await signInApple();
                      if (code) setStatusError(mapAuthCode(code, t));
                    })();
                  }}
                >
                  <AppleMark />
                  {t.auth.appleCta}
                </button>
                <button
                  type="button"
                  disabled={busy || !configured}
                  className="auth-sheet-btn auth-sheet-btn-google"
                  onClick={() => {
                    void (async () => {
                      setStatusError(null);
                      const code = await signInGoogle();
                      if (code) setStatusError(mapAuthCode(code, t));
                    })();
                  }}
                >
                  <GoogleMark />
                  {t.auth.googleCta}
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
