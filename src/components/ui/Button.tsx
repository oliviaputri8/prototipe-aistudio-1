import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'destructive-outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Apple HIG Button with guaranteed 44x44px minimum touch target area on mobile,
 * verified 5.42:1 primary contrast (#0066D6 with #FFFFFF label), and crisp focus ring.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) => {
  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[var(--accent-fill)] hover:bg-[var(--accent-fill-hover)] text-[var(--accent-on-fill)] border border-transparent shadow-xs',
    secondary:
      'bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)]',
    destructive:
      'bg-[var(--status-danger-fill)] hover:opacity-92 text-white border border-transparent shadow-xs',
    'destructive-outline':
      'bg-[var(--status-danger-bg)] hover:opacity-90 text-[var(--status-danger)] border border-[var(--status-danger-border)]',
    ghost:
      'bg-transparent hover:bg-[var(--accent-tint)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent',
  };

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    xs: 'min-h-[44px] min-w-[44px] md:min-h-[32px] px-3 md:px-2.5 py-2 md:py-1 text-[13px] md:text-[12px] font-semibold rounded-[var(--radius-xs)] gap-1.5',
    sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-[13px] font-medium rounded-[var(--radius-xs)] gap-1.5',
    md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-[14px] font-semibold rounded-[var(--radius-sm)] gap-2',
    lg: 'min-h-[48px] min-w-[44px] px-5 py-3 text-[15px] font-semibold rounded-[var(--radius-sm)] gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 select-none cursor-pointer active:scale-[0.98] hig-transition hig-focus disabled:opacity-45 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  badgeDot?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  active = false,
  badgeDot = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-[var(--radius-sm)] cursor-pointer select-none active:scale-[0.96] hig-transition hig-focus ${
        active
          ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-recessed)]'
      } ${className}`}
      {...rest}
    >
      {children}
      {badgeDot && (
        <span
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--status-danger)] ring-2 ring-[var(--surface-solid)]"
        />
      )}
    </button>
  );
};
