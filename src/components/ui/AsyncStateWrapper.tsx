import React from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { AsyncSimState } from '../../mock/api';
import { Button } from './Button';
import { SolidCard } from './SolidCard';

export interface AsyncStateWrapperProps {
  state: AsyncSimState;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  onRetry?: () => void;
  skeletonRows?: number;
  children: React.ReactNode;
}

/**
 * Standardized Go Backend Async State Boundary:
 * Renders Loading (Skeleton), Empty, Error, and Success states for every view.
 */
export const AsyncStateWrapper: React.FC<AsyncStateWrapperProps> = ({
  state,
  emptyTitle = 'Belum ada data tercatat',
  emptyDescription = 'Data akan tampil secara otomatis setelah sinkronisasi atau penambahan data baru.',
  emptyActionLabel,
  onEmptyAction,
  errorMessage = 'Gagal memuat data dari server Go API (:8080). Silakan coba muat ulang.',
  onRetry,
  skeletonRows = 4,
  children,
}) => {
  if (state === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Memuat data..."
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((item) => (
            <SolidCard key={item} padding="md" className="space-y-3">
              <div className="h-3.5 w-28 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
              <div className="h-7 w-20 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
              <div className="h-3 w-36 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
            </SolidCard>
          ))}
        </div>

        <SolidCard padding="md" className="space-y-3">
          <div className="h-5 w-48 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse mb-4" />
          {Array.from({ length: skeletonRows }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 py-3 border-t border-[var(--border-hairline)]"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 w-44 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
                <div className="h-3 w-64 max-w-full rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
              </div>
              <div className="h-8 w-24 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse shrink-0" />
            </div>
          ))}
        </SolidCard>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <SolidCard padding="lg" className="my-4">
        <div className="max-w-md mx-auto text-center py-6 space-y-3">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] text-[var(--status-danger)] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="hig-headline text-[var(--text-primary)]">
            Gangguan Sambungan Layanan
          </h3>
          <p className="hig-footnote text-[var(--text-secondary)]">{errorMessage}</p>
          {onRetry && (
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={onRetry}
              >
                Muat Ulang Data
              </Button>
            </div>
          )}
        </div>
      </SolidCard>
    );
  }

  if (state === 'empty') {
    return (
      <SolidCard padding="lg" className="my-4">
        <div className="max-w-md mx-auto text-center py-8 space-y-3">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[var(--text-secondary)] flex items-center justify-center mx-auto">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="hig-headline text-[var(--text-primary)]">{emptyTitle}</h3>
          <p className="hig-footnote text-[var(--text-secondary)]">{emptyDescription}</p>
          {emptyActionLabel && onEmptyAction && (
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={onEmptyAction}>
                {emptyActionLabel}
              </Button>
            </div>
          )}
        </div>
      </SolidCard>
    );
  }

  return <>{children}</>;
};
