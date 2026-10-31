import React, { useState, useEffect, useMemo } from 'react';
import { Search, Store, LayoutGrid, ArrowRight, X } from 'lucide-react';
import { HubId, SegmentId, SpotlightSearchHitDTO } from '../../mock/api';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: SpotlightSearchHitDTO[];
  onSelectTarget: (hubId: HubId, segmentId: SegmentId) => void;
}

/**
 * Global Spotlight Command Palette (`Ctrl+K`)
 * Renders an Apple glassmorphic search bar with solid high-contrast result rows.
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  onSelectTarget,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        }
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.metaRight.toLowerCase().includes(q)
    );
  }, [items, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cari toko atau nomor WhatsApp"
    >
      <div
        className="fixed inset-0 bg-[var(--glass-scrim)] backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl hig-glass-modal rounded-[var(--radius-lg)] overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-hairline)]">
          <Search className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari toko counter, nomor WhatsApp, atau halaman CRM..."
            className="w-full bg-transparent text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Solid Results List for Crisp Legibility */}
        <div className="max-h-80 overflow-y-auto bg-[var(--surface-solid)] divide-y divide-[var(--border-hairline)]">
          {filtered.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="hig-body text-[var(--text-secondary)]">
                Tidak ditemukan toko atau layar untuk &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            filtered.map((hit) => (
              <button
                key={hit.id}
                type="button"
                onClick={() => {
                  onSelectTarget(hit.hubId, hit.segmentId);
                  onClose();
                }}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[var(--surface-elevated)] cursor-pointer hig-transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
                    {hit.type === 'toko' ? (
                      <Store className="w-4 h-4" />
                    ) : (
                      <LayoutGrid className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                      {hit.title}
                    </div>
                    <div className="hig-caption text-[var(--text-secondary)] truncate tabular-nums">
                      {hit.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hig-caption text-[var(--text-tertiary)] tabular-nums">
                    {hit.metaRight}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 flex items-center justify-between text-[12px] text-[var(--text-secondary)] border-t border-[var(--border-hairline)]">
          <span>Pilih hasil untuk membuka halaman</span>
          <span className="tabular-nums">ESC untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
