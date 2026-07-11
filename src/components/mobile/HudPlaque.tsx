import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type HudPlaqueProps = {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
  fullWidth?: boolean;
};

export function HudPlaque({ label, value, className, valueClassName, fullWidth }: HudPlaqueProps) {
  return (
    <div className={cn('relative overflow-visible', fullWidth && 'w-full', className)}>
      <div className="app-hud-plaque-label">{label}</div>
      <div className={cn('app-hud-plaque-panel overflow-visible', fullWidth && 'w-full')}>
        <div className={cn('relative overflow-visible', valueClassName)}>{value}</div>
      </div>
    </div>
  );
}

export function HudStatNumber({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('app-hud-stat-number', className)}>
      {children}
    </span>
  );
}
