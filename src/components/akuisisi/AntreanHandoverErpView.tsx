import React, { useState, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Search,
  FileCheck2,
} from 'lucide-react';
import {
  AntreanHandoverErpViewDTO,
  HandoverQueueRowDTO,
  HubId,
  InboxLeadThreadDTO,
  SegmentId,
} from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';
import { ModalSheet } from '../ui/ModalSheet';

export interface AntreanHandoverErpViewProps {
  data: AntreanHandoverErpViewDTO;
  onOpenNewHandoverModal: (lead?: InboxLeadThreadDTO) => void;
  onRefresh: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

type HandoverStatusFilter = 'ALL' | 'HANDOVER_PENDING' | 'GRADUATED_TO_ERP';

const EMPTY_NEW_HANDOVER_LEAD: InboxLeadThreadDTO = {
  id: 'thr-manual-erp',
  leadIdNumber: 150999,
  shopName: '',
  avatarInitial: 'R',
  picName: '',
  whatsappNumber: '628',
  city: '',
  province: '',
  fullAddress: '',
  googleMapsUrl: '',
  instagramHandle: '',
  filterCategory: 'sales',
  handlerBadgeLabel: 'Dipegang Sales',
  funnelStageBadge: 'Prospek Kualifikasi (QUALIFIED)',
  priorityScore: 85,
  waSessionId: 'session-01',
  waSessionLabel: 'WABA Hub Nusantara (6281194002101)',
  cycleStatusLabel: 'Ditangani manusia',
  lastMessageTimestamp: 'Baru saja',
  lastMessagePreview: 'Pengajuan baru dari Antrean Handover ERP.',
  unreadCount: 0,
  defaultFocusCategory: 'Ex-iBox (Second Resmi)',
  defaultProductInterests: ['Ex-iBox', 'New iBox'],
  defaultWeeklyPotentialUnits: 5,
  defaultHandoverNote: 'Prospek siap order rutin mingguan dan tertarik katalog konsinyasi.',
  erpDuplicateCheck: {
    checkedAtWib: '29 Okt 09.25 WIB',
    isDuplicate: false,
    statusMessage: 'Pengajuan baru ke gerbang RG ERP.',
  },
  cognitiveMemory: {
    funnelStageCode: 'QUALIFIED',
    picName: 'Pemilik Toko',
    counterProfile: 'Pengajuan dari Antrean Handover ERP',
    preferredSeries: 'iPhone Ex-iBox & New iBox',
    budgetRange: 'Sesuai potensi mingguan',
    tabooNotes: 'Belum ada',
    dealHistorySummary: 'Pengajuan baru',
    conversationSummary: 'Siap verifikasi KYC RG ERP.',
  },
  messages: [],
};

/**
 * Segment 5: Antrean Handover ERP (`04-handover-erp`)
 * - Presentational component (zero internal fetch calls).
 * - Top bar with `+ Ajukan Reseller Baru ke RG ERP` (opens `d03`).
 * - Three KPI cards (`Total Pengajuan Handover`, `Menunggu Verifikasi Owner`, `Lulus Reseller Aktif RG ERP`).
 * - Sticky Glass Filter Bar + Solid surface table of handover submissions with mobile card-list transformation.
 */
export const AntreanHandoverErpView: React.FC<AntreanHandoverErpViewProps> = ({
  data,
  onOpenNewHandoverModal,
  onRefresh,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HandoverStatusFilter>('ALL');
  const [selectedKycDetail, setSelectedKycDetail] = useState<HandoverQueueRowDTO | null>(null);

  const filteredSubmissions = useMemo(() => {
    return data.submissions.filter((row) => {
      if (statusFilter !== 'ALL' && row.statusCode !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.shopName.toLowerCase().includes(q) ||
          row.city.toLowerCase().includes(q) ||
          row.erpHandoverId.toLowerCase().includes(q) ||
          row.whatsappNumber.toLowerCase().includes(q) ||
          row.picName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data.submissions, statusFilter, searchQuery]);

  const columns: DataTableColumn<HandoverQueueRowDTO>[] = [
    {
      key: 'id',
      header: 'ID ERP',
      isNumeric: true,
      render: (row) => (
        <span className="font-bold text-[13px] text-[var(--accent-primary)] tabular-nums">
          {row.erpHandoverId}
        </span>
      ),
    },
    {
      key: 'shop',
      header: 'Nama Toko Counter',
      render: (row) => (
        <div>
          <div className="font-bold text-[14px] text-[var(--text-primary)]">{row.shopName}</div>
          <div className="text-[12px] text-[var(--text-secondary)]">
            PIC: {row.picName} · #{row.leadIdNumber}
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Kota',
      render: (row) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{row.city}</div>
          <div className="text-[12px] text-[var(--text-tertiary)]">{row.province}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Nomor WA',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)] tabular-nums">
          +{row.whatsappNumber.replace(/^\+/, '')}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Kategori Fokus',
      render: (row) => (
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[12px] font-semibold text-[var(--text-primary)]">
            {row.focusCategory}
          </span>
          <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5 tabular-nums">
            Potensi: {row.weeklyPotentialUnits} unit/minggu
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status Handover',
      render: (row) =>
        row.statusCode === 'HANDOVER_PENDING' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Menunggu ACC ERP</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Lulus ke RG ERP</span>
          </span>
        ),
    },
    {
      key: 'submittedAt',
      header: 'Waktu Pengajuan',
      isNumeric: true,
      render: (row) => (
        <span className="text-[12px] text-[var(--text-secondary)] tabular-nums">
          {row.submittedAtWib}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Tindakan',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
            onClick={() => setSelectedKycDetail(row)}
          >
            Berkas KYC
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ====================================================================
       * 1. TOP ACTION BAR (`+ Ajukan Reseller Baru ke RG ERP`, `Muat Ulang`, Nav Links)
       * ==================================================================== */}
      <SolidCard padding="sm" className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => onOpenNewHandoverModal(EMPTY_NEW_HANDOVER_LEAD)}
          >
            Ajukan Reseller Baru ke RG ERP
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onRefresh}
          >
            Muat Ulang
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('akuisisi', 'radar_toko')}
          >
            Buka Radar Toko HP
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('inbox', 'inbox_workspace')}
          >
            Buka Hunter Chat
          </Button>
        </div>
      </SolidCard>

      {/* ====================================================================
       * 2. THREE KPI CARDS (`04-handover-erp`)
       * ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Total Pengajuan Handover */}
        <SolidCard padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              Total Pengajuan Handover
            </span>
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="hig-large-title text-[var(--text-primary)] tabular-nums">
            {data.kpiTotalSubmissions}
          </div>
          <p className="hig-caption text-[var(--text-secondary)]">
            Diserahkan dari Olivia SDR ke RG ERP
          </p>
        </SolidCard>

        {/* KPI 2: Menunggu Verifikasi Owner */}
        <SolidCard padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              Menunggu Verifikasi Owner
            </span>
            <Clock className="w-4 h-4 text-[var(--status-warning)]" />
          </div>
          <div className="hig-large-title text-[var(--status-warning)] tabular-nums">
            {data.kpiPendingVerification}
          </div>
          <p className="hig-caption text-[var(--text-secondary)]">Status HANDOVER_PENDING</p>
        </SolidCard>

        {/* KPI 3: Lulus Reseller Aktif RG ERP */}
        <SolidCard padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">
              Lulus Reseller Aktif RG ERP
            </span>
            <CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />
          </div>
          <div className="hig-large-title text-[var(--status-success)] tabular-nums">
            {data.kpiGraduatedActive}
          </div>
          <p className="hig-caption text-[var(--text-secondary)]">
            Status GRADUATED_TO_ERP (Terkunci di SDR)
          </p>
        </SolidCard>
      </div>

      {/* ====================================================================
       * 3. STICKY GLASS FILTER BAR & SOLID HANDOVER TABLE
       * ==================================================================== */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="hig-title text-[var(--text-primary)]">{data.title}</h2>
          <p className="hig-footnote text-[var(--text-secondary)] mt-0.5">{data.subtitle}</p>
        </div>

        {/* Glass Filter Bar (Sticky on desktop, scrolls on mobile) */}
        <GlassChrome
          variant="toolbar"
          radius="md"
          className="md:sticky md:top-[7.25rem] z-10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama toko, kota, atau ID ERP..."
              className="w-full min-h-[44px] md:min-h-[38px] pl-9 pr-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          <div
            role="group"
            aria-label="Filter status handover ERP"
            className="inline-flex flex-wrap items-center p-1 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] gap-1"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold cursor-pointer hig-transition ${
                statusFilter === 'ALL'
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Semua Status ({data.submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('HANDOVER_PENDING')}
              className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold cursor-pointer hig-transition ${
                statusFilter === 'HANDOVER_PENDING'
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Menunggu ACC ERP ({data.kpiPendingVerification})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('GRADUATED_TO_ERP')}
              className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold cursor-pointer hig-transition ${
                statusFilter === 'GRADUATED_TO_ERP'
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Lulus ke RG ERP ({data.kpiGraduatedActive})
            </button>
          </div>
        </GlassChrome>

        {/* Solid Handover Submissions Table */}
        <DataTable
          columns={columns}
          rows={filteredSubmissions}
          rowKey={(r) => r.id}
          caption="Tabel Antrean Serah Terima Prospek ke RG ERP"
          emptyLabel="Belum ada pengajuan handover yang cocok dengan filter saat ini."
          mobileCardRender={(row) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[12px] font-bold text-[var(--accent-primary)] tabular-nums block">
                    {row.erpHandoverId}
                  </span>
                  <div className="font-bold text-[15px] text-[var(--text-primary)]">
                    {row.shopName}
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">
                    {row.city} · PIC: {row.picName}
                  </div>
                </div>

                {row.statusCode === 'HANDOVER_PENDING' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Menunggu ACC</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Lulus RG ERP</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--text-secondary)] tabular-nums">
                <span>WA: +{row.whatsappNumber.replace(/^\+/, '')}</span>
                <span>{row.submittedAtWib}</span>
              </div>

              <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[11px] font-semibold text-[var(--text-primary)]">
                  {row.focusCategory} ({row.weeklyPotentialUnits} unit/mgg)
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedKycDetail(row)}
                >
                  Berkas KYC
                </Button>
              </div>
            </div>
          )}
        />
      </div>

      {/* KYC Detail Sheet */}
      <ModalSheet
        open={Boolean(selectedKycDetail)}
        onClose={() => setSelectedKycDetail(null)}
        size="md"
        title={
          selectedKycDetail
            ? `Rincian Handover ${selectedKycDetail.erpHandoverId}`
            : 'Rincian Handover'
        }
        subtitle={
          selectedKycDetail
            ? `${selectedKycDetail.shopName} · ${selectedKycDetail.city}, ${selectedKycDetail.province}`
            : undefined
        }
        footer={
          <Button variant="primary" size="sm" onClick={() => setSelectedKycDetail(null)}>
            Tutup
          </Button>
        }
      >
        {selectedKycDetail && (
          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
              <div>
                <span className="text-[var(--text-tertiary)] block">Nama Pemilik / PIC</span>
                <strong className="text-[var(--text-primary)]">{selectedKycDetail.picName}</strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Nomor WhatsApp</span>
                <strong className="text-[var(--text-primary)] tabular-nums">
                  +{selectedKycDetail.whatsappNumber.replace(/^\+/, '')}
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Kategori Fokus</span>
                <strong className="text-[var(--text-primary)]">
                  {selectedKycDetail.focusCategory}
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block">Berkas KYC Terkompresi</span>
                <strong className="text-[var(--text-primary)] tabular-nums">
                  KTP ({selectedKycDetail.ktpSizeKb} KB) · Toko ({selectedKycDetail.shopPhotoSizeKb}{' '}
                  KB)
                </strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
                Alamat Lengkap Counter
              </span>
              <p className="text-[var(--text-primary)]">{selectedKycDetail.fullAddress}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
                Catatan Kualifikasi Sales
              </span>
              <p className="p-3 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[var(--text-primary)]">
                {selectedKycDetail.salesQualificationNote}
              </p>
            </div>
          </div>
        )}
      </ModalSheet>
    </div>
  );
};
