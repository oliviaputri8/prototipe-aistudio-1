import React, { useState } from 'react';
import { ShieldCheck, Terminal, CheckCircle2, Lock } from 'lucide-react';
import { AsyncSimState, LoginConfigDTO, UserRole } from '../../mock/api';
import { Button } from '../ui/Button';
import { SolidCard } from '../ui/SolidCard';
import { AsyncStateWrapper } from '../ui/AsyncStateWrapper';

export interface LoginViewProps {
  config: LoginConfigDTO;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onAuthenticate: (role: UserRole) => void;
  asyncState: AsyncSimState;
  onRetry: () => void;
}

/**
 * Screen `01-login`: Olivia CRM Authentication Gateway
 * - Uses Apple HIG spatial ambient canvas + translucent glass outer frame + solid high-contrast inner form surface
 * - Uses single system accent color (`--accent-fill`) on the brand emblem
 * - Keeps all controls cleanly contained inside the card on both desktop (1440px) and mobile (390px)
 */
export const LoginView: React.FC<LoginViewProps> = ({
  config,
  selectedRole,
  onSelectRole,
  onAuthenticate,
  asyncState,
  onRetry,
}) => {
  const [showDevRolePicker, setShowDevRolePicker] = useState(false);

  return (
    <main className="min-h-screen w-full hig-ambient-canvas flex flex-col items-center justify-center p-4 pb-20 sm:p-6">
      <div className="w-full max-w-md">
        <AsyncStateWrapper
          state={asyncState}
          emptyTitle="Tidak ada akun operator terdaftar"
          emptyDescription="Hubungi Pemilik (Master Akun 1) untuk mendaftarkan alamat email Google Anda ke dalam daftar putih (whitelist)."
          onRetry={onRetry}
          skeletonRows={2}
        >
          {/* Outer Translucent Glass Frame (`--radius-lg`: 22px) */}
          <div className="relative hig-glass-chrome rounded-[var(--radius-lg)] p-2.5 sm:p-3">
            {/* Inner Solid Surface Card (`--radius-md`: 16px, nested smaller radius) */}
            <SolidCard radius="md" padding="lg" className="space-y-6">
              {/* Brand Emblem (Single System Accent Color `--accent-fill`) & Title */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--accent-fill)] flex items-center justify-center mx-auto shadow-xs">
                  <div className="flex items-end gap-1" aria-hidden="true">
                    <span className="w-1.5 h-4 rounded-full bg-white/85" />
                    <span className="w-1.5 h-6 rounded-full bg-white" />
                    <span className="w-1.5 h-5 rounded-full bg-white/90" />
                    <span className="w-1.5 h-3.5 rounded-full bg-white/75" />
                  </div>
                </div>
                <h1 className="hig-title text-[var(--text-primary)] pt-1">{config.appName}</h1>
                <p className="hig-footnote text-[var(--text-secondary)]">{config.appTagline}</p>
              </div>

              {/* Primary Action: Masuk dengan Google */}
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => onAuthenticate(selectedRole)}
                  leftIcon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                  }
                >
                  {config.googleButtonLabel}
                </Button>

                {/* Whitelist Security Footnote */}
                <div className="flex items-start gap-2 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
                  <Lock className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                  <p className="hig-caption text-[var(--text-secondary)]">
                    {config.whitelistNotice}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[var(--border-hairline)]" />
                <span className="px-3 bg-[var(--surface-solid)] hig-caption text-[var(--text-tertiary)] uppercase tracking-wider shrink-0">
                  Akses Cepat
                </span>
                <div className="w-full border-t border-[var(--border-hairline)]" />
              </div>

              {/* Developer Mode Login & Role Selection (Stacked cleanly inside card) */}
              <div className="space-y-2.5">
                {showDevRolePicker && (
                  <div className="space-y-2 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
                    <div className="hig-caption font-semibold text-[var(--text-secondary)]">
                      Pilih sesi operator untuk simulasi:
                    </div>
                    {config.availableOperators.map((op) => {
                      const active = op.role === selectedRole;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => onSelectRole(op.role)}
                          className={`w-full p-2.5 rounded-[var(--radius-xs)] text-left flex items-start justify-between gap-2 border cursor-pointer hig-transition ${
                            active
                              ? 'bg-[var(--surface-solid)] border-[var(--accent-primary)] shadow-2xs'
                              : 'bg-transparent border-transparent hover:bg-[var(--surface-solid)]/60'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5 flex-wrap">
                              <span>{op.fullName}</span>
                              <span className="text-[11px] px-1.5 py-0.5 rounded-[4px] bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold">
                                {op.roleBadgeLabel}
                              </span>
                            </div>
                            <div className="hig-caption text-[var(--text-secondary)] truncate tabular-nums mt-0.5">
                              {op.email} · {op.assignedWaSession}
                            </div>
                            <div className="hig-caption text-[var(--text-tertiary)] mt-0.5">
                              {op.accessScopeLabel}
                            </div>
                          </div>
                          {active && (
                            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    leftIcon={<Terminal className="w-4 h-4" />}
                    onClick={() => onAuthenticate(selectedRole)}
                  >
                    {config.devModeButtonLabel}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => setShowDevRolePicker((prev) => !prev)}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    {showDevRolePicker
                      ? 'Sembunyikan Pilihan Peran'
                      : `Pilih Peran Sesi (${selectedRole === 'admin' ? 'Admin Akun 1' : 'Sales CRM'})`}
                  </Button>
                </div>
              </div>
            </SolidCard>
          </div>
        </AsyncStateWrapper>
      </div>
    </main>
  );
};
