import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Eye,
  Shield,
  UserCheck,
  LogIn,
  LayoutDashboard,
  AlertTriangle,
  Store,
  MapPin,
  FileText,
  Layers,
} from 'lucide-react';
import { useAppState, VisualDirection } from '../context/AppStateContext';
import { AsyncSimState, UserRole } from '../mock/api';

/**
 * ============================================================================
 * PROTOTYPE-ONLY DEV STATE, ROLE & VISUAL DIRECTION SWITCHER ("Arah A / B / C")
 * ============================================================================
 * Isolated in a single file (`src/dev/PrototypeDevToolbar.tsx`) so it can be
 * cleanly removed in one line when connecting to the production Go backend.
 *
 * Includes the 3 Apple HIG Spatial Visual Directions for "Semua Toko" + AppShell:
 * - Arah A: Mail/Contacts split view (macOS calm translucent split)
 * - Arah B: Liquid glass floating panels (visionOS vivid spatial islands)
 * - Arah C: iOS large-title inset lists (Centered 2-pane grouped lists + bottom dock)
 */
export const PrototypeDevToolbar: React.FC = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
    asyncState,
    setAsyncState,
    simulateErpError,
    setSimulateErpError,
    visualDirection,
    setVisualDirection,
    theme,
    setTheme,
    reducedTransparency,
    setReducedTransparency,
    highContrast,
    setHighContrast,
    activeHub,
    activeSegment,
    navigateTo,
    selectedShopDetailId,
    setSelectedShopDetailId,
    triggerMapTransitionSimulation,
    openUploadMediaWithSample,
  } = useAppState();

  // Start collapsed by default on mobile/tablet (< 768px) so it never overlaps primary controls
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const directionOptions: { id: VisualDirection; shortLabel: string; fullLabel: string }[] = [
    { id: 'A', shortLabel: 'Arah A', fullLabel: 'Arah A · Mail/Contacts' },
    { id: 'B', shortLabel: 'Arah B', fullLabel: 'Arah B · Liquid Glass' },
    { id: 'C', shortLabel: 'Arah C', fullLabel: 'Arah C · iOS Inset' },
  ];

  const handleSelectDirection = (dir: VisualDirection) => {
    setVisualDirection(dir);
    setIsAuthenticated(true);
    if (activeHub !== 'database' || activeSegment === 'peta_toko' || selectedShopDetailId) {
      navigateTo('database', 'semua_toko');
    }
  };

  const asyncOptions: { id: AsyncSimState; label: string }[] = [
    { id: 'success', label: 'Success' },
    { id: 'loading', label: 'Skeleton' },
    { id: 'empty', label: 'Empty' },
    { id: 'error', label: 'Error' },
  ];

  const roleOptions: { id: UserRole; label: string }[] = [
    { id: 'admin', label: 'Admin (Akun 1)' },
    { id: 'sales_crm', label: 'Sales CRM' },
  ];

  const openPrototypeShopVariant = (shopId: string) => {
    setIsAuthenticated(true);
    navigateTo('database', 'semua_toko');
    setSelectedShopDetailId(shopId);
  };

  // Position above mobile tab bar when authenticated, or near bottom-right on login
  const bottomPositionClass = isAuthenticated
    ? 'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-4'
    : 'bottom-3 md:bottom-4';

  if (collapsed) {
    return (
      <div className={`fixed ${bottomPositionClass} right-3 md:right-4 z-40 flex items-center gap-1.5`}>
        {/* Always-accessible Arah A / B / C quick pill even when collapsed */}
        <div
          role="group"
          aria-label="Pilih Arah Visual (A / B / C)"
          className="hig-glass-floating rounded-[var(--radius-sm)] p-1 flex items-center gap-1"
        >
          {directionOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelectDirection(d.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded-[8px] text-[12px] font-semibold cursor-pointer hig-transition hig-focus whitespace-nowrap ${
                visualDirection === d.id
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {d.shortLabel}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="relative hig-glass-floating rounded-[var(--radius-sm)] px-3 py-1.5 min-h-[42px] flex items-center gap-2 text-[12px] font-semibold text-[var(--text-primary)] cursor-pointer hig-transition hig-focus"
          title="Buka panel penguji prototipe"
        >
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] text-[10px] font-bold tracking-wider uppercase">
            PROTOTYPE
          </span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span className="hidden sm:inline">Uji Status & Peran</span>
          <ChevronUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Prototype Only Dev State Switcher"
      className={`fixed ${bottomPositionClass} right-3 md:right-4 z-40 w-[calc(100vw-1.5rem)] sm:w-auto max-w-4xl hig-glass-floating rounded-[var(--radius-md)] p-3 text-[var(--text-primary)]`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 pb-2 mb-2.5 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] text-[10px] font-bold tracking-wider uppercase">
            PROTOTYPE ONLY
          </span>
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">
            Arah Visual (A / B / C) & Dev Switcher
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Sembunyikan panel prototipe"
          className="min-h-[36px] px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-recessed)] flex items-center gap-1 cursor-pointer"
        >
          <span>Sembunyikan</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Controls Grid */}
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        {/* 0. Visual Direction Switcher: Arah A / B / C */}
        <div
          role="group"
          aria-label="Pilih Arah Visual Semua Toko"
          className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-strong)]"
        >
          <span className="px-2 text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1 whitespace-nowrap">
            <Layers className="w-3.5 h-3.5" />
            <span>Desain:</span>
          </span>
          {directionOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelectDirection(d.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded-[6px] font-semibold cursor-pointer hig-transition whitespace-nowrap ${
                visualDirection === d.id
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="sm:hidden">{d.shortLabel}</span>
              <span className="hidden sm:inline">{d.fullLabel}</span>
            </button>
          ))}
        </div>

        {/* 1. Screen Mode: Login vs App Shell */}
        <div className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className={`px-2.5 py-1 rounded-[6px] font-medium flex items-center gap-1.5 cursor-pointer hig-transition ${
              !isAuthenticated
                ? 'bg-[var(--surface-solid)] text-[var(--text-primary)] shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>01-Login</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(true)}
            className={`px-2.5 py-1 rounded-[6px] font-medium flex items-center gap-1.5 cursor-pointer hig-transition ${
              isAuthenticated
                ? 'bg-[var(--surface-solid)] text-[var(--text-primary)] shadow-2xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>App Shell</span>
          </button>
        </div>

        {/* 2. Role Switcher: Admin vs Sales CRM */}
        <div className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-hairline)]">
          {roleOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`px-2.5 py-1 rounded-[6px] font-medium flex items-center gap-1.5 cursor-pointer hig-transition ${
                role === r.id
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {r.id === 'admin' ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Go API Async State Switcher + RG ERP POST Failure Toggle */}
        <div className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-hairline)]">
          {asyncOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAsyncState(opt.id)}
              className={`px-2 py-1 rounded-[6px] font-medium cursor-pointer hig-transition ${
                asyncState === opt.id
                  ? 'bg-[var(--surface-solid)] text-[var(--accent-primary)] font-semibold shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSimulateErpError(!simulateErpError)}
            title="Simulasikan kegagalan endpoint RG ERP / Upload Media"
            className={`px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 cursor-pointer hig-transition ${
              simulateErpError
                ? 'bg-[var(--status-danger-fill)] text-white font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Gagal ERP</span>
          </button>
        </div>

        {/* 4. Theme & Accessibility Toggles */}
        <div className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-2.5 py-1 rounded-[6px] font-medium bg-[var(--surface-solid)] text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
            title="Ubah tema Terang / Gelap"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Gelap</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setReducedTransparency(!reducedTransparency)}
            className={`px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 cursor-pointer hig-transition ${
              reducedTransparency
                ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Uji prefers-reduced-transparency (Material Solid)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Opaque</span>
          </button>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2 py-1 rounded-[6px] font-medium cursor-pointer hig-transition ${
              highContrast
                ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Uji prefers-contrast: more (Kontras Tinggi)"
          >
            <span>Kontras+</span>
          </button>
        </div>

        {/* 5. Stage 3a Prototype Scenario Shortcuts */}
        <div className="flex items-center gap-1 bg-[var(--surface-recessed)] p-1 rounded-[var(--radius-xs)] border border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => openPrototypeShopVariant('db-shop-138821')}
            className={`px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 cursor-pointer hig-transition ${
              selectedShopDetailId === 'db-shop-138821'
                ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Buka Detail Toko #138821 (19-detail-toko — belum dikontak)"
          >
            <Store className="w-3 h-3" />
            <span>Detail #138821</span>
          </button>
          <button
            type="button"
            onClick={() => openPrototypeShopVariant('db-shop-1')}
            className={`px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 cursor-pointer hig-transition ${
              selectedShopDetailId === 'db-shop-1'
                ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Buka Detail Toko #1 (19b-detail-toko-chat — dengan riwayat chat)"
          >
            <Store className="w-3 h-3" />
            <span>Detail #1</span>
          </button>
          <button
            type="button"
            onClick={triggerMapTransitionSimulation}
            className="px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer hig-transition"
            title="Simulasikan transisi peta provinsi (10b-peta-transisi)"
          >
            <MapPin className="w-3 h-3" />
            <span>Transisi Peta (10b)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(true);
              navigateTo('katalog', 'media_promosi');
              openUploadMediaWithSample();
            }}
            className="px-2 py-1 rounded-[6px] font-medium flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer hig-transition"
            title="Uji dialog d05 Unggah Media dengan contoh berkas katalog PDF"
          >
            <FileText className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Contoh PDF (d05)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
