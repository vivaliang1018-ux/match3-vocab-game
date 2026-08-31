import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');
const DIALOG_SELECTOR = '[role="dialog"], [role="alertdialog"]';

let bodyLockCount = 0;
let rootLockCount = 0;
let previousBodyOverflow = '';
let previousRootAriaHidden: string | null = null;
let previousRootInert = false;
let lastBackgroundFocus: HTMLElement | null = null;

function lockBackground(dialog: HTMLElement | null) {
  const root = document.getElementById('root');
  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount += 1;

  const shouldLockRoot = Boolean(root && dialog && !root.contains(dialog));
  if (shouldLockRoot && rootLockCount === 0) {
    previousRootAriaHidden = root?.getAttribute('aria-hidden') ?? null;
    previousRootInert = root?.inert ?? false;
    root?.setAttribute('aria-hidden', 'true');
    if (root) root.inert = true;
  }
  if (shouldLockRoot) rootLockCount += 1;
  return shouldLockRoot;
}

function unlockBackground(lockedRoot: boolean) {
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) document.body.style.overflow = previousBodyOverflow;

  if (!lockedRoot) return;
  rootLockCount = Math.max(0, rootLockCount - 1);
  if (rootLockCount !== 0) return;

  const root = document.getElementById('root');
  if (root) {
    if (previousRootAriaHidden === null) root.removeAttribute('aria-hidden');
    else root.setAttribute('aria-hidden', previousRootAriaHidden);
    root.inert = previousRootInert;
  }
}

function visibleFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

type UseModalDialogOptions = {
  open: boolean;
  onClose?: () => void;
  closeOnEscape?: boolean;
};

/** Shared modal behavior: background lock, initial focus, focus trap and focus return. */
export function useModalDialog({
  open,
  onClose,
  closeOnEscape = true,
}: UseModalDialogOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const activeElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const activeInsideDialog = activeElement?.closest(DIALOG_SELECTOR) !== null;
    if (activeElement && !activeInsideDialog) lastBackgroundFocus = activeElement;
    const previouslyFocused = activeInsideDialog ? lastBackgroundFocus : activeElement;
    const dialogElement = dialogRef.current;
    const lockedRoot = lockBackground(dialogElement);

    const focusFrame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const preferred = dialog.querySelector<HTMLElement>('[data-modal-initial-focus]');
      const firstFocusable = visibleFocusableElements(dialog)[0];
      (preferred ?? firstFocusable ?? dialog).focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (event.key === 'Escape' && closeOnEscape && onCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = visibleFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown, true);
      unlockBackground(lockedRoot);
      if (previouslyFocused?.isConnected) {
        window.requestAnimationFrame(() => {
          const anotherDialogIsOpen = Array.from(
            document.querySelectorAll<HTMLElement>(DIALOG_SELECTOR),
          ).some((dialog) => dialog !== dialogElement);
          if (!anotherDialogIsOpen) previouslyFocused.focus({ preventScroll: true });
        });
      }
    };
  }, [closeOnEscape, open]);

  return dialogRef;
}
