import React from 'react';

export interface GlassChromeProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'header' | 'aside' | 'nav' | 'section' | 'footer' | 'article';
  variant?: 'chrome' | 'sidebar' | 'toolbar' | 'list' | 'inspector' | 'well' | 'modal' | 'popover';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  specularTopLeft?: boolean;
}

const RADIUS_MAP: Record<NonNullable<GlassChromeProps['radius']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
  xl: 'rounded-[var(--radius-xl)]',
};

const POSITION_CLASS_REGEX = /\b(fixed|sticky|absolute|relative|static)\b/;

/**
 * Apple HIG Spatial Translucent Glass Surface
 *
 * Positioning classes passed by callers (`fixed`, `sticky`, `absolute`, etc.) always win:
 * `relative` is only added as a default when `className` does not already set a position.
 * Real 1px top-left specular gradient edge is rendered via `::before` pseudo-element.
 */
export const GlassChrome: React.FC<GlassChromeProps> = ({
  as: Component = 'div',
  variant = 'chrome',
  radius = 'none',
  specularTopLeft = true,
  className = '',
  children,
  ...rest
}) => {
  const materialClass =
    variant === 'sidebar'
      ? 'hig-glass-sidebar'
      : variant === 'list'
        ? 'hig-glass-list'
        : variant === 'inspector'
          ? 'hig-glass-inspector'
          : variant === 'well'
            ? 'hig-glass-well'
            : variant === 'modal'
              ? 'hig-glass-modal'
              : variant === 'popover'
                ? 'hig-glass-floating'
                : 'hig-glass-chrome';

  // Only default to `relative` if caller did not pass a positioning utility (`fixed`, `sticky`, etc.)
  const positionClass = POSITION_CLASS_REGEX.test(className) ? '' : 'relative';
  const specularClass = specularTopLeft ? '' : 'hig-no-specular';

  return (
    <Component
      className={`${positionClass} ${materialClass} ${specularClass} ${RADIUS_MAP[radius]} hig-transition ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
};
