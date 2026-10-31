import React from 'react';
import { SolidCard } from './SolidCard';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  isNumeric?: boolean;
  widthClass?: string;
  render: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  mobileCardRender?: (row: T, index: number) => React.ReactNode;
  caption?: string;
  emptyLabel?: string;
  maxHeightClass?: string;
  compact?: boolean;
  fixedLayout?: boolean;
}

/**
 * Apple HIG Solid Surface DataTable
 * - Renders inside a solid surface (`--surface-solid`) with sticky table headers (`--surface-recessed`)
 * - Supports `fixedLayout` (`table-fixed`) so `scrollWidth <= clientWidth` at both 1440px and 1280px
 *   with zero horizontal clipping of primary row actions.
 * - Enforces `tabular-nums` on numeric columns (prices, phone numbers, counts, dates)
 * - Automatically collapses into touch-friendly mobile cards on `< md` when `mobileCardRender` is provided
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  mobileCardRender,
  caption,
  emptyLabel = 'Tidak ada baris data.',
  maxHeightClass = 'max-h-[640px]',
  compact = false,
  fixedLayout = false,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <SolidCard padding="lg" className="text-center">
        <p className="hig-footnote text-[var(--text-secondary)]">{emptyLabel}</p>
      </SolidCard>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card List (< md) when mobileCardRender is provided */}
      {mobileCardRender && (
        <div className="md:hidden space-y-2.5">
          {rows.map((row, idx) => (
            <SolidCard
              key={rowKey(row, idx)}
              padding="sm"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer active:scale-[0.99]' : ''}
            >
              {mobileCardRender(row, idx)}
            </SolidCard>
          ))}
        </div>
      )}

      {/* Desktop & Tablet Table View (Solid surface + sticky header) */}
      <SolidCard
        padding="none"
        className={`${mobileCardRender ? 'hidden md:block' : 'block'} overflow-hidden`}
      >
        <div className={`overflow-x-auto overflow-y-auto ${maxHeightClass}`}>
          <table
            className={`w-full ${
              fixedLayout ? 'table-fixed' : ''
            } border-collapse text-left`}
          >
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className="sticky top-0 z-10 bg-[var(--surface-recessed)] shadow-[0_1px_0_0_var(--border-hairline)]">
              <tr className="bg-[var(--surface-recessed)] border-b border-[var(--border-hairline)]">
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={`sticky top-0 z-10 bg-[var(--surface-recessed)] ${
                        compact ? 'px-2.5 py-2' : 'px-4 py-3'
                      } text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text-secondary)] whitespace-nowrap overflow-hidden text-ellipsis ${alignClass} ${col.widthClass ?? ''}`}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)] bg-[var(--surface-solid)]">
              {rows.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={`hig-transition ${
                    onRowClick
                      ? 'hover:bg-[var(--surface-elevated)] cursor-pointer focus-visible:bg-[var(--accent-tint)] focus-visible:outline-none'
                      : 'hover:bg-[var(--surface-recessed)]/50'
                  }`}
                >
                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';
                    return (
                      <td
                        key={col.key}
                        className={`${
                          compact ? 'px-2.5 py-1.5 text-[13px]' : 'px-4 py-3 text-[14px]'
                        } text-[var(--text-primary)] align-middle overflow-hidden ${alignClass} ${
                          col.isNumeric ? 'tabular-nums' : ''
                        } ${col.widthClass ?? ''}`}
                      >
                        {col.render(row, idx)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SolidCard>
    </div>
  );
}
