import React, { useEffect, useRef } from 'react';

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  count?: number;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (nextValue: T) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Apple HIG Segmented Control — Level 2 navigation (`Hub > Segment`).
 * Enforces single-line labels, tabular numerals for counts, 44px touch target height,
 * and automatic horizontal scrolling of the active segment into view on mobile.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = containerRef.current;
    const activeTab = tabRefs.current[value];
    if (!container || !activeTab) return;

    // Auto-scroll active segment horizontally into center of the SegmentedControl bar
    const targetLeft =
      activeTab.offsetLeft - container.clientWidth / 2 + activeTab.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] overflow-x-auto max-w-full ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            ref={(el) => {
              tabRefs.current[option.id] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.id)}
            className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer select-none hig-transition hig-focus inline-flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs border border-transparent'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            <span>{option.label}</span>
            {typeof option.count === 'number' && (
              <span
                className={`text-[12px] tabular-nums ${
                  isSelected ? 'text-white font-bold' : 'text-[var(--text-tertiary)]'
                }`}
              >
                ({option.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
