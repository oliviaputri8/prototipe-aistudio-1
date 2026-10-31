import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Check,
  Settings,
  User,
  Bot,
  Send,
  ClipboardList,
  Paperclip,
  ShieldAlert,
  ExternalLink,
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle2,
  Brain,
  Ban,
} from 'lucide-react';
import {
  HubId,
  HunterInboxWorkspaceDTO,
  InboxFilterTab,
  InboxLeadThreadDTO,
  SegmentId,
  UserRole,
} from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button, IconButton } from '../ui/Button';
import { ModalSheet } from '../ui/ModalSheet';

export interface HunterInboxViewProps {
  workspace: HunterInboxWorkspaceDTO;
  role: UserRole;
  selectedThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, messageBody: string) => void;
  onToggleThreadHandler: (threadId: string) => void;
  onMarkDisqualified: (threadId: string) => void;
  onOpenHandoverModal: (lead: InboxLeadThreadDTO) => void;
  onNavigate: (hub: HubId, segment: SegmentId) => void;
}

function formatReadablePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62') && digits.length >= 11) {
    return `+62 ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
  }
  return raw;
}

/**
 * Screens `18-inbox` & `18b-inbox-lead`: Hunter Chat / Inbox Workspace
 * - Desktop (`lg:` 1440x900): Fits 100dvh minus the 64px app header with zero page scroll (`documentHeight === viewportHeight`).
 *   Compact single-row workspace header + 3 internally scrolling panes (Thread List, Solid Chat Canvas, Lead Inspector).
 * - Mobile (`< lg` 390x844):
 *   - Master screen: Thread list with session selector, search, and wrapping filter pills (`Semua`, `Eskalasi`, `Sales`, `AI`).
 *   - Detail screen (open chat): Full-screen chat ONLY (compact bar with Back, Contact Name, and `Profil & ERP` button +
 *     solid chat transcript + glass composer sitting strictly above the fixed 64px mobile tab bar with `Kirim Pesan` visible).
 */
export const HunterInboxView: React.FC<HunterInboxViewProps> = ({
  workspace,
  role,
  selectedThreadId,
  onSelectThread,
  onSendMessage,
  onToggleThreadHandler,
  onMarkDisqualified,
  onOpenHandoverModal,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<InboxFilterTab>('semua');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [composerText, setComposerText] = useState<string>('');

  // Composer quick-insert popover state ('spintax' | 'price' | 'media' | null)
  const [activeComposerMenu, setActiveComposerMenu] = useState<
    'spintax' | 'price' | 'media' | null
  >(null);

  // Mobile master-detail & Lead Inspector bottom sheet states
  const [mobileDetailOpen, setMobileDetailOpen] = useState<boolean>(false);
  const [mobileInspectorSheetOpen, setMobileInspectorSheetOpen] = useState<boolean>(false);

  // Interactive feedback states inside Lead Inspector
  const [duplicateCheckedMap, setDuplicateCheckedMap] = useState<Record<string, boolean>>({});
  const [expandedMemoryLayers, setExpandedMemoryLayers] = useState<boolean>(false);
  const [disqualifiedBannerMap, setDisqualifiedBannerMap] = useState<Record<string, boolean>>({});

  // Filter counts
  const filterCounts = useMemo(() => {
    const bySession = workspace.threads.filter((t) =>
      selectedSession === 'all' ? true : t.waSessionId === selectedSession
    );
    return {
      semua: bySession.length,
      eskalasi: bySession.filter((t) => t.filterCategory === 'eskalasi').length,
      sales: bySession.filter((t) => t.filterCategory === 'sales').length,
      ai: bySession.filter((t) => t.filterCategory === 'ai').length,
    };
  }, [workspace.threads, selectedSession]);

  // Filtered thread list
  const filteredThreads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workspace.threads.filter((t) => {
      if (selectedSession !== 'all' && t.waSessionId !== selectedSession) return false;
      if (activeFilter !== 'semua' && t.filterCategory !== activeFilter) return false;
      if (!q) return true;
      return (
        t.shopName.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.whatsappNumber.includes(q) ||
        t.lastMessagePreview.toLowerCase().includes(q)
      );
    });
  }, [workspace.threads, selectedSession, activeFilter, searchQuery]);

  const activeThread: InboxLeadThreadDTO | undefined =
    workspace.threads.find((t) => t.id === selectedThreadId) ?? filteredThreads[0];

  const handleSend = () => {
    if (!activeThread || !composerText.trim()) return;
    onSendMessage(activeThread.id, composerText.trim());
    setComposerText('');
    setActiveComposerMenu(null);
  };

  /* ========================================================================
   * REUSABLE LEAD INSPECTOR CONTENT (Used in Right Desktop Pane & Mobile Sheet)
   * ======================================================================== */
  const renderLeadInspectorContent = (lead: InboxLeadThreadDTO) => {
    const hasCheckedDuplicate = duplicateCheckedMap[lead.id];
    const isMarkedNonTarget = disqualifiedBannerMap[lead.id];

    return (
      <div className="space-y-4">
        {/* 1. Shop Identity & Priority Score Card */}
        <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-center space-y-2">
          <div className="w-11 h-11 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] font-bold text-[16px] flex items-center justify-center mx-auto">
            {lead.avatarInitial}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{lead.shopName}</h3>
            <p className="hig-caption text-[var(--text-secondary)]">
              {lead.city}, {lead.province}
            </p>
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
              {lead.funnelStageBadge.split(' ')[0]} {lead.funnelStageBadge.split(' ')[1]}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-tint)] text-[var(--accent-primary)] tabular-nums">
              Skor Prioritas: {lead.priorityScore}
            </span>
          </div>
        </div>

        {/* 2. Primary Handover CTA + Mobile Handler Toggle + Duplicate Check */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<Check className="w-4 h-4" />}
            onClick={() => {
              setMobileInspectorSheetOpen(false);
              onOpenHandoverModal(lead);
            }}
          >
            Ajukan Reseller ke RG ERP
          </Button>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="lg:hidden"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[var(--status-success)]" />}
            onClick={() => onToggleThreadHandler(lead.id)}
          >
            {lead.handlerBadgeLabel === 'Dijawab AI' ? 'Ambil Alih Manual' : 'Serahkan ke AI'}
          </Button>

          <button
            type="button"
            onClick={() =>
              setDuplicateCheckedMap((prev) => ({ ...prev, [lead.id]: true }))
            }
            className="w-full min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-recessed)] text-left flex items-center justify-between cursor-pointer hig-transition"
          >
            <span>Cek Duplikasi Nomor di RG ERP</span>
            {hasCheckedDuplicate && (
              <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0" />
            )}
          </button>

          {hasCheckedDuplicate && (
            <div className="p-2.5 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[12px] text-[var(--status-success)]">
              <div className="font-semibold">{lead.erpDuplicateCheck.statusMessage}</div>
              <div className="text-[11px] opacity-85 tabular-nums mt-0.5">
                Dicek pada: {lead.erpDuplicateCheck.checkedAtWib}
              </div>
            </div>
          )}
        </div>

        {/* 3. INFORMASI KONTAK */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
            INFORMASI KONTAK
          </div>
          <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-2 text-[13px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--text-secondary)]">Nomor HP</span>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                +{lead.whatsappNumber}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">Sesi Pengelola</span>
              <span className="font-semibold text-[var(--accent-primary)] text-right tabular-nums">
                {lead.waSessionLabel}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--text-secondary)]">Status Siklus</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {lead.cycleStatusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 4. MEMORI KOGNITIF AI */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
            MEMORI KOGNITIF AI
          </div>

          <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--accent-tint)] border border-[var(--border-hairline)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent-primary)]">
              <Brain className="w-4 h-4 shrink-0" />
              <span>Preferensi & Riwayat Interaksi</span>
            </div>
            <div className="text-[12px] text-[var(--text-primary)] font-medium">
              Funnel: {lead.cognitiveMemory.funnelStageCode} | PIC: {lead.cognitiveMemory.picName}
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {lead.cognitiveMemory.conversationSummary}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setExpandedMemoryLayers((prev) => !prev)}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[12px] font-semibold text-[var(--text-primary)] flex items-center justify-center gap-1.5 cursor-pointer hig-transition"
          >
            <span>Buka Detail Toko & 7 Lapisan</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </button>

          {expandedMemoryLayers && (
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-2 text-[12px]">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">1. Identitas: </span>
                <span className="text-[var(--text-secondary)]">
                  {lead.shopName} (#{lead.leadIdNumber})
                </span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)]">2. Profil Counter: </span>
                <span className="text-[var(--text-secondary)]">
                  {lead.cognitiveMemory.counterProfile}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)]">3. Seri Incaran: </span>
                <span className="text-[var(--text-secondary)]">
                  {lead.cognitiveMemory.preferredSeries}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)]">4. Budget Range: </span>
                <span className="text-[var(--text-secondary)] tabular-nums">
                  {lead.cognitiveMemory.budgetRange}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)]">5. Pantangan: </span>
                <span className="text-[var(--text-secondary)]">
                  {lead.cognitiveMemory.tabooNotes}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)]">6. Riwayat Deal: </span>
                <span className="text-[var(--text-secondary)]">
                  {lead.cognitiveMemory.dealHistorySummary}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Bukan Target Action */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => {
              setDisqualifiedBannerMap((prev) => ({ ...prev, [lead.id]: !prev[lead.id] }));
              onMarkDisqualified(lead.id);
            }}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--status-danger)] hover:bg-[var(--status-danger-bg)] text-left flex items-center justify-between cursor-pointer hig-transition"
          >
            <span>Bukan target</span>
            <Ban className="w-4 h-4" />
          </button>

          {isMarkedNonTarget && (
            <div className="mt-1.5 p-2.5 rounded-[var(--radius-xs)] bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] text-[12px] text-[var(--status-danger)]">
              Toko ini ditandai sebagai Bukan Target dan dikecualikan dari antrean follow-up.
            </div>
          )}
        </div>

        {/* 6. Batas Sistem Olivia 1.2 SDR Callout */}
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)] space-y-1">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--status-warning)]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{workspace.systemBoundaryCard.title}</span>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            {workspace.systemBoundaryCard.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2.5 h-full">
      {/* ====================================================================
       * DESKTOP COMPACT SINGLE-ROW WORKSPACE BAR (Hidden on < lg so mobile chat is full-screen)
       * ==================================================================== */}
      <SolidCard
        padding="none"
        className="hidden lg:flex items-center justify-between gap-3 px-3.5 py-1.5 shrink-0"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[14px] font-bold text-[var(--text-primary)] whitespace-nowrap pr-1">
            {workspace.workspaceTitle}
          </span>

          {activeThread && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="!min-h-[36px] !py-1 !px-3"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[var(--status-success)]" />}
                onClick={() => onToggleThreadHandler(activeThread.id)}
              >
                {activeThread.handlerBadgeLabel === 'Dijawab AI'
                  ? 'Ambil Alih Manual'
                  : 'Serahkan ke AI'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="!min-h-[36px] !py-1 !px-3"
                leftIcon={<Check className="w-3.5 h-3.5" />}
                onClick={() => onOpenHandoverModal(activeThread)}
              >
                Ajukan Reseller ke RG ERP
              </Button>
            </>
          )}
        </div>

        {/* Right: Session Filter Dropdown + Active Sessions Live Pill + Kelola Sesi */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px]">
            <label htmlFor="inbox-session-select-desktop" className="text-[var(--text-secondary)]">
              Sesi:
            </label>
            <select
              id="inbox-session-select-desktop"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="h-[34px] px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-strong)] text-[12px] font-medium text-[var(--text-primary)]"
            >
              {workspace.sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[12px] font-semibold text-[var(--text-primary)] tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success-fill)]" />
            <span>{workspace.activeSessionsStatusPill}</span>
          </div>

          {role === 'admin' && (
            <Button
              variant="secondary"
              size="sm"
              className="!min-h-[36px] !py-1 !px-3"
              leftIcon={<Settings className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('sistem', 'pengaturan_nomor_wa')}
            >
              Kelola Sesi
            </Button>
          )}
        </div>
      </SolidCard>

      {/* ====================================================================
       * 3-PANE DESKTOP / MASTER-DETAIL MOBILE WORKSPACE CONTAINER
       * Fills remaining viewport height (`flex-1 min-h-0`) with internal pane scroll.
       * ==================================================================== */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* ==================================================================
         * PANE 1: THREAD LIST (Master on Mobile, 3 Cols on Desktop)
         * ================================================================== */}
        <SolidCard
          padding="none"
          className={`lg:col-span-3 h-full min-h-0 flex-col overflow-hidden ${
            mobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Mobile Session Selector & Kelola Sesi (Only in Thread List Master View on < lg) */}
          <div className="lg:hidden px-3 pt-2.5 pb-2 border-b border-[var(--border-hairline)] flex items-center justify-between gap-2 shrink-0">
            <select
              aria-label="Filter sesi WhatsApp"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="flex-1 min-w-0 h-[36px] px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-strong)] text-[12px] font-medium text-[var(--text-primary)] truncate"
            >
              {workspace.sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('sistem', 'pengaturan_nomor_wa')}
                className="h-[36px] px-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-hairline)] text-[12px] font-semibold text-[var(--text-primary)] inline-flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Kelola Sesi</span>
              </button>
            )}
          </div>

          {/* Search Input + Unclipped Wrapping Filter Pills */}
          <div className="p-2.5 border-b border-[var(--border-hairline)] space-y-2 shrink-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari toko, kota, atau pesan..."
                aria-label="Cari toko, kota, atau pesan"
                className="w-full h-[36px] pl-9 pr-3 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            {/* Filter Pills: Semua | Eskalasi | Sales | AI (flex-wrap so never clipped) */}
            <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter percakapan">
              {(
                [
                  { id: 'semua', label: `Semua (${filterCounts.semua})` },
                  { id: 'eskalasi', label: `Eskalasi (${filterCounts.eskalasi})` },
                  { id: 'sales', label: `Sales (${filterCounts.sales})` },
                  { id: 'ai', label: `AI (${filterCounts.ai})` },
                ] as { id: InboxFilterTab; label: string }[]
              ).map((tab) => {
                const active = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`min-h-[30px] px-2 py-1 rounded-[6px] text-[11px] font-semibold whitespace-nowrap cursor-pointer hig-transition ${
                      active
                        ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                        : 'bg-[var(--surface-recessed)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Thread List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[var(--border-hairline)]">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[var(--text-secondary)]">
                Tidak ada percakapan yang sesuai dengan filter.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                const badgeClass =
                  thread.handlerBadgeLabel === 'Eskalasi AI'
                    ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]'
                    : thread.handlerBadgeLabel === 'Dijawab AI'
                      ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
                      : 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--border-hairline)]';

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => {
                      onSelectThread(thread.id);
                      setMobileDetailOpen(true);
                    }}
                    className={`w-full p-3 text-left flex items-start gap-2.5 cursor-pointer hig-transition ${
                      isSelected
                        ? 'bg-[var(--accent-tint)] border-l-4 border-l-[var(--accent-primary)]'
                        : 'hover:bg-[var(--surface-elevated)]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--surface-recessed)] text-[var(--text-primary)] font-bold text-[13px] flex items-center justify-center shrink-0">
                      {thread.avatarInitial}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                          {thread.shopName}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums shrink-0">
                          {thread.lastMessageTimestamp}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--text-secondary)] truncate">
                        {thread.lastMessagePreview}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[10px] font-semibold border ${badgeClass}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{thread.handlerBadgeLabel}</span>
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] truncate">
                          {thread.city}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </SolidCard>

        {/* ==================================================================
         * PANE 2: SOLID CHAT TRANSCRIPT + GLASS HEADER & COMPOSER (5 Cols Desktop)
         * On Mobile (< lg): Full-screen chat only (Compact header + Chat + Composer)
         * ================================================================== */}
        <SolidCard
          padding="none"
          className={`lg:col-span-5 h-full min-h-0 flex-col overflow-hidden ${
            mobileDetailOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeThread ? (
            <>
              {/* Compact Translucent Glass Thread Header (Back, Contact Name, Profil & ERP) */}
              <GlassChrome
                as="div"
                variant="toolbar"
                className="px-3 py-2 border-b border-[var(--glass-border)] flex items-center justify-between gap-2 shrink-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Mobile Back to Thread List Button */}
                  <IconButton
                    label="Kembali ke daftar percakapan"
                    onClick={() => setMobileDetailOpen(false)}
                    className="lg:hidden -ml-1 !min-w-[40px] !min-h-[40px]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </IconButton>

                  <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] font-bold text-[13px] flex items-center justify-center shrink-0">
                    {activeThread.avatarInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-[var(--text-primary)] truncate">
                      {activeThread.shopName}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] truncate tabular-nums">
                      {formatReadablePhone(activeThread.whatsappNumber)} · {activeThread.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                    {activeThread.funnelStageBadge}
                  </span>

                  {/* Mobile Lead Inspector Bottom Sheet Trigger */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="lg:hidden !min-h-[36px] !px-2.5 !py-1"
                    leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                    onClick={() => setMobileInspectorSheetOpen(true)}
                  >
                    Profil & ERP
                  </Button>
                </div>
              </GlassChrome>

              {/* 100% SOLID CHAT TRANSCRIPT CANVAS (Scrolls internally) */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-[var(--surface-recessed)]">
                {activeThread.messages.map((msg) => {
                  const isShop = msg.senderType === 'shop';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isShop ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[86%] rounded-[var(--radius-sm)] p-2.5 sm:p-3 border space-y-1 ${
                          isShop
                            ? 'bg-[var(--surface-solid)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                            : 'bg-[var(--chat-outgoing-bg)] border-[var(--chat-outgoing-border)] text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[11px]">
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isShop
                                ? 'text-[var(--text-secondary)]'
                                : 'text-[var(--accent-primary)]'
                            }`}
                          >
                            {msg.senderType === 'sales' && <User className="w-3 h-3" />}
                            {msg.senderType === 'ai' && <Bot className="w-3 h-3" />}
                            <span>{msg.senderLabel}</span>
                          </span>
                          <span className="text-[var(--text-tertiary)] tabular-nums">
                            {msg.timestampWib}
                          </span>
                        </div>
                        <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-line">
                          {msg.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Translucent Glass Composer Chrome (Strictly above mobile tab bar) */}
              <GlassChrome
                as="div"
                variant="toolbar"
                className="p-2.5 border-t border-[var(--glass-border)] space-y-2 shrink-0"
              >
                {/* Popover Menu for Quick Reply Spintax / Salin Harga Acuan / Pustaka Media */}
                {activeComposerMenu && (
                  <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] shadow-[var(--shadow-card)] space-y-1 max-h-40 overflow-y-auto">
                    {activeComposerMenu === 'spintax' &&
                      workspace.spintaxTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setComposerText(tpl.body);
                            setActiveComposerMenu(null);
                          }}
                          className="w-full p-2 rounded-[var(--radius-xs)] hover:bg-[var(--surface-recessed)] text-left text-[12px] cursor-pointer"
                        >
                          <div className="font-semibold text-[var(--text-primary)]">
                            {tpl.label}
                          </div>
                          <div className="text-[var(--text-secondary)] truncate">{tpl.body}</div>
                        </button>
                      ))}

                    {activeComposerMenu === 'price' &&
                      workspace.referencePriceSnippets.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setComposerText(item.formattedWhatsAppText);
                            setActiveComposerMenu(null);
                          }}
                          className="w-full p-2 rounded-[var(--radius-xs)] hover:bg-[var(--surface-recessed)] text-left text-[12px] flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">
                              {item.modelName} ({item.variantLabel})
                            </span>
                            <span className="block text-[var(--text-secondary)] tabular-nums">
                              {item.priceRangeLabel}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-[var(--accent-primary)]">
                            Sisipkan
                          </span>
                        </button>
                      ))}

                    {activeComposerMenu === 'media' &&
                      workspace.promoMediaPresets.map((med) => (
                        <button
                          key={med.id}
                          type="button"
                          onClick={() => {
                            setComposerText(med.captionText);
                            setActiveComposerMenu(null);
                          }}
                          className="w-full p-2 rounded-[var(--radius-xs)] hover:bg-[var(--surface-recessed)] text-left text-[12px] cursor-pointer"
                        >
                          <div className="font-semibold text-[var(--text-primary)]">
                            {med.title}
                          </div>
                          <div className="text-[var(--text-tertiary)] tabular-nums">
                            {med.categoryLabel} · {med.fileSizeLabel}
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                <textarea
                  rows={2}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ketik balasan sales manual..."
                  aria-label="Ketik balasan sales manual"
                  className="w-full p-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] sm:text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none"
                />

                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveComposerMenu((prev) =>
                          prev === 'spintax' ? null : 'spintax'
                        )
                      }
                      className="min-h-[34px] px-2 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[11px] sm:text-[12px] font-semibold text-[var(--accent-primary)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Quick Reply Spintax</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveComposerMenu((prev) => (prev === 'price' ? null : 'price'))
                      }
                      className="min-h-[34px] px-2 py-1 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] hover:opacity-90 border border-[var(--status-success-border)] text-[11px] sm:text-[12px] font-semibold text-[var(--status-success)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                      <span>Salin Harga Acuan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveComposerMenu((prev) => (prev === 'media' ? null : 'media'))
                      }
                      className="min-h-[34px] px-2 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] border border-[var(--border-hairline)] text-[11px] sm:text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5 shrink-0" />
                      <span>Pustaka Media</span>
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="!min-h-[36px] !px-3 !py-1"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                    onClick={handleSend}
                    disabled={!composerText.trim()}
                  >
                    Kirim Pesan
                  </Button>
                </div>
              </GlassChrome>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-[var(--text-secondary)]">
              Pilih percakapan di panel kiri untuk membuka riwayat chat.
            </div>
          )}
        </SolidCard>

        {/* ==================================================================
         * PANE 3: LEAD INSPECTOR & HANDOVER ERP (4 Cols Desktop, Sheet on Mobile)
         * ================================================================== */}
        <SolidCard
          padding="none"
          className="hidden lg:flex lg:col-span-4 h-full min-h-0 flex-col overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-[var(--border-hairline)] shrink-0">
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">
              Lead Inspector & Handover ERP
            </h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            {activeThread ? (
              renderLeadInspectorContent(activeThread)
            ) : (
              <p className="hig-footnote text-[var(--text-secondary)]">
                Pilih prospek untuk menampilkan inspektor kualifikasi.
              </p>
            )}
          </div>
        </SolidCard>
      </div>

      {/* ====================================================================
       * MOBILE LEAD INSPECTOR SLIDE-UP BOTTOM SHEET (`18b-inbox-lead`)
       * ==================================================================== */}
      {activeThread && (
        <ModalSheet
          open={mobileInspectorSheetOpen}
          onClose={() => setMobileInspectorSheetOpen(false)}
          title="Lead Inspector & Handover ERP"
          subtitle={`${activeThread.shopName} · +${activeThread.whatsappNumber}`}
        >
          {renderLeadInspectorContent(activeThread)}
        </ModalSheet>
      )}
    </div>
  );
};
