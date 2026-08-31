import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, ChevronRight, LogOut, Trash2, User, X } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_SHEET_PANEL, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../i18n';
import {
  AVATAR_PRESETS,
  getAvatarPresetId,
  providerLabel,
  setAvatarPresetId,
} from '../../lib/accountProfile';
import { cn } from '../../lib/utils';
import { useModalDialog } from './useModalDialog';

type AccountSettingsSheetProps = {
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
};

export function AccountSettingsSheet({ open, onClose, onDeleted }: AccountSettingsSheetProps) {
  const { t } = useI18n();
  const {
    user,
    busy,
    lastError,
    clearError,
    updateDisplayName,
    changePassword,
    changeEmail,
    hasPasswordProvider,
    signOut,
    deleteAccount,
  } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [presetId, setPresetId] = useState(AVATAR_PRESETS[0].id);
  const [pickingAvatar, setPickingAvatar] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [nameAttempted, setNameAttempted] = useState(false);
  const [securityPanel, setSecurityPanel] = useState<'none' | 'email' | 'password'>('none');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityOk, setSecurityOk] = useState<string | null>(null);
  const dialogRef = useModalDialog({ open: open && Boolean(user), onClose });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !user) return;
    clearError();
    setConfirmDelete(false);
    setPickingAvatar(false);
    setSavedFlash(false);
    setNameAttempted(false);
    setSecurityPanel('none');
    setCurrentPassword('');
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setSecurityError(null);
    setSecurityOk(null);
    setNameDraft(user.displayName || user.email?.split('@')[0] || '');
    setPresetId(getAvatarPresetId(user.uid));
  }, [open, user, clearError]);

  useEffect(() => {
    if (!open) return;
    if (!user && !busy) {
      onClose();
      onDeleted?.();
    }
  }, [user, busy, open, onClose, onDeleted]);

  if (!mounted) return null;

  const deleteError =
    lastError === 'requires_recent_login'
      ? t.profile.deleteAccountNeedsRelogin
      : lastError === 'not_configured'
        ? t.auth.errorNotConfigured
        : confirmDelete && lastError
          ? t.profile.deleteAccountFailed
          : null;

  const nameError =
    !nameAttempted
      ? null
      : lastError === 'empty_display_name'
        ? t.profile.accountNameEmpty
        : lastError
          ? t.profile.accountNameSaveFailed
          : null;

  const providers = user?.providerData ?? [];

  const sheet = (
    <AnimatePresence>
      {open && user && (
        <motion.div
          ref={dialogRef}
          key="account-settings-sheet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="auth-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.profile.accountSettingsTitle}
          tabIndex={-1}
          onClick={onClose}
        >
          <motion.div className="auth-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="auth-sheet-panel account-sheet-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-sheet-handle" aria-hidden />

            <div className="auth-sheet-header">
              <h2 className="auth-sheet-title">{t.profile.accountSettingsTitle}</h2>
              <button
                type="button"
                className="auth-sheet-close"
                aria-label={t.common.close}
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>

            <div className="auth-sheet-fields account-sheet-body">
              <div className="account-avatar-block">
                <button
                  type="button"
                  className="account-avatar-btn"
                  aria-label={t.profile.accountChangeAvatar}
                  onClick={() => setPickingAvatar((v) => !v)}
                >
                  <AccountAvatar user={user} presetId={presetId} size="lg" />
                  <span className="account-avatar-edit">
                    <Camera size={12} aria-hidden />
                  </span>
                </button>
                <p className="account-avatar-hint">{t.profile.accountChangeAvatar}</p>
              </div>

              {pickingAvatar && (
                <div className="account-avatar-grid" role="listbox" aria-label={t.profile.accountChangeAvatar}>
                  {AVATAR_PRESETS.map((p) => {
                    const selected = p.id === presetId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cn('account-avatar-option', selected && 'account-avatar-option-on')}
                        style={{
                          background: `linear-gradient(165deg, ${p.from} 0%, ${p.to} 100%)`,
                        }}
                        onClick={() => {
                          setAvatarPresetId(user.uid, p.id);
                          setPresetId(p.id);
                          setPickingAvatar(false);
                        }}
                      >
                        <span aria-hidden>{p.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <label className="auth-sheet-field">
                <span>{t.profile.accountDisplayName}</span>
                <input
                  type="text"
                  maxLength={32}
                  value={nameDraft}
                  onChange={(e) => {
                    clearError();
                    setNameDraft(e.target.value);
                  }}
                  placeholder={t.profile.accountDisplayNamePlaceholder}
                />
              </label>

              <motion.button
                type="button"
                disabled={
                  busy ||
                  !nameDraft.trim() ||
                  nameDraft.trim() === (user.displayName || '').trim()
                }
                className="auth-sheet-btn auth-sheet-btn-primary"
                whileTap={busy ? undefined : MOTION_PRESS_TAP}
                onClick={() => {
                  setNameAttempted(true);
                  void updateDisplayName(nameDraft).then((ok) => {
                    if (ok) {
                      setNameAttempted(false);
                      setSavedFlash(true);
                      window.setTimeout(() => setSavedFlash(false), 1600);
                    }
                  });
                }}
              >
                {t.profile.accountSaveName}
              </motion.button>
              {savedFlash && (
                <p className="account-saved-flash">{t.profile.accountNameSaved}</p>
              )}
              {nameError && <p className="auth-sheet-error">{nameError}</p>}

              <div className="account-section">
                <div className="account-section-label">{t.profile.accountLinkedTitle}</div>
                <div className="account-info-card">
                  <div className="account-info-row">
                    <span>{t.profile.accountEmail}</span>
                    <strong>{user.email || t.profile.accountEmailHidden}</strong>
                  </div>
                  {providers.length === 0 ? (
                    <div className="account-info-row">
                      <span>{t.profile.accountProviders}</span>
                      <strong>—</strong>
                    </div>
                  ) : (
                    providers.map((p) => {
                      const kind = providerLabel(p.providerId);
                      const label =
                        kind === 'apple'
                          ? t.profile.accountProviderApple
                          : kind === 'google'
                            ? t.profile.accountProviderGoogle
                            : kind === 'password'
                              ? t.profile.accountProviderEmail
                              : p.providerId;
                      return (
                        <div key={p.providerId} className="account-info-row">
                          <span>{label}</span>
                          <strong className="account-provider-ok">
                            {t.profile.accountProviderLinked}
                          </strong>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="account-section">
                <div className="account-section-label">{t.profile.accountSecurityTitle}</div>
                {hasPasswordProvider ? (
                  <div className="account-security">
                    <div className="account-security-toggles">
                      <button
                        type="button"
                        className={cn(
                          'account-security-toggle',
                          securityPanel === 'email' && 'account-security-toggle-on',
                        )}
                        onClick={() => {
                          setSecurityError(null);
                          setSecurityOk(null);
                          setSecurityPanel((p) => (p === 'email' ? 'none' : 'email'));
                        }}
                      >
                        {t.profile.accountChangeEmail}
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'account-security-toggle',
                          securityPanel === 'password' && 'account-security-toggle-on',
                        )}
                        onClick={() => {
                          setSecurityError(null);
                          setSecurityOk(null);
                          setSecurityPanel((p) => (p === 'password' ? 'none' : 'password'));
                        }}
                      >
                        {t.profile.accountChangePassword}
                      </button>
                    </div>

                    {securityPanel === 'email' && (
                      <div className="account-security-form">
                        <label className="auth-sheet-field">
                          <span>{t.profile.accountCurrentPassword}</span>
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => {
                              setSecurityError(null);
                              setCurrentPassword(e.target.value);
                            }}
                          />
                        </label>
                        <label className="auth-sheet-field">
                          <span>{t.profile.accountNewEmail}</span>
                          <input
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            value={newEmail}
                            onChange={(e) => {
                              setSecurityError(null);
                              setNewEmail(e.target.value);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          disabled={busy || !currentPassword || !newEmail.trim()}
                          className="auth-sheet-btn auth-sheet-btn-primary"
                          onClick={() => {
                            void (async () => {
                              setSecurityError(null);
                              setSecurityOk(null);
                              const code = await changeEmail(currentPassword, newEmail);
                              if (code) {
                                setSecurityError(
                                  code === 'invalid_credentials'
                                    ? t.profile.accountWrongPassword
                                    : code === 'invalid_email'
                                      ? t.profile.accountInvalidEmail
                                      : code === 'same_email'
                                        ? t.profile.accountSameEmail
                                        : code === 'email_in_use'
                                          ? t.auth.errorEmailInUse
                                          : code === 'requires_recent_login'
                                            ? t.profile.deleteAccountNeedsRelogin
                                            : t.auth.errorUnknown,
                                );
                                return;
                              }
                              setSecurityOk(t.profile.accountEmailVerifySent);
                              setCurrentPassword('');
                              setNewEmail('');
                            })();
                          }}
                        >
                          {t.profile.accountSaveEmail}
                        </button>
                      </div>
                    )}

                    {securityPanel === 'password' && (
                      <div className="account-security-form">
                        <label className="auth-sheet-field">
                          <span>{t.profile.accountCurrentPassword}</span>
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => {
                              setSecurityError(null);
                              setCurrentPassword(e.target.value);
                            }}
                          />
                        </label>
                        <label className="auth-sheet-field">
                          <span>{t.profile.accountNewPassword}</span>
                          <input
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => {
                              setSecurityError(null);
                              setNewPassword(e.target.value);
                            }}
                          />
                        </label>
                        <label className="auth-sheet-field">
                          <span>{t.profile.accountConfirmPassword}</span>
                          <input
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setSecurityError(null);
                              setConfirmPassword(e.target.value);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          disabled={
                            busy || !currentPassword || newPassword.length < 6 || !confirmPassword
                          }
                          className="auth-sheet-btn auth-sheet-btn-primary"
                          onClick={() => {
                            void (async () => {
                              setSecurityError(null);
                              setSecurityOk(null);
                              if (newPassword !== confirmPassword) {
                                setSecurityError(t.profile.accountPasswordMismatch);
                                return;
                              }
                              const code = await changePassword(currentPassword, newPassword);
                              if (code) {
                                setSecurityError(
                                  code === 'invalid_credentials'
                                    ? t.profile.accountWrongPassword
                                    : code === 'weak_password'
                                      ? t.auth.errorWeakPassword
                                      : code === 'requires_recent_login'
                                        ? t.profile.deleteAccountNeedsRelogin
                                        : t.auth.errorUnknown,
                                );
                                return;
                              }
                              setSecurityOk(t.profile.accountPasswordChanged);
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                            })();
                          }}
                        >
                          {t.profile.accountSavePassword}
                        </button>
                      </div>
                    )}

                    {securityError && (
                      <p className="auth-sheet-status auth-sheet-status-error" role="alert">
                        {securityError}
                      </p>
                    )}
                    {securityOk && !securityError && (
                      <p className="auth-sheet-status auth-sheet-status-ok" role="status">
                        {securityOk}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="account-security-hint">{t.profile.accountSecurityOnlyPassword}</p>
                )}
              </div>

              <div className="account-actions">
                <motion.button
                  type="button"
                  disabled={busy}
                  className="account-action-btn account-action-signout"
                  whileTap={busy ? undefined : MOTION_PRESS_TAP}
                  onClick={() => void signOut()}
                >
                  <LogOut size={16} aria-hidden />
                  {t.profile.signOutCta}
                  <ChevronRight size={14} className="account-action-chevron" aria-hidden />
                </motion.button>

                {!confirmDelete ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="account-delete-link"
                    onClick={() => {
                      clearError();
                      setConfirmDelete(true);
                    }}
                  >
                    <Trash2 size={13} aria-hidden />
                    {t.profile.deleteAccountCta}
                  </button>
                ) : (
                  <div className="account-delete-confirm">
                    <p className="account-delete-body">{t.profile.deleteAccountConfirmBody}</p>
                    {deleteError && <p className="auth-sheet-error">{deleteError}</p>}
                    <div className="account-delete-row">
                      <button
                        type="button"
                        disabled={busy}
                        className="account-delete-cancel"
                        onClick={() => setConfirmDelete(false)}
                      >
                        {t.profile.deleteAccountCancel}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className="account-delete-confirm-btn"
                        onClick={() => void deleteAccount()}
                      >
                        {t.profile.deleteAccountConfirmAction}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(sheet, document.body);
}

function usesCustomAvatar(user: FirebaseUser | null | undefined): boolean {
  if (!user) return false;
  // Prefer preset once user has chosen any non-default, or always prefer preset over empty photo.
  // If they have a provider photo and never picked, show photo until they open picker.
  try {
    return localStorage.getItem(`match3.avatarPreset.${user.uid}`) != null;
  } catch {
    return false;
  }
}

export function AccountAvatar({
  user,
  presetId,
  size = 'md',
}: {
  user: FirebaseUser | null;
  presetId?: string;
  size?: 'md' | 'lg';
}) {
  const id = user ? presetId ?? getAvatarPresetId(user.uid) : AVATAR_PRESETS[0].id;
  const preset = AVATAR_PRESETS.find((p) => p.id === id) ?? AVATAR_PRESETS[0];
  const custom = usesCustomAvatar(user);
  const photo = user?.photoURL;

  if (photo && !custom) {
    return (
      <div className={cn('account-avatar-face', size === 'lg' && 'account-avatar-face-lg')}>
        <img src={photo} alt="" className="h-full w-full rounded-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn('account-avatar-face', size === 'lg' && 'account-avatar-face-lg')}
      style={{
        background: `linear-gradient(165deg, ${preset.from} 0%, ${preset.to} 100%)`,
      }}
    >
      {user ? (
        <span className="account-avatar-emoji" aria-hidden>
          {preset.emoji}
        </span>
      ) : (
        <User size={size === 'lg' ? 34 : 30} className="text-white drop-shadow-sm" aria-hidden />
      )}
    </div>
  );
}
