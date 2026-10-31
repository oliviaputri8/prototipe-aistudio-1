import React from 'react';

export interface SolidCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'solid' | 'elevated' | 'recessed';
  radius?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PADDING_MAP: Record<NonNullable<SolidCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3.5',
  md: 'p-5',
  lg: 'p-6',
};

const RADIUS_MAP: Record<NonNullable<SolidCardProps['radius']>, string> = {
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
};

/**
 * Solid or near-solid content container for high-density data tables, chat threads,
 * forms, and KPI cards. Never uses backdrop blur so text contrast stays >= 4.5:1.
 */
export const SolidCard: React.FC<SolidCardProps> = ({
  elevation = 'solid',
  radius = 'md',
  padding = 'md',
  className = '',
  children,
  ...rest
}) => {
  const surfaceBg =
    elevation === 'elevated'
      ? 'bg-[var(--surface-elevated)]'
      : elevation === 'recessed'
        ? 'bg-[var(--surface-recessed)]'
        : 'bg-[var(--surface-solid)]';

  return (
    <div
      className={`${surfaceBg} ${RADIUS_MAP[radius]} ${PADDING_MAP[padding]} border border-[var(--border-hairline)] shadow-[var(--shadow-card)] hig-transition ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  metaText?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  metaText,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-hairline)]">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2 className="hig-headline text-[var(--text-primary)] truncate">{title}</h2>
          {metaText && (
            <span className="hig-caption text-[var(--text-tertiary)] tabular-nums">
              · {metaText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="hig-footnote text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
};
