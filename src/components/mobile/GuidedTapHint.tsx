import {
  useLayoutEffect,
  useState,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';

type Point = { x: number; y: number };

type GuidedTapHintProps = {
  visible: boolean;
  targetRef: RefObject<HTMLElement | null>;
  sourceRef?: RefObject<HTMLElement | null>;
  mode?: 'tap' | 'drag';
  fingerOffset?: Point;
};

type HintGeometry = {
  target: DOMRect;
  source: DOMRect | null;
};

/**
 * One shared, hit-test-transparent gesture layer for tab, mode, and board hints.
 * Geometry always comes from the live target elements rather than screen constants.
 */
export function GuidedTapHint({
  visible,
  targetRef,
  sourceRef,
  mode = 'tap',
  fingerOffset = { x: 24, y: 34 },
}: GuidedTapHintProps) {
  const [geometry, setGeometry] = useState<HintGeometry | null>(null);

  useLayoutEffect(() => {
    if (!visible) {
      setGeometry(null);
      return;
    }

    const update = () => {
      const target = targetRef.current;
      const source = sourceRef?.current ?? null;
      if (!target || (mode === 'drag' && !source)) {
        setGeometry(null);
        return;
      }
      setGeometry({
        target: target.getBoundingClientRect(),
        source: source?.getBoundingClientRect() ?? null,
      });
    };

    update();
    const startedAt = performance.now();
    let layoutFrame = 0;
    const followOpeningLayout = (now: number) => {
      update();
      if (now - startedAt < 800) {
        layoutFrame = window.requestAnimationFrame(followOpeningLayout);
      }
    };
    layoutFrame = window.requestAnimationFrame(followOpeningLayout);
    const observer = new ResizeObserver(update);
    if (targetRef.current) observer.observe(targetRef.current);
    if (sourceRef?.current) observer.observe(sourceRef.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      window.cancelAnimationFrame(layoutFrame);
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, [mode, sourceRef, targetRef, visible]);

  if (!visible || !geometry || typeof document === 'undefined') return null;

  const targetCenter = {
    x: geometry.target.left + geometry.target.width / 2,
    y: geometry.target.top + geometry.target.height / 2,
  };
  const sourceCenter = geometry.source
    ? {
        x: geometry.source.left + geometry.source.width / 2,
        y: geometry.source.top + geometry.source.height / 2,
      }
    : null;
  const start =
    mode === 'drag' && sourceCenter
      ? sourceCenter
      : {
          x: targetCenter.x + fingerOffset.x,
          y: targetCenter.y + fingerOffset.y,
        };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[260]" aria-hidden>
      <motion.div
        className="fixed rounded-[22px] border-2 border-amber-300/90 bg-amber-200/10 shadow-[0_0_20px_rgba(251,191,36,0.7)]"
        style={{
          left: geometry.target.left - 4,
          top: geometry.target.top - 4,
          width: geometry.target.width + 8,
          height: geometry.target.height + 8,
        }}
        animate={{ scale: [1, 1.055, 1, 1], opacity: [0.35, 0.9, 0.42, 0.35] }}
        transition={{ duration: 1.95, times: [0, 0.18, 0.38, 1], repeat: Infinity }}
      />

      {mode === 'drag' && geometry.source ? (
        <motion.div
          className="fixed rounded-full border-2 border-sky-300/90 bg-sky-200/10 shadow-[0_0_18px_rgba(56,189,248,0.68)]"
          style={{
            left: geometry.source.left - 4,
            top: geometry.source.top - 4,
            width: geometry.source.width + 8,
            height: geometry.source.height + 8,
          }}
          animate={{ scale: [1, 1.075, 1], opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 1.95, repeat: Infinity }}
        />
      ) : null}

      <motion.div
        key={`${mode}:${Math.round(start.x)}:${Math.round(start.y)}:${Math.round(targetCenter.x)}:${Math.round(targetCenter.y)}`}
        className="fixed left-0 top-0 text-[34px] leading-none drop-shadow-[0_4px_5px_rgba(15,23,42,0.38)]"
        style={{ x: start.x - 12, y: start.y - 8, transformOrigin: '10px 4px' }}
        animate={{
          x:
            mode === 'drag'
              ? [
                  start.x - 12,
                  start.x - 12,
                  start.x - 12,
                  targetCenter.x - 12,
                  targetCenter.x - 12,
                ]
              : [start.x - 12, start.x - 12, targetCenter.x - 12, targetCenter.x - 12],
          y:
            mode === 'drag'
              ? [
                  start.y - 8,
                  start.y - 8,
                  start.y - 8,
                  targetCenter.y - 8,
                  targetCenter.y - 8,
                ]
              : [start.y - 8, start.y - 8, targetCenter.y - 8, targetCenter.y - 8],
          opacity: mode === 'drag' ? [0, 1, 1, 1, 0] : [0, 1, 1, 0],
          scale:
            mode === 'tap'
              ? [1, 1, 0.82, 0.9]
              : [0.92, 1, 1, 0.88, 0.92],
        }}
        transition={{
          duration: mode === 'drag' ? 2.35 : 1.95,
          times:
            mode === 'tap'
              ? [0, 0.24, 0.52, 0.7]
              : [0, 0.1, 0.38, 0.8, 0.9],
          repeat: Infinity,
          repeatDelay: mode === 'drag' ? 0.45 : 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        👆
      </motion.div>
    </div>,
    document.body,
  );
}
