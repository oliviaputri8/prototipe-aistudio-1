/**
 * Olivia SDR — Single Typed Mock API Layer (Go REST/JSON + SSE Shapes)
 *
 * STAGE 1a + STAGE 1b + STAGE 2 SCOPE:
 * Contains strictly the typed DTOs, 100% fictional datasets, and pure async functions for:
 * - Stage 1a: Login (`01-login`), Operator Session, Global App Shell Chrome, 2-Level Navigation, Spotlight Search
 * - Stage 1b:
 *   1. Beranda (`02-beranda`): Monthly target banner, 4 KPI cards, 6-region Indonesia distribution preview
 *   2. Hunter Chat / Inbox (`18-inbox`, `18b-inbox-lead`): 3-pane workspace, thread filters, solid chat transcript,
 *      spintax/price/media composer presets, and Lead Inspector with 7-layer AI cognitive memory summary
 *   3. Dialog d03 (`d03-dialog-ajukan-reseller`): Full KYC handover form to RG ERP with validation & receipt DTOs
 * - Stage 2 ("Akuisisi & Antrean" Hub — 5 Segments + Dialogs d02 & d04):
 *   1. Antrean Hari Ini (`06-antrean-hari-ini`) + Dialog d04 (`d04-dialog-tambah-nomor`):
 *      22-shop daily outreach queue, quota header, session filter, circuit-breaker banner, Card Grid + Mode Fokus
 *   2. Radar Toko HP (`03-radar-toko-hp`): WhatsApp duplicate checker against RG ERP, multi-city chips,
 *      category & SDR-status filters, solid prospect table with Cek ERP, Sapa Spintax, Ajukan ke RG ERP
 *   3. Jadwal Tindak Lanjut (`07-tindak-lanjut-terbuka`) + Dialog d02 (`d02-dialog-tindak-lanjut`):
 *      status filter, date range, tanpa tenggat filter, solid table with Tandai Ditepati, pagination
 *   4. Ketepatan Waktu SLA (`07b-tindak-lanjut-sla`): SLA compliance panel and automation rules card
 *   5. Antrean Handover ERP (`04-handover-erp`): 3 KPI cards, filterable handover table, Ajukan Reseller Baru (d03)
 *
 * NOTE: All shop names, PIC names, WhatsApp numbers, addresses, and emails are 100% fictional.
 * Mock data for Stage 3 and Stage 4 screens will be added in their respective stages.
 */

export type UserRole = 'admin' | 'sales_crm';

export type AsyncSimState = 'success' | 'loading' | 'empty' | 'error';

export type HubId =
  | 'beranda'
  | 'akuisisi'
  | 'inbox'
  | 'database'
  | 'katalog'
  | 'laporan'
  | 'impor'
  | 'sistem';

export type SegmentId =
  // Beranda (Single view)
  | 'beranda_utama'
  // Hub 2: Akuisisi & Antrean (Includes Antrean Handover ERP as final sales step)
  | 'antrean_hari_ini'
  | 'radar_toko'
  | 'jadwal_tindak_lanjut'
  | 'ketepatan_waktu_sla'
  | 'antrean_handover_erp'
  // Hub 3: Hunter Inbox (Single 3-pane workspace)
  | 'inbox_workspace'
  // Hub 4: Database & Peta Toko
  | 'semua_toko'
  | 'toko_tier_a'
  | 'reseller_aktif'
  | 'peta_toko'
  // Hub 5: Katalog & Media
  | 'katalog_harga'
  | 'media_promosi'
  // Hub 6 (Admin Only): Laporan & Target
  | 'laporan_periode'
  | 'laporan_target'
  | 'laporan_sapaan'
  // Hub 7 (Admin Only): Impor Data (Single 4-segment control)
  | 'impor_unggah_toko'
  | 'impor_riwayat'
  | 'impor_stok'
  | 'impor_harga'
  // Hub 8 (Admin Only): Sistem & Pengawasan
  | 'pengaturan_nomor_wa'
  | 'kesehatan_sistem'
  | 'log_aktivitas'
  | 'data_terhapus';

export interface NavSegmentItem {
  id: SegmentId;
  label: string;
  screenCode: string;
  badgeCount?: number;
  description: string;
}

export interface NavHubItem {
  id: HubId;
  label: string;
  shortMobileLabel: string;
  group: 'crm' | 'admin';
  adminOnly: boolean;
  iconName:
    | 'home'
    | 'compass'
    | 'message-square'
    | 'store'
    | 'tag'
    | 'bar-chart-3'
    | 'upload'
    | 'shield-check';
  badgeCount?: number;
  segments: NavSegmentItem[];
}

export interface OperatorProfileDTO {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleBadgeLabel: string;
  accessScopeLabel: string;
  assignedWaSession: string;
  avatarInitials: string;
}

export interface SystemRuntimeStatusDTO {
  apiEndpointLabel: string;
  dbEngineLabel: string;
  dbHealthy: boolean;
  aiEmergencyKillSwitchActive: boolean;
  aiStatusLabel: string;
  wibFormattedTimestamp: string;
  activeWaSessionsCount: number;
  totalWaSessionsCount: number;
  circuitBreakerLabel: string;
}

export interface SystemNotificationDTO {
  id: string;
  title: string;
  message: string;
  timestampWib: string;
  severity: 'info' | 'warning' | 'danger';
  targetHub: HubId;
  targetSegment: SegmentId;
  unread: boolean;
}

export interface SpotlightSearchHitDTO {
  id: string;
  type: 'toko' | 'layar' | 'aksi';
  title: string;
  subtitle: string;
  metaRight: string;
  hubId: HubId;
  segmentId: SegmentId;
}

export interface LoginConfigDTO {
  appName: string;
  appTagline: string;
  googleButtonLabel: string;
  whitelistNotice: string;
  devModeButtonLabel: string;
  availableOperators: OperatorProfileDTO[];
}

export interface ShellBootstrapResponseDTO {
  loginConfig: LoginConfigDTO;
  operators: Record<UserRole, OperatorProfileDTO>;
  runtimeStatus: SystemRuntimeStatusDTO;
  navigationHubs: NavHubItem[];
  notifications: SystemNotificationDTO[];
  spotlightIndex: SpotlightSearchHitDTO[];
}

/* ============================================================================
 * STAGE 1b TYPED DTOs: BERANDA (`02-beranda`)
 * ============================================================================ */

export interface BerandaKpiCardDTO {
  id: string;
  label: string;
  numericValue: number;
  deltaLabel: string;
  iconType: 'new-shop' | 'contacted' | 'positive-reply' | 'active-reseller';
  tone: 'success' | 'accent' | 'warning';
  targetHub: HubId;
  targetSegment: SegmentId;
}

export interface RegionalIslandDistributionDTO {
  id: string;
  islandName: string;
  totalShops: number;
  potentialShops: number;
  contactedShops: number;
  activeResellers: number;
  densityLevel: 1 | 2 | 3 | 4 | 5;
  topProvincesSummary: string;
  /** Relative schematic coordinates (0-1000 x 0-420 viewBox) for SVG archipelago callout */
  svgAnchorX: number;
  svgAnchorY: number;
}

export interface BerandaDashboardDTO {
  bannerGreetingPrefix: string;
  bannerHeadline: string;
  bannerSubtitle: string;
  bannerCtaLabel: string;
  bannerTargetHub: HubId;
  bannerTargetSegment: SegmentId;
  monthlyTarget: {
    label: string;
    targetCount: number;
    unitLabel: string;
    achievedCount: number;
    achievedPercentLabel: string;
  };
  kpiCards: BerandaKpiCardDTO[];
  regionalSummary: {
    title: string;
    subtitle: string;
    openMapLabel: string;
    legendLowLabel: string;
    legendHighLabel: string;
    legendRangeLabel: string;
    islands: RegionalIslandDistributionDTO[];
  };
}

/* ============================================================================
 * STAGE 1b TYPED DTOs: HUNTER INBOX (`18-inbox`, `18b-inbox-lead`) & DIALOG `d03`
 * ============================================================================ */

export type InboxFilterTab = 'semua' | 'eskalasi' | 'sales' | 'ai';

export type ProductCategoryOption = 'Ex-iBox' | 'New iBox' | 'Inter';

export type PrimaryFocusCategoryOption =
  | 'Ex-iBox (Second Resmi)'
  | 'New iBox (Garansi Resmi)'
  | 'Inter (All Operator)';

export interface ChatMessageDTO {
  id: string;
  senderType: 'shop' | 'sales' | 'ai';
  senderLabel: string;
  body: string;
  timestampWib: string;
  attachmentTitle?: string;
}

export interface LeadCognitiveMemorySummaryDTO {
  funnelStageCode: string;
  picName: string;
  counterProfile: string;
  preferredSeries: string;
  budgetRange: string;
  tabooNotes: string;
  dealHistorySummary: string;
  conversationSummary: string;
}

export interface ErpDuplicateCheckDTO {
  checkedAtWib: string;
  isDuplicate: boolean;
  statusMessage: string;
  existingErpId?: string;
}

export interface InboxLeadThreadDTO {
  id: string;
  leadIdNumber: number;
  shopName: string;
  avatarInitial: string;
  picName: string;
  whatsappNumber: string;
  city: string;
  province: string;
  fullAddress: string;
  googleMapsUrl: string;
  instagramHandle: string;
  filterCategory: Exclude<InboxFilterTab, 'semua'>;
  handlerBadgeLabel: 'Dipegang Sales' | 'Eskalasi AI' | 'Dijawab AI';
  funnelStageBadge: string;
  priorityScore: number;
  waSessionId: string;
  waSessionLabel: string;
  cycleStatusLabel: 'Ditangani manusia' | 'Otomatisasi AI' | 'Menunggu Ambil Alih';
  lastMessageTimestamp: string;
  lastMessagePreview: string;
  unreadCount: number;
  defaultFocusCategory: PrimaryFocusCategoryOption;
  defaultProductInterests: ProductCategoryOption[];
  defaultWeeklyPotentialUnits: number;
  defaultHandoverNote: string;
  erpDuplicateCheck: ErpDuplicateCheckDTO;
  cognitiveMemory: LeadCognitiveMemorySummaryDTO;
  messages: ChatMessageDTO[];
}

export interface SpintaxTemplateDTO {
  id: string;
  label: string;
  category: string;
  body: string;
}

export interface ReferencePriceSnippetDTO {
  id: string;
  modelName: string;
  variantLabel: ProductCategoryOption;
  priceRangeLabel: string;
  formattedWhatsAppText: string;
}

export interface PromoMediaPresetDTO {
  id: string;
  title: string;
  fileName: string;
  categoryLabel: string;
  fileSizeLabel: string;
  captionText: string;
}

export interface WaSessionOptionDTO {
  id: string;
  label: string;
}

export interface HunterInboxWorkspaceDTO {
  workspaceTitle: string;
  activeSessionsStatusPill: string;
  sessions: WaSessionOptionDTO[];
  threads: InboxLeadThreadDTO[];
  spintaxTemplates: SpintaxTemplateDTO[];
  referencePriceSnippets: ReferencePriceSnippetDTO[];
  promoMediaPresets: PromoMediaPresetDTO[];
  systemBoundaryCard: {
    title: string;
    description: string;
  };
}

export interface HandoverKycFileMetadataDTO {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
}

export interface HandoverSubmissionPayloadDTO {
  threadId: string;
  shopName: string;
  picName: string;
  whatsappNumber: string;
  city: string;
  province: string;
  fullAddress: string;
  googleMapsUrl: string;
  instagramHandle: string;
  primaryFocusCategory: PrimaryFocusCategoryOption;
  productInterests: ProductCategoryOption[];
  weeklyPotentialUnits: number;
  ktpPhoto: HandoverKycFileMetadataDTO | null;
  shopFrontPhoto: HandoverKycFileMetadataDTO | null;
  salesQualificationNote: string;
}

export interface HandoverSubmissionReceiptDTO {
  erpHandoverId: string;
  submittedAtWib: string;
  shopName: string;
  whatsappNumber: string;
  statusCode: 'MENUNGGU_VERIFIKASI_OWNER';
  statusLabel: string;
  compressedKtpSizeKb: number;
  compressedShopPhotoSizeKb: number;
}

/* ============================================================================
 * 100% FICTIONAL STAGE 1a + 1b DATASETS
 * ============================================================================ */

const FICTIONAL_OPERATORS: Record<UserRole, OperatorProfileDTO> = {
  admin: {
    id: 'usr-admin-01',
    fullName: 'Nadia Kusuma Wardani',
    email: 'nadia.wardani@nusantaragadget.id',
    role: 'admin',
    roleBadgeLabel: 'Pemilik (Master · Akun 1)',
    accessScopeLabel: 'Hak Akses: Penuh (Master & Pengambilalihan Seluruh Chat)',
    assignedWaSession: 'session-01 (+62 811-9400-2101)',
    avatarInitials: 'NK',
  },
  sales_crm: {
    id: 'usr-sales-02',
    fullName: 'Rizky Pratama Wijaya',
    email: 'rizky.wijaya@nusantaragadget.id',
    role: 'sales_crm',
    roleBadgeLabel: 'Sales CRM Aktif',
    accessScopeLabel: 'Hak Akses: CRM Sesuai Nomor Masing-Masing',
    assignedWaSession: 'session-02 (+62 812-8800-3402)',
    avatarInitials: 'RP',
  },
};

const NAVIGATION_HUBS: NavHubItem[] = [
  // GROUP 1: PENJUALAN & CRM (Visible to both Admin and Sales CRM)
  {
    id: 'beranda',
    label: 'Beranda',
    shortMobileLabel: 'Beranda',
    group: 'crm',
    adminOnly: false,
    iconName: 'home',
    segments: [
      {
        id: 'beranda_utama',
        label: 'Ringkasan Harian',
        screenCode: '02-beranda',
        description: 'Target bulanan reseller, metrik konversi harian, dan peta sebaran wilayah.',
      },
    ],
  },
  {
    id: 'akuisisi',
    label: 'Akuisisi & Antrean',
    shortMobileLabel: 'Antrean',
    group: 'crm',
    adminOnly: false,
    iconName: 'compass',
    badgeCount: 25,
    segments: [
      {
        id: 'antrean_hari_ini',
        label: 'Antrean Hari Ini',
        screenCode: '06-antrean-hari-ini',
        badgeCount: 25,
        description: 'Target aman 20–25 toko per nomor/hari dengan proteksi circuit breaker.',
      },
      {
        id: 'radar_toko',
        label: 'Radar Toko HP',
        screenCode: '03-radar-toko-hp',
        description: 'Filter multi-kota target akuisisi dan cek duplikasi nomor ke RG ERP.',
      },
      {
        id: 'jadwal_tindak_lanjut',
        label: 'Tindak Lanjut',
        screenCode: '07-tindak-lanjut-terbuka',
        badgeCount: 2,
        description: 'Jadwal komitmen follow-up mitra toko yang terbuka dan ditepati.',
      },
      {
        id: 'ketepatan_waktu_sla',
        label: 'Ketepatan Waktu SLA',
        screenCode: '07b-tindak-lanjut-sla',
        description: 'Monitoring ketepatan waktu tindak lanjut tim sales dan aturan pengingat.',
      },
      {
        id: 'antrean_handover_erp',
        label: 'Antrean Handover ERP',
        screenCode: '04-handover-erp',
        description: 'Serah terima prospek kualifikasi (KYC KTP & foto toko) ke sistem RG ERP.',
      },
    ],
  },
  {
    id: 'inbox',
    label: 'Hunter Chat / Inbox',
    shortMobileLabel: 'Inbox',
    group: 'crm',
    adminOnly: false,
    iconName: 'message-square',
    badgeCount: 5,
    segments: [
      {
        id: 'inbox_workspace',
        label: 'Hunter Chat Workspace',
        screenCode: '18-inbox',
        badgeCount: 5,
        description: 'Ruang kerja percakapan WhatsApp 3-panel dengan Lead Inspector & Memori AI.',
      },
    ],
  },
  {
    id: 'database',
    label: 'Data & Peta Toko',
    shortMobileLabel: 'Toko',
    group: 'crm',
    adminOnly: false,
    iconName: 'store',
    segments: [
      {
        id: 'semua_toko',
        label: 'Semua Toko',
        screenCode: '08-semua-toko',
        description: 'Database lengkap seluruh toko counter HP beserta status sapaan dan funnel.',
      },
      {
        id: 'toko_tier_a',
        label: 'Toko Tier A',
        screenCode: '08c-toko-tier-A',
        description: 'Daftar toko prioritas utama (Tier A) dengan skor kelayakan tertinggi.',
      },
      {
        id: 'reseller_aktif',
        label: 'Reseller Aktif',
        screenCode: '08b-reseller-aktif',
        badgeCount: 5,
        description: 'Mitra toko yang telah lulus verifikasi dan aktif bertransaksi di RG ERP.',
      },
      {
        id: 'peta_toko',
        label: 'Peta Provinsi',
        screenCode: '10-peta-toko',
        description: 'Sebaran toko di seluruh 38 provinsi Indonesia beserta rincian Kabupaten/Kota.',
      },
    ],
  },
  {
    id: 'katalog',
    label: 'Katalog & Media',
    shortMobileLabel: 'Katalog',
    group: 'crm',
    adminOnly: false,
    iconName: 'tag',
    segments: [
      {
        id: 'katalog_harga',
        label: 'Katalog Harga Acuan',
        screenCode: '05-katalog-harga',
        description: 'Daftar harga acuan harian reseller iPhone (Ex-iBox, New iBox, Inter).',
      },
      {
        id: 'media_promosi',
        label: 'Pustaka Media Promosi',
        screenCode: '13-media-promosi',
        description: 'Pustaka berkas brosur dan pricelist dengan WhatsApp Media Hash Caching.',
      },
    ],
  },

  // GROUP 2: ADMINISTRASI & SISTEM (Strictly Admin-Only; Hidden for Sales CRM)
  {
    id: 'laporan',
    label: 'Laporan',
    shortMobileLabel: 'Laporan',
    group: 'admin',
    adminOnly: true,
    iconName: 'bar-chart-3',
    segments: [
      {
        id: 'laporan_periode',
        label: 'Periode',
        screenCode: '11-laporan',
        description: 'Ringkasan distribusi stok fisik, konsinyasi, dan tingkat balasan per tier.',
      },
      {
        id: 'laporan_target',
        label: 'Target',
        screenCode: '11b-laporan-target',
        description: 'Target & SLA tim sales harian serta kuota aman anti-banned.',
      },
      {
        id: 'laporan_sapaan',
        label: 'Sapaan',
        screenCode: '11c-laporan-sapaan',
        description: 'Evaluasi efektivitas konversi sapaan awal per tier, template, dan jam WIB.',
      },
    ],
  },
  {
    id: 'impor',
    label: 'Impor Data',
    shortMobileLabel: 'Impor',
    group: 'admin',
    adminOnly: true,
    iconName: 'upload',
    segments: [
      {
        id: 'impor_unggah_toko',
        label: 'Unggah Data Toko',
        screenCode: '12-impor-data',
        description: 'Impor berkas CSV atau Excel (.xlsx) untuk menambahkan toko baru ke bank data.',
      },
      {
        id: 'impor_riwayat',
        label: 'Riwayat Impor',
        screenCode: '12b-impor-riwayat',
        description: 'Catatan riwayat berkas CSV atau Excel yang telah dimasukkan ke basis data.',
      },
      {
        id: 'impor_stok',
        label: 'Stok',
        screenCode: '12c-impor-stok',
        description: 'Impor Excel stok unit dari admin dan verifikasi pratinjau baris.',
      },
      {
        id: 'impor_harga',
        label: 'Harga',
        screenCode: '12d-impor-harga',
        description: 'Impor Excel daftar harga acuan harian untuk diterbitkan ke katalog.',
      },
    ],
  },
  {
    id: 'sistem',
    label: 'Sistem & Pengawasan',
    shortMobileLabel: 'Sistem',
    group: 'admin',
    adminOnly: true,
    iconName: 'shield-check',
    segments: [
      {
        id: 'pengaturan_nomor_wa',
        label: 'Pengaturan Nomor WA Sales',
        screenCode: '14-pengaturan-nomor-wa',
        description: 'Target bulanan reseller, whitelist Google OAuth, dan penugasan sesi WA.',
      },
      {
        id: 'kesehatan_sistem',
        label: 'Kesehatan Sistem',
        screenCode: '15-kesehatan-sistem',
        description: 'Pemantauan PostgreSQL, Saklar Darurat AI, cadangan otomatis, dan echo WA.',
      },
      {
        id: 'log_aktivitas',
        label: 'Log Aktivitas',
        screenCode: '16-aktivitas',
        description: 'Catatan audit tindakan per akun: buka WhatsApp, ambil alih chat, dan pengaturan.',
      },
      {
        id: 'data_terhapus',
        label: 'Terhapus',
        screenCode: '17-terhapus',
        description: 'Daftar toko dan pustaka media yang dihapus lunak (soft-delete) untuk dipulihkan.',
      },
    ],
  },
];

const FICTIONAL_NOTIFICATIONS: SystemNotificationDTO[] = [
  {
    id: 'notif-01',
    title: 'Saklar Darurat AI Aktif',
    message: 'Asisten AI saat ini dimatikan darurat. Seluruh balasan masuk dialihkan ke antrean manual Sales.',
    timestampWib: '10 menit lalu',
    severity: 'danger',
    targetHub: 'sistem',
    targetSegment: 'kesehatan_sistem',
    unread: true,
  },
  {
    id: 'notif-02',
    title: '2 Tindak Lanjut Melewati Tenggat',
    message: 'Komitmen follow-up untuk Mentari Seluler Mandiri dan Dirgantara Ponsel Utama menunggu tindakan.',
    timestampWib: '35 menit lalu',
    severity: 'warning',
    targetHub: 'akuisisi',
    targetSegment: 'jadwal_tindak_lanjut',
    unread: true,
  },
  {
    id: 'notif-03',
    title: 'Balasan Baru di Hunter Inbox',
    message: 'Cahaya Gadget Sentosa menanyakan estimasi harga grosir iPhone 13 128GB Ex-iBox.',
    timestampWib: '1 jam lalu',
    severity: 'info',
    targetHub: 'inbox',
    targetSegment: 'inbox_workspace',
    unread: false,
  },
];

const FICTIONAL_SPOTLIGHT_INDEX: SpotlightSearchHitDTO[] = [
  {
    id: 'sp-toko-101',
    type: 'toko',
    title: 'Cahaya Gadget Sentosa',
    subtitle: 'Kota Surabaya · +62 811-9400-7712',
    metaRight: 'Tier A · Skor 84 · Diskusi Aktif',
    hubId: 'inbox',
    segmentId: 'inbox_workspace',
  },
  {
    id: 'sp-toko-102',
    type: 'toko',
    title: 'Mentari Seluler Mandiri',
    subtitle: 'Kota Bandung · +62 812-8800-5519',
    metaRight: 'Tier A · Skor 91 · Eskalasi AI',
    hubId: 'inbox',
    segmentId: 'inbox_workspace',
  },
  {
    id: 'sp-toko-103',
    type: 'toko',
    title: 'Dirgantara Ponsel Utama',
    subtitle: 'Kota Medan · +62 813-6200-4418',
    metaRight: 'Tier A · Skor 78 · Dipegang Sales',
    hubId: 'inbox',
    segmentId: 'inbox_workspace',
  },
  {
    id: 'sp-toko-104',
    type: 'toko',
    title: 'Bintang Elektronik Raya',
    subtitle: 'Kota Denpasar · +62 812-4100-9930',
    metaRight: 'Tier A · Skor 87 · Siap Handover ERP',
    hubId: 'inbox',
    segmentId: 'inbox_workspace',
  },
  {
    id: 'sp-layar-antrean',
    type: 'layar',
    title: 'Antrean Penjangkauan Harian',
    subtitle: 'Akuisisi & Antrean · 25 toko siap disapa hari ini',
    metaRight: 'Antrean Harian',
    hubId: 'akuisisi',
    segmentId: 'antrean_hari_ini',
  },
  {
    id: 'sp-layar-handover',
    type: 'layar',
    title: 'Antrean Handover ERP',
    subtitle: 'Akuisisi & Antrean · Serah terima prospek kualifikasi ke RG ERP',
    metaRight: 'Handover Gate',
    hubId: 'akuisisi',
    segmentId: 'antrean_handover_erp',
  },
  {
    id: 'sp-layar-katalog',
    type: 'layar',
    title: 'Katalog Harga Acuan Harian iPhone',
    subtitle: 'Katalog & Media · Salin rentang harga Ex-iBox, New iBox, Inter',
    metaRight: 'Katalog Harga',
    hubId: 'katalog',
    segmentId: 'katalog_harga',
  },
];

const FICTIONAL_BERANDA_DASHBOARD: BerandaDashboardDTO = {
  bannerGreetingPrefix: 'Halo',
  bannerHeadline: 'Antrean hari ini belum disusun.',
  bannerSubtitle: 'Tingkatkan konversi dengan follow up cepat dan personal.',
  bannerCtaLabel: 'Lihat Rekomendasi Toko',
  bannerTargetHub: 'akuisisi',
  bannerTargetSegment: 'antrean_hari_ini',
  monthlyTarget: {
    label: 'Target Bulan Ini',
    targetCount: 25,
    unitLabel: 'Reseller',
    achievedCount: 5,
    achievedPercentLabel: '(20% tercapai)',
  },
  kpiCards: [
    {
      id: 'kpi-new-today',
      label: 'Toko Baru Hari Ini',
      numericValue: 12,
      deltaLabel: '+4 dari kemarin',
      iconType: 'new-shop',
      tone: 'success',
      targetHub: 'database',
      targetSegment: 'semua_toko',
    },
    {
      id: 'kpi-contacted',
      label: 'Total Toko Dihubungi',
      numericValue: 48,
      deltaLabel: '14 hari ini',
      iconType: 'contacted',
      tone: 'accent',
      targetHub: 'akuisisi',
      targetSegment: 'antrean_hari_ini',
    },
    {
      id: 'kpi-positive-reply',
      label: 'Respon Positif',
      numericValue: 9,
      deltaLabel: '18,8% dari yang dihubungi',
      iconType: 'positive-reply',
      tone: 'warning',
      targetHub: 'inbox',
      targetSegment: 'inbox_workspace',
    },
    {
      id: 'kpi-active-reseller',
      label: 'Reseller Aktif',
      numericValue: 5,
      deltaLabel: '+2 bulan ini',
      iconType: 'active-reseller',
      tone: 'accent',
      targetHub: 'database',
      targetSegment: 'reseller_aktif',
    },
  ],
  regionalSummary: {
    title: 'Sebaran Toko & Potensi Reseller',
    subtitle: 'Peta sebaran toko yang sudah dihubungi dan yang berpotensi menjadi reseller.',
    openMapLabel: 'Buka peta lengkap',
    legendLowLabel: 'Sedikit',
    legendHighLabel: 'Banyak',
    legendRangeLabel: '(180 - 11.420)',
    islands: [
      {
        id: 'reg-jawa',
        islandName: 'Jawa',
        totalShops: 11420,
        potentialShops: 11385,
        contactedShops: 31,
        activeResellers: 3,
        densityLevel: 5,
        topProvincesSummary: 'Jawa Timur, Jawa Barat, DKI Jakarta, Jawa Tengah',
        svgAnchorX: 395,
        svgAnchorY: 328,
      },
      {
        id: 'reg-sumatera',
        islandName: 'Sumatera',
        totalShops: 4680,
        potentialShops: 4668,
        contactedShops: 9,
        activeResellers: 1,
        densityLevel: 4,
        topProvincesSummary: 'Sumatera Utara, Riau, Sumatera Selatan, Sumatera Barat',
        svgAnchorX: 165,
        svgAnchorY: 225,
      },
      {
        id: 'reg-sulawesi',
        islandName: 'Sulawesi',
        totalShops: 1520,
        potentialShops: 1516,
        contactedShops: 4,
        activeResellers: 0,
        densityLevel: 3,
        topProvincesSummary: 'Sulawesi Selatan, Sulawesi Utara, Sulawesi Tengah',
        svgAnchorX: 625,
        svgAnchorY: 215,
      },
      {
        id: 'reg-kalimantan',
        islandName: 'Kalimantan',
        totalShops: 1240,
        potentialShops: 1238,
        contactedShops: 2,
        activeResellers: 0,
        densityLevel: 3,
        topProvincesSummary: 'Kalimantan Timur, Kalimantan Selatan, Kalimantan Barat',
        svgAnchorX: 435,
        svgAnchorY: 165,
      },
      {
        id: 'reg-balinusa',
        islandName: 'Bali & Nusa Tenggara',
        totalShops: 980,
        potentialShops: 977,
        contactedShops: 2,
        activeResellers: 1,
        densityLevel: 2,
        topProvincesSummary: 'Bali, Nusa Tenggara Barat, Nusa Tenggara Timur',
        svgAnchorX: 545,
        svgAnchorY: 352,
      },
      {
        id: 'reg-malukupapua',
        islandName: 'Maluku & Papua',
        totalShops: 180,
        potentialShops: 180,
        contactedShops: 0,
        activeResellers: 0,
        densityLevel: 1,
        topProvincesSummary: 'Papua, Papua Barat, Maluku, Maluku Utara',
        svgAnchorX: 835,
        svgAnchorY: 255,
      },
    ],
  },
};

const FICTIONAL_INBOX_WORKSPACE: HunterInboxWorkspaceDTO = {
  workspaceTitle: 'Hunter Chat Workspace',
  activeSessionsStatusPill: '2 Nomor Aktif · Live API',
  sessions: [
    { id: 'all', label: 'Semua Sesi (2 Nomor)' },
    { id: 'session-01', label: 'WABA Hub Nusantara (+62 811-9400-2101)' },
    { id: 'session-02', label: 'Sesi Sales 02 (+62 812-8800-3402)' },
  ],
  spintaxTemplates: [
    {
      id: 'sp-01',
      label: 'Sapaan Kemitraan Grosir Ex-iBox',
      category: 'Sapaan Awal',
      body: 'Halo Kak {Hendra|Bosku}, salam kenal dari tim grosir Nusantara Gadget. Kami lihat counter Kakak aktif stok iPhone second resmi. Boleh kami kirimkan daftar harga acuan reseller Ex-iBox hari ini?',
    },
    {
      id: 'sp-02',
      label: 'Konfirmasi Garansi & QC Fungsi 3uTools',
      category: 'Edukasi Kualitas',
      body: 'Siap Kak, seluruh unit Ex-iBox dan Inter kami sudah lolos QC 3uTools hijau semua, Face ID & True Tone aman, serta bergaransi retur tukar unit 7 hari sejak barang diterima.',
    },
    {
      id: 'sp-03',
      label: 'Ajakan Registrasi Reseller RG ERP',
      category: 'Kualifikasi KYC',
      body: 'Untuk mengunci harga grosir mitra dan akses stok harian di sistem RG ERP, mohon dibantu lampirkan Foto KTP Pemilik dan Foto Tampak Depan Toko ya Kak.',
    },
  ],
  referencePriceSnippets: [
    {
      id: 'pr-11-128',
      modelName: 'iPhone 11 128GB',
      variantLabel: 'Ex-iBox',
      priceRangeLabel: 'Rp 4.200.000 - Rp 4.500.000',
      formattedWhatsAppText:
        '📱 *iPhone 11 128GB* (Ex-iBox)\nEstimasi Grosir Reseller: Rp 4.200.000 - Rp 4.500.000\n_Catatan: Harga acuan harian, stok unit & IMEI dikonfirmasi via RG ERP._',
    },
    {
      id: 'pr-13-128',
      modelName: 'iPhone 13 128GB',
      variantLabel: 'Ex-iBox',
      priceRangeLabel: 'Rp 7.450.000 - Rp 7.800.000',
      formattedWhatsAppText:
        '📱 *iPhone 13 128GB* (Ex-iBox)\nEstimasi Grosir Reseller: Rp 7.450.000 - Rp 7.800.000\n_Catatan: Harga acuan harian, stok unit & IMEI dikonfirmasi via RG ERP._',
    },
    {
      id: 'pr-15-128-new',
      modelName: 'iPhone 15 128GB',
      variantLabel: 'New iBox',
      priceRangeLabel: 'Rp 11.850.000 - Rp 12.150.000',
      formattedWhatsAppText:
        '📱 *iPhone 15 128GB* (New iBox)\nEstimasi Grosir Reseller: Rp 11.850.000 - Rp 12.150.000\n_Catatan: Harga acuan harian, stok unit & IMEI dikonfirmasi via RG ERP._',
    },
  ],
  promoMediaPresets: [
    {
      id: 'med-01',
      title: 'Katalog Grosir Mingguan Ex-iBox Okt 2026.pdf',
      fileName: 'Katalog_Grosir_Mingguan_Ex_iBox_Okt_2026.pdf',
      categoryLabel: 'Pricelist Harian Reseller',
      fileSizeLabel: '340 KB · Terkompresi WA Hash',
      captionText:
        '📄 *[TERLAMPIR] Katalog Grosir Mingguan Ex-iBox Okt 2026.pdf*\nBerikut daftar harga acuan grosir khusus mitra toko counter minggu ini Kak.',
    },
    {
      id: 'med-02',
      title: 'Brosur Program Titip Konsinyasi Mitra Tier A.pdf',
      fileName: 'Brosur_Program_Titip_Konsinyasi_Tier_A.pdf',
      categoryLabel: 'Brosur Program Titip Konsinyasi',
      fileSizeLabel: '415 KB · Terkompresi WA Hash',
      captionText:
        '📄 *[TERLAMPIR] Brosur Program Titip Konsinyasi Mitra Tier A.pdf*\nDetail syarat dan kuota program konsinyasi toko Tier A di sistem RG ERP.',
    },
  ],
  systemBoundaryCard: {
    title: 'Batas Sistem Olivia 1.2 SDR',
    description:
      'Olivia 1.2 fokus pada kualifikasi prospek baru. Setelah toko siap order rutin, klik Ajukan Reseller ke RG ERP untuk verifikasi KYC (Foto KTP & Foto Toko).',
  },
  threads: [
    {
      id: 'thr-101',
      leadIdNumber: 140821,
      shopName: 'Cahaya Gadget Sentosa',
      avatarInitial: 'C',
      picName: 'Hendra Wijaya',
      whatsappNumber: '6281194007712',
      city: 'Kota Surabaya',
      province: 'Jawa Timur',
      fullAddress: 'Plaza Marina Lt. 2 Blok C-14, Wonocolo, Surabaya',
      googleMapsUrl: 'https://maps.google.com/?q=Plaza+Marina+Surabaya+Blok+C14',
      instagramHandle: '@cahayagadget.sby',
      filterCategory: 'sales',
      handlerBadgeLabel: 'Dipegang Sales',
      funnelStageBadge: 'Diskusi Aktif (WARM_TALKING)',
      priorityScore: 84,
      waSessionId: 'session-01',
      waSessionLabel: 'WABA Hub Nusantara (6281194002101)',
      cycleStatusLabel: 'Ditangani manusia',
      lastMessageTimestamp: '09:12',
      lastMessagePreview: '📱 *iPhone 11 128GB* (Ex-iBox) Estimasi Grosir Reseller: Rp 4.200.000...',
      unreadCount: 1,
      defaultFocusCategory: 'Ex-iBox (Second Resmi)',
      defaultProductInterests: ['Ex-iBox', 'New iBox'],
      defaultWeeklyPotentialUnits: 6,
      defaultHandoverNote: 'Prospek siap order rutin mingguan 5-8 unit seri iPhone 11 & 13 Ex-iBox, lokasi counter ramai di Plaza Marina.',
      erpDuplicateCheck: {
        checkedAtWib: '29 Okt 09.05 WIB',
        isDuplicate: false,
        statusMessage: 'Nomor +62 811-9400-7712 belum terdaftar di RG ERP. Aman diajukan.',
      },
      cognitiveMemory: {
        funnelStageCode: 'WARM_TALKING',
        picName: 'Hendra Wijaya (Owner)',
        counterProfile: 'Counter etalase 2 ruko di pusat perbelanjaan HP Surabaya Selatan.',
        preferredSeries: 'iPhone 11 128GB, iPhone 12 128GB, iPhone 13 128GB (Ex-iBox)',
        budgetRange: 'Rp 25.000.000 – Rp 40.000.000 / minggu',
        tabooNotes: 'Tidak menerima unit layar gantian atau baterai servisan.',
        dealHistorySummary: 'Prospek baru, belum pernah transaksi di RG ERP.',
        conversationSummary: 'Responsif terhadap penawaran harga grosir dan meminta daftar harga acuan harian.',
      },
      messages: [
        {
          id: 'm-101-1',
          senderType: 'sales',
          senderLabel: 'Hunter SDR',
          body: 'Halo Kak Hendra, salam kenal dari tim kemitraan grosir Nusantara Gadget. Apakah untuk counter Cahaya Gadget Sentosa sedang butuh tambahan stok iPhone Ex-iBox minggu ini?',
          timestampWib: '29 Okt 08.45',
        },
        {
          id: 'm-101-2',
          senderType: 'shop',
          senderLabel: 'Cahaya Gadget Sentosa',
          body: 'Halo kak, boleh info syarat kemitraan grosir dan harga iPhone 11 128GB Ex-iBox kalau ambil 5 unit?',
          timestampWib: '29 Okt 08.52',
        },
        {
          id: 'm-101-3',
          senderType: 'sales',
          senderLabel: 'Hunter SDR',
          body: 'Siap Kak Hendra, untuk pengambilan rutin minimal 5 unit langsung dapat harga tier reseller kami beserta garansi tukar unit 7 hari.',
          timestampWib: '29 Okt 09.01',
        },
        {
          id: 'm-101-4',
          senderType: 'shop',
          senderLabel: 'Cahaya Gadget Sentosa',
          body: 'Mantap kak, boleh kirimkan estimasi harganya dulu?',
          timestampWib: '29 Okt 09.08',
        },
        {
          id: 'm-101-5',
          senderType: 'sales',
          senderLabel: 'Hunter SDR',
          body: '📱 *iPhone 11 128GB* (Ex-iBox)\nEstimasi Grosir Reseller: Rp 4.200.000 - Rp 4.500.000\n_Catatan: Harga acuan harian, stok unit & IMEI dikonfirmasi via RG ERP._',
          timestampWib: '29 Okt 09.12',
        },
      ],
    },
    {
      id: 'thr-102',
      leadIdNumber: 140855,
      shopName: 'Mentari Seluler Mandiri',
      avatarInitial: 'M',
      picName: 'Dian Kurniawan',
      whatsappNumber: '6281288005519',
      city: 'Kota Bandung',
      province: 'Jawa Barat',
      fullAddress: 'BEC Mall Lt. LU Blok F-08, Jl. Purnawarman, Bandung',
      googleMapsUrl: 'https://maps.google.com/?q=BEC+Bandung+Blok+F08',
      instagramHandle: '@mentariseluler.bdg',
      filterCategory: 'eskalasi',
      handlerBadgeLabel: 'Eskalasi AI',
      funnelStageBadge: 'Negosiasi Kuota (HOT_LEAD)',
      priorityScore: 91,
      waSessionId: 'session-01',
      waSessionLabel: 'WABA Hub Nusantara (6281194002101)',
      cycleStatusLabel: 'Menunggu Ambil Alih',
      lastMessageTimestamp: '08:58',
      lastMessagePreview: 'Kalau pengajuan program konsinyasi untuk toko Tier A syarat dokumennya apa saja kak?',
      unreadCount: 2,
      defaultFocusCategory: 'Ex-iBox (Second Resmi)',
      defaultProductInterests: ['Ex-iBox', 'New iBox', 'Inter'],
      defaultWeeklyPotentialUnits: 10,
      defaultHandoverNote: 'Toko besar di BEC Bandung, tertarik program konsinyasi dan order grosir 10 unit/minggu.',
      erpDuplicateCheck: {
        checkedAtWib: '29 Okt 08.59 WIB',
        isDuplicate: false,
        statusMessage: 'Nomor +62 812-8800-5519 belum terdaftar di RG ERP. Aman diajukan.',
      },
      cognitiveMemory: {
        funnelStageCode: 'HOT_LEAD',
        picName: 'Dian Kurniawan (Pemilik)',
        counterProfile: 'Toko utama di BEC Bandung, fokus jual beli iPhone second & baru.',
        preferredSeries: 'iPhone 13 Pro 256GB & iPhone 14 128GB (Ex-iBox / New iBox)',
        budgetRange: 'Rp 50.000.000 – Rp 85.000.000 / minggu',
        tabooNotes: 'Minta pengiriman berasuransi penuh via ekspedisi kilat.',
        dealHistorySummary: 'Siap registrasi KYC ke RG ERP hari ini.',
        conversationSummary: 'AI mendeteksi niat beli tinggi (permintaan syarat konsinyasi) dan melakukan eskalasi ke Sales.',
      },
      messages: [
        {
          id: 'm-102-1',
          senderType: 'ai',
          senderLabel: 'Asisten AI Olivia',
          body: 'Selamat pagi Kak Dian dari Mentari Seluler Mandiri. Kami menyediakan suplai iPhone Ex-iBox & New iBox bergaransi untuk mitra toko di Bandung.',
          timestampWib: '29 Okt 08.30',
        },
        {
          id: 'm-102-2',
          senderType: 'shop',
          senderLabel: 'Mentari Seluler Mandiri',
          body: 'Pagi kak, kebetulan kami lagi cari supplier tetap untuk seri 13 dan 14. Kalau pengajuan program konsinyasi untuk toko Tier A syarat dokumennya apa saja kak?',
          timestampWib: '29 Okt 08.58',
        },
      ],
    },
    {
      id: 'thr-103',
      leadIdNumber: 140902,
      shopName: 'Dirgantara Ponsel Utama',
      avatarInitial: 'D',
      picName: 'Taufik Hidayat',
      whatsappNumber: '6281362004418',
      city: 'Kota Medan',
      province: 'Sumatera Utara',
      fullAddress: 'Plaza Millenium Lt. 1 No. 22, Jl. Kapten Muslim, Medan',
      googleMapsUrl: 'https://maps.google.com/?q=Plaza+Millenium+Medan',
      instagramHandle: '@dirgantaraponsel.mdn',
      filterCategory: 'sales',
      handlerBadgeLabel: 'Dipegang Sales',
      funnelStageBadge: 'Prospek Kualifikasi (QUALIFIED)',
      priorityScore: 78,
      waSessionId: 'session-02',
      waSessionLabel: 'Sesi Sales 02 (6281288003402)',
      cycleStatusLabel: 'Ditangani manusia',
      lastMessageTimestamp: 'Kemarin',
      lastMessagePreview: 'Foto KTP dan foto depan counter sudah saya siapkan kak, tinggal kirim ya.',
      unreadCount: 0,
      defaultFocusCategory: 'Inter (All Operator)',
      defaultProductInterests: ['Inter', 'Ex-iBox'],
      defaultWeeklyPotentialUnits: 5,
      defaultHandoverNote: 'Mitra potensial di Plaza Millenium Medan, fokus unit Inter IMEI terdaftar Bea Cukai & Ex-iBox.',
      erpDuplicateCheck: {
        checkedAtWib: '28 Okt 17.20 WIB',
        isDuplicate: false,
        statusMessage: 'Nomor +62 813-6200-4418 belum terdaftar di RG ERP. Aman diajukan.',
      },
      cognitiveMemory: {
        funnelStageCode: 'QUALIFIED',
        picName: 'Taufik Hidayat (Owner)',
        counterProfile: 'Counter aktif di Plaza Millenium Medan sejak 2021.',
        preferredSeries: 'iPhone 12 128GB & iPhone 13 128GB',
        budgetRange: 'Rp 20.000.000 – Rp 35.000.000 / minggu',
        tabooNotes: 'Wajib IMEI aman permanen.',
        dealHistorySummary: 'Menunggu pengajuan ke antrean Handover RG ERP.',
        conversationSummary: 'Pemilik toko sudah setuju syarat kemitraan dan siap unggah dokumen KYC.',
      },
      messages: [
        {
          id: 'm-103-1',
          senderType: 'sales',
          senderLabel: 'Hunter SDR',
          body: 'Baik Kak Taufik, untuk proses pendaftaran mitra resmi di RG ERP mohon dibantu Foto KTP Pemilik dan Foto Tampak Depan Toko ya.',
          timestampWib: '28 Okt 16.40',
        },
        {
          id: 'm-103-2',
          senderType: 'shop',
          senderLabel: 'Dirgantara Ponsel Utama',
          body: 'Foto KTP dan foto depan counter sudah saya siapkan kak, tinggal kirim ya.',
          timestampWib: '28 Okt 17.15',
        },
      ],
    },
    {
      id: 'thr-104',
      leadIdNumber: 140940,
      shopName: 'Samudra iStore Counter',
      avatarInitial: 'S',
      picName: 'Fajar Ramadhan',
      whatsappNumber: '6281153008821',
      city: 'Kota Makassar',
      province: 'Sulawesi Selatan',
      fullAddress: 'MTC Karebosi Lt. 2 Blok B-05, Jl. Ahmad Yani, Makassar',
      googleMapsUrl: 'https://maps.google.com/?q=MTC+Karebosi+Makassar',
      instagramHandle: '@samudraistore.mks',
      filterCategory: 'ai',
      handlerBadgeLabel: 'Dijawab AI',
      funnelStageBadge: 'Sapaan Awal (COLD_TOUCHED)',
      priorityScore: 72,
      waSessionId: 'session-02',
      waSessionLabel: 'Sesi Sales 02 (6281288003402)',
      cycleStatusLabel: 'Otomatisasi AI',
      lastMessageTimestamp: 'Kemarin',
      lastMessagePreview: 'Boleh kak, coba kirim pricelist iPhone 12 dan 13 dulu untuk saya pelajari.',
      unreadCount: 0,
      defaultFocusCategory: 'Ex-iBox (Second Resmi)',
      defaultProductInterests: ['Ex-iBox'],
      defaultWeeklyPotentialUnits: 4,
      defaultHandoverNote: 'Prospek di MTC Karebosi Makassar, sedang mempelajari harga acuan mingguan.',
      erpDuplicateCheck: {
        checkedAtWib: '28 Okt 15.10 WIB',
        isDuplicate: false,
        statusMessage: 'Nomor +62 811-5300-8821 belum terdaftar di RG ERP.',
      },
      cognitiveMemory: {
        funnelStageCode: 'COLD_TOUCHED',
        picName: 'Fajar Ramadhan',
        counterProfile: 'Counter ritel di MTC Karebosi Makassar.',
        preferredSeries: 'iPhone 12 64GB/128GB Ex-iBox',
        budgetRange: 'Belum terdeteksi',
        tabooNotes: 'Belum ada catatan pantangan.',
        dealHistorySummary: 'Tahap perkenalan katalog.',
        conversationSummary: 'Meminta katalog harga untuk dibandingkan dengan supplier lokal.',
      },
      messages: [
        {
          id: 'm-104-1',
          senderType: 'ai',
          senderLabel: 'Asisten AI Olivia',
          body: 'Halo Kak Fajar di Samudra iStore Counter Makassar. Kami distributor iPhone Ex-iBox siap kirim ke seluruh Sulawesi dengan garansi tukar unit.',
          timestampWib: '28 Okt 14.20',
        },
        {
          id: 'm-104-2',
          senderType: 'shop',
          senderLabel: 'Samudra iStore Counter',
          body: 'Boleh kak, coba kirim pricelist iPhone 12 dan 13 dulu untuk saya pelajari.',
          timestampWib: '28 Okt 14.55',
        },
      ],
    },
  ],
};

/* ============================================================================
 * PURE ASYNC API FUNCTIONS (Simulating Go REST/JSON Endpoints)
 * ============================================================================ */

/**
 * Simulated Go Backend REST Call: GET /api/v1/shell/bootstrap
 */
export async function fetchShellBootstrap(
  simState: AsyncSimState = 'success'
): Promise<ShellBootstrapResponseDTO> {
  if (simState === 'loading') {
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  if (simState === 'error') {
    throw new Error('Gagal memuat konfigurasi sesi dari server Go API (:8080). Periksa sambungan jaringan.');
  }

  return {
    loginConfig: {
      appName: 'Olivia CRM',
      appTagline: 'Unified Omnichannel CRM & Sales Outbound',
      googleButtonLabel: 'Masuk dengan Google',
      whitelistNotice: 'Hanya email tim yang terdaftar di sistem yang dapat mengakses CRM.',
      devModeButtonLabel: 'Masuk mode pengembang',
      availableOperators: [FICTIONAL_OPERATORS.admin, FICTIONAL_OPERATORS.sales_crm],
    },
    operators: FICTIONAL_OPERATORS,
    runtimeStatus: {
      apiEndpointLabel: 'API :8080 Live',
      dbEngineLabel: 'PostgreSQL',
      dbHealthy: true,
      aiEmergencyKillSwitchActive: true,
      aiStatusLabel: 'AI Dimatikan',
      wibFormattedTimestamp: 'Kam, 29 Okt 2026 · 09.15 WIB',
      activeWaSessionsCount: 2,
      totalWaSessionsCount: 12,
      circuitBreakerLabel: 'Circuit Breaker: Normal',
    },
    navigationHubs:
      simState === 'empty'
        ? NAVIGATION_HUBS.map((h) => ({ ...h, badgeCount: 0 }))
        : NAVIGATION_HUBS,
    notifications: simState === 'empty' ? [] : FICTIONAL_NOTIFICATIONS,
    spotlightIndex: simState === 'empty' ? [] : FICTIONAL_SPOTLIGHT_INDEX,
  };
}

/**
 * Simulated Go Backend REST Call: GET /api/v1/dashboard/beranda
 */
export async function fetchBerandaDashboard(
  simState: AsyncSimState = 'success'
): Promise<BerandaDashboardDTO> {
  await new Promise((resolve) => setTimeout(resolve, 140));

  if (simState === 'error') {
    throw new Error('Gagal memuat ringkasan Beranda dari endpoint /api/v1/dashboard/beranda.');
  }

  if (simState === 'empty') {
    return {
      ...FICTIONAL_BERANDA_DASHBOARD,
      monthlyTarget: {
        ...FICTIONAL_BERANDA_DASHBOARD.monthlyTarget,
        achievedCount: 0,
        achievedPercentLabel: '(0% tercapai)',
      },
      kpiCards: FICTIONAL_BERANDA_DASHBOARD.kpiCards.map((c) => ({
        ...c,
        numericValue: 0,
        deltaLabel: '0 hari ini',
      })),
      regionalSummary: {
        ...FICTIONAL_BERANDA_DASHBOARD.regionalSummary,
        islands: [],
      },
    };
  }

  return FICTIONAL_BERANDA_DASHBOARD;
}

/**
 * Simulated Go Backend REST Call: GET /api/v1/inbox/workspace
 */
export async function fetchHunterInboxWorkspace(
  simState: AsyncSimState = 'success'
): Promise<HunterInboxWorkspaceDTO> {
  await new Promise((resolve) => setTimeout(resolve, 160));

  if (simState === 'error') {
    throw new Error('Gagal memuat percakapan Hunter Chat dari endpoint /api/v1/inbox/workspace.');
  }

  if (simState === 'empty') {
    return {
      ...FICTIONAL_INBOX_WORKSPACE,
      threads: [],
    };
  }

  return FICTIONAL_INBOX_WORKSPACE;
}

/**
 * Simulated Go Backend REST Call: POST /api/v1/erp/handover-gate
 */
export async function submitResellerHandoverToErp(
  payload: HandoverSubmissionPayloadDTO,
  simulateNetworkError = false
): Promise<HandoverSubmissionReceiptDTO> {
  await new Promise((resolve) => setTimeout(resolve, 320));

  if (simulateNetworkError) {
    throw new Error(
      'Gagal mengirim pengajuan ke gerbang RG ERP (:8080/api/v1/erp/handover-gate). Waktu tunggu habis atau layanan sibuk.'
    );
  }

  const ktpKb = payload.ktpPhoto
    ? Math.min(480, Math.max(120, Math.round(payload.ktpPhoto.fileSizeBytes / 1024)))
    : 280;
  const shopKb = payload.shopFrontPhoto
    ? Math.min(490, Math.max(145, Math.round(payload.shopFrontPhoto.fileSizeBytes / 1024)))
    : 310;

  return {
    erpHandoverId: `ERP-HO-2026-${String(Math.floor(1000 + Math.random() * 8999))}`,
    submittedAtWib: '29 Okt 2026 · 09.18 WIB',
    shopName: payload.shopName.trim(),
    whatsappNumber: payload.whatsappNumber.trim(),
    statusCode: 'MENUNGGU_VERIFIKASI_OWNER',
    statusLabel: 'Menunggu Verifikasi KYC Owner RG ERP',
    compressedKtpSizeKb: ktpKb,
    compressedShopPhotoSizeKb: shopKb,
  };
}

/* ============================================================================
 * STAGE 2 TYPED DTOs: "AKUISISI & ANTREAN" HUB (5 SEGMENTS + DIALOGS d02 & d04)
 * ============================================================================ */

// 1. Antrean Hari Ini (`06-antrean-hari-ini`) + Dialog `d04` (`d04-dialog-tambah-nomor`)
export type QueueItemStatus = 'pending' | 'sent' | 'disqualified';

export interface DailyQueueShopItemDTO {
  id: string;
  leadIdNumber: number;
  shopName: string;
  picName: string;
  city: string;
  province: string;
  fullAddress: string;
  tier: 'Tier A' | 'Tier B';
  score: number;
  whatsappNumber: string;
  antiReportLineLabel: 'Anti-Report Baris 1' | 'Anti-Report Baris 2';
  waSessionId: string;
  waSessionLabel: string;
  spintaxGreetingPreview: string;
  status: QueueItemStatus;
}

export interface AddNumberWarningDialogConfigDTO {
  title: string;
  subtitle: string;
  warnings: string[];
  confirmQuestion: string;
  cancelLabel: string;
  confirmLabel: string;
}

export interface AntreanHariIniViewDTO {
  title: string;
  subtitlePrefix: string;
  activeNumbersCount: number;
  maxNumbersCapacity: number;
  needsInspectionCount: number;
  needsInspectionLabel: string;
  circuitBreakerText: string;
  circuitBreakerStatusLabel: string;
  sessions: WaSessionOptionDTO[];
  addNumberWarningDialog: AddNumberWarningDialogConfigDTO;
  items: DailyQueueShopItemDTO[];
}

// 2. Radar Toko HP (`03-radar-toko-hp`)
export type RadarSdrStatusCode =
  | 'UNTOUCHED'
  | 'TOUCHED'
  | 'WARM_TALKING'
  | 'HANDOVER_PENDING'
  | 'GRADUATED_ERP';

export type RadarCategoryFilterOption =
  | 'Semua Kategori'
  | 'Ex-iBox (Second Resmi)'
  | 'New iBox (Segel Resmi)'
  | 'Inter (All Operator)';

export type RadarStatusFilterOption =
  | 'Semua Status'
  | 'Belum Disapa'
  | 'Sudah Disapa'
  | 'Diskusi Aktif'
  | 'Menunggu ACC ERP'
  | 'Reseller RG ERP';

export interface RadarProspectRowDTO {
  id: string;
  leadIdNumber: number;
  shopName: string;
  picName: string;
  tierLabel: 'Tier A' | 'Tier B' | 'Tier X';
  city: string;
  province: string;
  fullAddress: string;
  googleMapsUrl: string;
  instagramHandle: string;
  whatsappNumber: string;
  focusCategoryShort: 'Ex-iBox' | 'New iBox' | 'Inter';
  focusCategoryFull: PrimaryFocusCategoryOption;
  sdrStatusCode: RadarSdrStatusCode;
  sdrStatusLabel:
    | 'Belum Disapa'
    | 'Sudah Disapa'
    | 'Diskusi Aktif'
    | 'Menunggu ACC ERP'
    | 'Reseller RG ERP';
  weeklyPotentialUnits: number;
  erpCheckStatus?: ErpDuplicateCheckDTO;
  spintaxSentAtWib?: string;
}

export interface RadarTokoViewDTO {
  headerBadgeTitle: string;
  totalBankDataCount: number;
  duplicateCheckerTitle: string;
  duplicateCheckerSubtitle: string;
  availableCities: string[];
  categoryFilterOptions: RadarCategoryFilterOption[];
  statusFilterOptions: RadarStatusFilterOption[];
  prospects: RadarProspectRowDTO[];
}

// 3. Jadwal Tindak Lanjut (`07-tindak-lanjut-terbuka`) + Dialog `d02` (`d02-dialog-tindak-lanjut`)
export type FollowUpStatusCode = 'MENUNGGU' | 'DITEPATI';

export interface FollowUpCommitmentRowDTO {
  id: string;
  commitmentNumber: number;
  leadIdNumber: number;
  shopName: string;
  city: string;
  whatsappNumber: string;
  isNoDeadline: boolean;
  dueDateIso: string; // e.g. '2026-10-29' or '' when isNoDeadline
  dueDateDisplay: string; // e.g. 'Tanpa tenggat' or '29/10/2026 · 14.00 WIB'
  topic: string;
  status: FollowUpStatusCode;
  overdueWarningBadge?: string; // e.g. 'Terbuka lebih dari 14 hari' or 'Jatuh tempo hari ini'
  completedAtWib?: string;
}

export interface CreateFollowUpPayloadDTO {
  leadIdNumber: number;
  shopName?: string;
  isNoDeadline: boolean;
  dueDateIso: string;
  dueTimeWib: string;
  topic: string;
}

export interface LeadLookupOptionDTO {
  leadIdNumber: number;
  shopName: string;
  city: string;
  whatsappNumber: string;
}

export interface JadwalTindakLanjutViewDTO {
  title: string;
  helperNotice: string;
  commitments: FollowUpCommitmentRowDTO[];
  leadLookupOptions: LeadLookupOptionDTO[];
}

// 4. Ketepatan Waktu SLA (`07b-tindak-lanjut-sla`)
export interface SlaOperatorMetricDTO {
  id: string;
  operatorName: string;
  waSessionLabel: string;
  totalAssigned: number;
  completedOnTime: number;
  overdueWarningCount: number;
  onTimeRatePercent: number;
  avgResponseMinutes: number;
}

export interface KetepatanWaktuSlaViewDTO {
  title: string;
  subtitle: string;
  overallOnTimePercent: number;
  avgLeadTimeLabel: string;
  warningEscalatedCount: number;
  activeCommitmentsCount: number;
  serverMetricEndpointNoticeTitle: string;
  serverMetricEndpointNoticeBody: string;
  automationRulesTitle: string;
  automationRules: string[];
  operatorMetrics: SlaOperatorMetricDTO[];
}

// 5. Antrean Handover ERP (`04-handover-erp`)
export type HandoverErpStatusCode = 'HANDOVER_PENDING' | 'GRADUATED_TO_ERP';

export interface HandoverQueueRowDTO {
  id: string;
  erpHandoverId: string;
  leadIdNumber: number;
  shopName: string;
  picName: string;
  city: string;
  province: string;
  fullAddress: string;
  googleMapsUrl: string;
  instagramHandle: string;
  whatsappNumber: string;
  focusCategory: PrimaryFocusCategoryOption;
  productInterests: ProductCategoryOption[];
  weeklyPotentialUnits: number;
  statusCode: HandoverErpStatusCode;
  statusLabel: 'Menunggu ACC ERP' | 'Lulus ke RG ERP';
  submittedAtWib: string;
  ktpSizeKb: number;
  shopPhotoSizeKb: number;
  salesQualificationNote: string;
}

export interface AntreanHandoverErpViewDTO {
  title: string;
  subtitle: string;
  kpiTotalSubmissions: number;
  kpiPendingVerification: number;
  kpiGraduatedActive: number;
  submissions: HandoverQueueRowDTO[];
}

export interface AkuisisiHubBundleDTO {
  antreanHariIni: AntreanHariIniViewDTO;
  radarToko: RadarTokoViewDTO;
  jadwalTindakLanjut: JadwalTindakLanjutViewDTO;
  ketepatanWaktuSla: KetepatanWaktuSlaViewDTO;
  antreanHandoverErp: AntreanHandoverErpViewDTO;
}

/* ============================================================================
 * 100% FICTIONAL STAGE 2 DATASETS (Fictional Shop Names, PICs, Phone Numbers)
 * ============================================================================ */

const FICTIONAL_DAILY_QUEUE_ITEMS: DailyQueueShopItemDTO[] = [
  {
    id: 'q-01',
    leadIdNumber: 141001,
    shopName: 'Kencana Seluler Utama',
    picName: 'Arif Budiman',
    city: 'Kota Bandung',
    province: 'Jawa Barat',
    fullAddress: 'Jl. Purnawarman No. 15 Blok A-03, Bandung',
    tier: 'Tier A',
    score: 92,
    whatsappNumber: '+6281194010101',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Arif di Kencana Seluler Utama Bandung, izin berbagi katalog harga grosir iPhone Ex-iBox hari ini ya Kak.',
    status: 'pending',
  },
  {
    id: 'q-02',
    leadIdNumber: 141002,
    shopName: 'Nusantara Phone Gallery',
    picName: 'Bambang Sutrisno',
    city: 'Kota Surabaya',
    province: 'Jawa Timur',
    fullAddress: 'Jl. Raya Darmo No. 88 Lt. 1, Surabaya',
    tier: 'Tier A',
    score: 90,
    whatsappNumber: '+6281288010202',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Selamat pagi Kak Bambang, salam kenal dari Nusantara Gadget. Apakah Nusantara Phone Gallery sedang cari suplai iPhone second resmi minggu ini?',
    status: 'pending',
  },
  {
    id: 'q-03',
    leadIdNumber: 141003,
    shopName: 'Garuda Ponsel Mandiri',
    picName: 'Chandra Gunawan',
    city: 'Kabupaten Sidoarjo',
    province: 'Jawa Timur',
    fullAddress: 'Jl. Gajah Mada No. 42, Sidoarjo',
    tier: 'Tier A',
    score: 88,
    whatsappNumber: '+6281377010303',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Bosku di Garuda Ponsel Mandiri Sidoarjo, kami ready stok grosir iPhone 11 s/d 15 Ex-iBox bergaransi retur 7 hari.',
    status: 'pending',
  },
  {
    id: 'q-04',
    leadIdNumber: 141004,
    shopName: 'Pelita Gadget Center',
    picName: 'Dedi Kurnia',
    city: 'Kota Semarang',
    province: 'Jawa Tengah',
    fullAddress: 'Simpang Lima Plaza Lt. 1 Blok D-11, Semarang',
    tier: 'Tier A',
    score: 86,
    whatsappNumber: '+6281194010404',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Salam kenal Kak Dedi Pelita Gadget Center, boleh kami kirimkan daftar harga acuan reseller iPhone hari ini?',
    status: 'pending',
  },
  {
    id: 'q-05',
    leadIdNumber: 141005,
    shopName: 'Surya iPhone Corner',
    picName: 'Eko Prasetyo',
    city: 'Kota Yogyakarta',
    province: 'DI Yogyakarta',
    fullAddress: 'Jl. Gejayan No. 27, Sleman, Yogyakarta',
    tier: 'Tier A',
    score: 85,
    whatsappNumber: '+6281288010505',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Halo Kak Eko di Surya iPhone Corner Jogja, kami ada program harga khusus mitra counter Tier A.',
    status: 'pending',
  },
  {
    id: 'q-06',
    leadIdNumber: 141006,
    shopName: 'Mahkota Cellular Raya',
    picName: 'Farhan Hakim',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    fullAddress: 'Jl. Soekarno Hatta No. 19, Malang',
    tier: 'Tier A',
    score: 84,
    whatsappNumber: '+6281377010606',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Pagi Kak Farhan Mahkota Cellular Raya, izin info update harga grosir iPhone 12 & 13 Ex-iBox lolos QC 3uTools.',
    status: 'pending',
  },
  {
    id: 'q-07',
    leadIdNumber: 141007,
    shopName: 'Andalas Telekomunikasi',
    picName: 'Gilang Saputra',
    city: 'Kota Padang',
    province: 'Sumatera Barat',
    fullAddress: 'Jl. Pemuda No. 54, Padang',
    tier: 'Tier A',
    score: 82,
    whatsappNumber: '+6281194010707',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Gilang Andalas Telekomunikasi Padang, kami siap suplai rutin iPhone Ex-iBox & Inter dengan asuransi pengiriman penuh.',
    status: 'pending',
  },
  {
    id: 'q-08',
    leadIdNumber: 141008,
    shopName: 'Prima iStore Bekasi',
    picName: 'Hadi Santoso',
    city: 'Kota Bekasi',
    province: 'Jawa Barat',
    fullAddress: 'Mega Bekasi Hypermall Lt. 1 No. 40, Bekasi',
    tier: 'Tier A',
    score: 81,
    whatsappNumber: '+6281288010808',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Halo Kak Hadi Prima iStore Bekasi, boleh kami lampirkan pricelist harian grosir iPhone Ex-iBox minggu ini?',
    status: 'pending',
  },
  {
    id: 'q-09',
    leadIdNumber: 141009,
    shopName: 'Khatulistiwa Gadget',
    picName: 'Indra Permana',
    city: 'Kota Pontianak',
    province: 'Kalimantan Barat',
    fullAddress: 'Jl. Gajah Mada No. 112, Pontianak',
    tier: 'Tier A',
    score: 79,
    whatsappNumber: '+6281377010909',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Selamat pagi Kak Indra di Khatulistiwa Gadget Pontianak, izin berbagi katalog kemitraan reseller Nusantara Gadget.',
    status: 'pending',
  },
  {
    id: 'q-10',
    leadIdNumber: 141010,
    shopName: 'Celebes Ponsel Sentral',
    picName: 'Joko Susilo',
    city: 'Kota Manado',
    province: 'Sulawesi Utara',
    fullAddress: 'IT Center Manado Lt. 2 Blok B-09, Manado',
    tier: 'Tier A',
    score: 78,
    whatsappNumber: '+6281194011010',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Halo Kak Joko Celebes Ponsel Sentral Manado, kami ada stok iPhone 13 & 14 Ex-iBox grade A siap kirim.',
    status: 'pending',
  },
  {
    id: 'q-11',
    leadIdNumber: 141011,
    shopName: 'Dewata Cellular Bali',
    picName: 'Kadek Suryawan',
    city: 'Kota Denpasar',
    province: 'Bali',
    fullAddress: 'Jl. Teuku Umar No. 108, Denpasar',
    tier: 'Tier A',
    score: 77,
    whatsappNumber: '+6281288011111',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Bli Kadek di Dewata Cellular Bali, izin kirim update harga grosir iPhone Ex-iBox & New iBox hari ini.',
    status: 'pending',
  },
  {
    id: 'q-12',
    leadIdNumber: 141012,
    shopName: 'Sriwijaya Phone Hub',
    picName: 'Lukman Hakim',
    city: 'Kota Palembang',
    province: 'Sumatera Selatan',
    fullAddress: 'Palembang Square Lt. 2 No. 18, Palembang',
    tier: 'Tier A',
    score: 76,
    whatsappNumber: '+6281377011212',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Pagi Kak Lukman Sriwijaya Phone Hub, apakah sedang butuh tambahan stok unit iPhone 11/12/13 minggu ini?',
    status: 'pending',
  },
  {
    id: 'q-13',
    leadIdNumber: 141013,
    shopName: 'Pasundan Gadget Store',
    picName: 'Maman Abdurrahman',
    city: 'Kota Bogor',
    province: 'Jawa Barat',
    fullAddress: 'Botani Square Lt. GF Blok C-04, Bogor',
    tier: 'Tier A',
    score: 75,
    whatsappNumber: '+6281194011313',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Maman Pasundan Gadget Store Bogor, kami tawarkan harga grosir khusus pengambilan minimal 5 unit.',
    status: 'pending',
  },
  {
    id: 'q-14',
    leadIdNumber: 141014,
    shopName: 'Borneo Smart Cellular',
    picName: 'Nanda Pratama',
    city: 'Kota Balikpapan',
    province: 'Kalimantan Timur',
    fullAddress: 'Rapak Plaza Lt. 1 No. 31, Balikpapan',
    tier: 'Tier A',
    score: 74,
    whatsappNumber: '+6281288011414',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Salam kenal Kak Nanda Borneo Smart Cellular, boleh kami kirimkan katalog harga acuan harian reseller?',
    status: 'pending',
  },
  {
    id: 'q-15',
    leadIdNumber: 141015,
    shopName: 'Cakrawala Ponsel',
    picName: 'Oki Setiawan',
    city: 'Kabupaten Sleman',
    province: 'DI Yogyakarta',
    fullAddress: 'Jl. Kaliurang KM 6.5 No. 41, Sleman',
    tier: 'Tier A',
    score: 73,
    whatsappNumber: '+6281377011515',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Oki Cakrawala Ponsel Sleman, izin info stok iPhone second resmi bergaransi tukar unit.',
    status: 'pending',
  },
  {
    id: 'q-16',
    leadIdNumber: 141016,
    shopName: 'Gemilang Counter HP',
    picName: 'Putra Mahendra',
    city: 'Kota Solo',
    province: 'Jawa Tengah',
    fullAddress: 'Singosaren Plaza Lt. 1 Blok A-19, Surakarta',
    tier: 'Tier B',
    score: 72,
    whatsappNumber: '+6281194011616',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Pagi Kak Putra Gemilang Counter HP Solo, berikut info kemitraan grosir Nusantara Gadget.',
    status: 'pending',
  },
  {
    id: 'q-17',
    leadIdNumber: 141017,
    shopName: 'Rinjani Gadget Lombok',
    picName: 'Qori Hidayatullah',
    city: 'Kota Mataram',
    province: 'Nusa Tenggara Barat',
    fullAddress: 'Jl. Pejanggik No. 63, Cakranegara, Mataram',
    tier: 'Tier B',
    score: 71,
    whatsappNumber: '+6281288011717',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Qori Rinjani Gadget Mataram, kami siap suplai iPhone Ex-iBox ke wilayah NTB.',
    status: 'pending',
  },
  {
    id: 'q-18',
    leadIdNumber: 141018,
    shopName: 'Tunas Harapan Seluler',
    picName: 'Rama Yudhistira',
    city: 'Kota Pekanbaru',
    province: 'Riau',
    fullAddress: 'Jl. Tuanku Tambusai No. 92, Pekanbaru',
    tier: 'Tier B',
    score: 70,
    whatsappNumber: '+6281377011818',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Selamat pagi Kak Rama Tunas Harapan Seluler Pekanbaru, izin kirim pricelist grosir iPhone hari ini.',
    status: 'pending',
  },
  {
    id: 'q-19',
    leadIdNumber: 141019,
    shopName: 'Lintas Media Ponsel',
    picName: 'Satria Wibowo',
    city: 'Kabupaten Gresik',
    province: 'Jawa Timur',
    fullAddress: 'Jl. Kartini No. 34, Gresik',
    tier: 'Tier B',
    score: 69,
    whatsappNumber: '+6281194011919',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Halo Kak Satria Lintas Media Ponsel Gresik, apakah tertarik melihat katalog harga acuan iPhone kami?',
    status: 'pending',
  },
  {
    id: 'q-20',
    leadIdNumber: 141020,
    shopName: 'Mutiara Timur Gadget',
    picName: 'Teguh Santoso',
    city: 'Kota Jayapura',
    province: 'Papua',
    fullAddress: 'Jl. Percetakan Negara No. 17, Jayapura',
    tier: 'Tier B',
    score: 68,
    whatsappNumber: '+6281288012020',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Halo Kak Teguh Mutiara Timur Gadget Jayapura, kami melayani pengiriman kargo udara berasuransi untuk mitra counter.',
    status: 'pending',
  },
  {
    id: 'q-21',
    leadIdNumber: 141021,
    shopName: 'Bima Sakti Cellular',
    picName: 'Umar Faruq',
    city: 'Kota Cirebon',
    province: 'Jawa Barat',
    fullAddress: 'Grage Mall Lt. 2 Blok E-12, Cirebon',
    tier: 'Tier B',
    score: 67,
    whatsappNumber: '+6281377012121',
    antiReportLineLabel: 'Anti-Report Baris 1',
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (+62 811-9400-2101)',
    spintaxGreetingPreview:
      'Salam kenal Kak Umar Bima Sakti Cellular Cirebon, izin berbagi info kemitraan reseller iPhone Ex-iBox.',
    status: 'pending',
  },
  {
    id: 'q-22',
    leadIdNumber: 141022,
    shopName: 'Puncak Jaya Phone',
    picName: 'Vino Bastian',
    city: 'Kota Tangerang',
    province: 'Banten',
    fullAddress: 'Tangcity Mall Lt. LG Blok B-21, Tangerang',
    tier: 'Tier B',
    score: 67,
    whatsappNumber: '+6281194012222',
    antiReportLineLabel: 'Anti-Report Baris 2',
    waSessionId: 'session-02',
    waSessionLabel: 'Sesi Sales 02 (+62 812-8800-3402)',
    spintaxGreetingPreview:
      'Halo Kak Vino Puncak Jaya Phone Tangerang, boleh kami kirimkan daftar harga acuan harian iPhone?',
    status: 'pending',
  },
];

const FICTIONAL_RADAR_PROSPECTS: RadarProspectRowDTO[] = [
  {
    id: 'rad-01',
    leadIdNumber: 150101,
    shopName: 'Sentosa Elektronik & Ponsel',
    picName: 'Ridwan Kamiludin',
    tierLabel: 'Tier A',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    fullAddress: 'Jl. Gatot Subroto No. 114, Medan Petisah, Kota Medan',
    googleMapsUrl: 'https://maps.google.com/?q=Medan+Petisah+Gatot+Subroto',
    instagramHandle: '@sentosaponsel.mdn',
    whatsappNumber: '+6281366001101',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'UNTOUCHED',
    sdrStatusLabel: 'Belum Disapa',
    weeklyPotentialUnits: 6,
  },
  {
    id: 'rad-02',
    leadIdNumber: 150102,
    shopName: 'Angkasa Putra Cellular',
    picName: 'Surya Darmawan',
    tierLabel: 'Tier A',
    city: 'Kota Jakarta Pusat',
    province: 'DKI Jakarta',
    fullAddress: 'ITC Roxy Mas Lt. 2 No. 48, Gambir, Jakarta Pusat',
    googleMapsUrl: 'https://maps.google.com/?q=ITC+Roxy+Mas+Jakarta',
    instagramHandle: '@angkasaputracell.jkt',
    whatsappNumber: '+6281190002202',
    focusCategoryShort: 'New iBox',
    focusCategoryFull: 'New iBox (Garansi Resmi)',
    sdrStatusCode: 'WARM_TALKING',
    sdrStatusLabel: 'Diskusi Aktif',
    weeklyPotentialUnits: 12,
  },
  {
    id: 'rad-03',
    leadIdNumber: 150103,
    shopName: 'Kharisma Gadget Store',
    picName: 'Yudi Hendrawan',
    tierLabel: 'Tier B',
    city: 'Kota Bandung',
    province: 'Jawa Barat',
    fullAddress: 'BEC Mall Lt. 1 Blok C-19, Kota Bandung',
    googleMapsUrl: 'https://maps.google.com/?q=BEC+Mall+Bandung',
    instagramHandle: '@kharismagadget.bdg',
    whatsappNumber: '+6281223003303',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'UNTOUCHED',
    sdrStatusLabel: 'Belum Disapa',
    weeklyPotentialUnits: 5,
  },
  {
    id: 'rad-04',
    leadIdNumber: 150104,
    shopName: 'Bintang Selatan Seluler',
    picName: 'Wawan Setiadi',
    tierLabel: 'Tier A',
    city: 'Kota Surabaya',
    province: 'Jawa Timur',
    fullAddress: 'WTC Surabaya Lt. 3 Ruang 312, Kota Surabaya',
    googleMapsUrl: 'https://maps.google.com/?q=WTC+Surabaya',
    instagramHandle: '@bintangselatancell.sby',
    whatsappNumber: '+6281331004404',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'TOUCHED',
    sdrStatusLabel: 'Sudah Disapa',
    weeklyPotentialUnits: 8,
  },
  {
    id: 'rad-05',
    leadIdNumber: 150105,
    shopName: 'Pandawa iPhone Point',
    picName: 'Guntur Prakoso',
    tierLabel: 'Tier B',
    city: 'Kota Semarang',
    province: 'Jawa Tengah',
    fullAddress: 'Plaza Simpang Lima Lt. 2 No. 14, Kota Semarang',
    googleMapsUrl: 'https://maps.google.com/?q=Plaza+Simpang+Lima+Semarang',
    instagramHandle: '@pandawaiphone.smg',
    whatsappNumber: '+6281225005505',
    focusCategoryShort: 'Inter',
    focusCategoryFull: 'Inter (All Operator)',
    sdrStatusCode: 'UNTOUCHED',
    sdrStatusLabel: 'Belum Disapa',
    weeklyPotentialUnits: 4,
  },
  {
    id: 'rad-06',
    leadIdNumber: 150106,
    shopName: 'Merapi Digital Phone',
    picName: 'Danang Wibisono',
    tierLabel: 'Tier A',
    city: 'Kota Yogyakarta',
    province: 'DI Yogyakarta',
    fullAddress: 'Jogjatronik Mall Lt. 1 Blok B-07, Kota Yogyakarta',
    googleMapsUrl: 'https://maps.google.com/?q=Jogjatronik+Mall+Yogyakarta',
    instagramHandle: '@merapidigital.jogja',
    whatsappNumber: '+6281328006606',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'HANDOVER_PENDING',
    sdrStatusLabel: 'Menunggu ACC ERP',
    weeklyPotentialUnits: 7,
  },
  {
    id: 'rad-07',
    leadIdNumber: 150107,
    shopName: 'Losari Apple Center',
    picName: 'Andiapperi Amir',
    tierLabel: 'Tier A',
    city: 'Kota Makassar',
    province: 'Sulawesi Selatan',
    fullAddress: 'MTC Karebosi Lt. 1 Blok A-22, Kota Makassar',
    googleMapsUrl: 'https://maps.google.com/?q=MTC+Karebosi+Makassar',
    instagramHandle: '@losariapple.mks',
    whatsappNumber: '+6281141007707',
    focusCategoryShort: 'New iBox',
    focusCategoryFull: 'New iBox (Garansi Resmi)',
    sdrStatusCode: 'GRADUATED_ERP',
    sdrStatusLabel: 'Reseller RG ERP',
    weeklyPotentialUnits: 10,
  },
  {
    id: 'rad-08',
    leadIdNumber: 150108,
    shopName: 'Sanur Beach Gadget',
    picName: 'Wayan Sudiana',
    tierLabel: 'Tier B',
    city: 'Kota Denpasar',
    province: 'Bali',
    fullAddress: 'Jl. Diponegoro No. 135, Pertokoan Genteng Biru, Denpasar',
    googleMapsUrl: 'https://maps.google.com/?q=Genteng+Biru+Denpasar',
    instagramHandle: '@sanurgadget.bali',
    whatsappNumber: '+6281236008808',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'UNTOUCHED',
    sdrStatusLabel: 'Belum Disapa',
    weeklyPotentialUnits: 5,
  },
  {
    id: 'rad-09',
    leadIdNumber: 150109,
    shopName: 'Arema Smart Phone',
    picName: 'Bayu Pamungkas',
    tierLabel: 'Tier X',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    fullAddress: 'Malang Town Square Lt. UG Blok F-11, Kota Malang',
    googleMapsUrl: 'https://maps.google.com/?q=Malang+Town+Square',
    instagramHandle: '@aremasmartphone.mlg',
    whatsappNumber: '+6281334009909',
    focusCategoryShort: 'Inter',
    focusCategoryFull: 'Inter (All Operator)',
    sdrStatusCode: 'UNTOUCHED',
    sdrStatusLabel: 'Belum Disapa',
    weeklyPotentialUnits: 4,
  },
  {
    id: 'rad-10',
    leadIdNumber: 150110,
    shopName: 'Patriot Gadget Bekasi',
    picName: 'Fikri Alamsyah',
    tierLabel: 'Tier B',
    city: 'Kota Bekasi',
    province: 'Jawa Barat',
    fullAddress: 'Grand Metropolitan Mall Lt. 2 No. 19, Kota Bekasi',
    googleMapsUrl: 'https://maps.google.com/?q=Grand+Metropolitan+Bekasi',
    instagramHandle: '@patriotgadget.bks',
    whatsappNumber: '+6281281001010',
    focusCategoryShort: 'Ex-iBox',
    focusCategoryFull: 'Ex-iBox (Second Resmi)',
    sdrStatusCode: 'TOUCHED',
    sdrStatusLabel: 'Sudah Disapa',
    weeklyPotentialUnits: 6,
  },
];

const FICTIONAL_FOLLOW_UP_COMMITMENTS: FollowUpCommitmentRowDTO[] = [
  {
    id: 'fu-08',
    commitmentNumber: 8,
    leadIdNumber: 140855,
    shopName: 'Mentari Seluler Mandiri',
    city: 'Kota Bandung',
    whatsappNumber: '+6281288005519',
    isNoDeadline: true,
    dueDateIso: '',
    dueDateDisplay: 'Tanpa tenggat',
    topic: 'Konfirmasi kuota konsinyasi perdana 10 unit iPhone 13 Pro Ex-iBox',
    status: 'MENUNGGU',
    overdueWarningBadge: 'Terbuka lebih dari 14 hari',
  },
  {
    id: 'fu-07',
    commitmentNumber: 7,
    leadIdNumber: 140902,
    shopName: 'Dirgantara Ponsel Utama',
    city: 'Kota Medan',
    whatsappNumber: '+6281362004418',
    isNoDeadline: true,
    dueDateIso: '',
    dueDateDisplay: 'Tanpa tenggat',
    topic: 'Penjemputan berkas Foto KTP & Foto Counter untuk pengajuan RG ERP',
    status: 'MENUNGGU',
    overdueWarningBadge: 'Terbuka lebih dari 14 hari',
  },
  {
    id: 'fu-06',
    commitmentNumber: 6,
    leadIdNumber: 140821,
    shopName: 'Cahaya Gadget Sentosa',
    city: 'Kota Surabaya',
    whatsappNumber: '+6281194007712',
    isNoDeadline: false,
    dueDateIso: '2026-10-29',
    dueDateDisplay: '29/10/2026 · 14.00 WIB',
    topic: 'Kirim pricelist iPhone 13 Pro 128GB dan konfirmasi stok fisik sore ini',
    status: 'MENUNGGU',
    overdueWarningBadge: 'Jatuh tempo hari ini',
  },
  {
    id: 'fu-05',
    commitmentNumber: 5,
    leadIdNumber: 150102,
    shopName: 'Angkasa Putra Cellular',
    city: 'Kota Jakarta Pusat',
    whatsappNumber: '+6281190002202',
    isNoDeadline: false,
    dueDateIso: '2026-10-30',
    dueDateDisplay: '30/10/2026 · 11.00 WIB',
    topic: 'Follow up penawaran bundel 12 unit New iBox iPhone 15 128GB',
    status: 'MENUNGGU',
  },
  {
    id: 'fu-04',
    commitmentNumber: 4,
    leadIdNumber: 140940,
    shopName: 'Samudra iStore Counter',
    city: 'Kota Makassar',
    whatsappNumber: '+6281153008821',
    isNoDeadline: false,
    dueDateIso: '2026-10-28',
    dueDateDisplay: '28/10/2026 · 16.00 WIB',
    topic: 'Kirim ulang brosur program titip konsinyasi mitra Sulawesi',
    status: 'DITEPATI',
    completedAtWib: '28 Okt 2026 · 15.42 WIB',
  },
  {
    id: 'fu-03',
    commitmentNumber: 3,
    leadIdNumber: 150104,
    shopName: 'Bintang Selatan Seluler',
    city: 'Kota Surabaya',
    whatsappNumber: '+6281331004404',
    isNoDeadline: false,
    dueDateIso: '2026-10-27',
    dueDateDisplay: '27/10/2026 · 10.30 WIB',
    topic: 'Sapaan tindak lanjut perbandingan harga grosir Ex-iBox minggu ke-4',
    status: 'DITEPATI',
    completedAtWib: '27 Okt 2026 · 10.18 WIB',
  },
];

const FICTIONAL_HANDOVER_SUBMISSIONS: HandoverQueueRowDTO[] = [
  {
    id: 'ho-01',
    erpHandoverId: 'ERP-HO-2026-4812',
    leadIdNumber: 150106,
    shopName: 'Merapi Digital Phone',
    picName: 'Danang Wibisono',
    city: 'Kota Yogyakarta',
    province: 'DI Yogyakarta',
    fullAddress: 'Jogjatronik Mall Lt. 1 Blok B-07, Kota Yogyakarta',
    googleMapsUrl: 'https://maps.google.com/?q=Jogjatronik+Mall+Yogyakarta',
    instagramHandle: '@merapidigital.jogja',
    whatsappNumber: '6281328006606',
    focusCategory: 'Ex-iBox (Second Resmi)',
    productInterests: ['Ex-iBox', 'New iBox'],
    weeklyPotentialUnits: 7,
    statusCode: 'HANDOVER_PENDING',
    statusLabel: 'Menunggu ACC ERP',
    submittedAtWib: '29 Okt 2026 · 08.40 WIB',
    ktpSizeKb: 312,
    shopPhotoSizeKb: 384,
    salesQualificationNote:
      'Counter aktif di Jogjatronik Mall, dokumen KTP dan foto tampak depan toko sudah lengkap.',
  },
  {
    id: 'ho-02',
    erpHandoverId: 'ERP-HO-2026-4795',
    leadIdNumber: 141099,
    shopName: 'Bintang Elektronik Raya',
    picName: 'Putu Gede Pratama',
    city: 'Kota Denpasar',
    province: 'Bali',
    fullAddress: 'Jl. Teuku Umar No. 88, Denpasar Barat, Bali',
    googleMapsUrl: 'https://maps.google.com/?q=Teuku+Umar+88+Denpasar',
    instagramHandle: '@bintangelektronik.bali',
    whatsappNumber: '6281241009930',
    focusCategory: 'Ex-iBox (Second Resmi)',
    productInterests: ['Ex-iBox', 'Inter'],
    weeklyPotentialUnits: 8,
    statusCode: 'HANDOVER_PENDING',
    statusLabel: 'Menunggu ACC ERP',
    submittedAtWib: '28 Okt 2026 · 16.15 WIB',
    ktpSizeKb: 275,
    shopPhotoSizeKb: 340,
    salesQualificationNote:
      'Siap order perdana 8 unit iPhone 12 & 13 Ex-iBox begitu akun RG ERP disetujui Owner.',
  },
  {
    id: 'ho-03',
    erpHandoverId: 'ERP-HO-2026-4620',
    leadIdNumber: 150107,
    shopName: 'Losari Apple Center',
    picName: 'Andiapperi Amir',
    city: 'Kota Makassar',
    province: 'Sulawesi Selatan',
    fullAddress: 'MTC Karebosi Lt. 1 Blok A-22, Kota Makassar',
    googleMapsUrl: 'https://maps.google.com/?q=MTC+Karebosi+Makassar',
    instagramHandle: '@losariapple.mks',
    whatsappNumber: '6281141007707',
    focusCategory: 'New iBox (Garansi Resmi)',
    productInterests: ['New iBox', 'Ex-iBox'],
    weeklyPotentialUnits: 10,
    statusCode: 'GRADUATED_TO_ERP',
    statusLabel: 'Lulus ke RG ERP',
    submittedAtWib: '25 Okt 2026 · 11.20 WIB',
    ktpSizeKb: 290,
    shopPhotoSizeKb: 365,
    salesQualificationNote:
      'Telah di-ACC di RG ERP dan terkunci di Olivia SDR. Transaksi grosir aktif berjalan di RG ERP.',
  },
  {
    id: 'ho-04',
    erpHandoverId: 'ERP-HO-2026-4588',
    leadIdNumber: 140710,
    shopName: 'Sriwijaya Digital Store',
    picName: 'Hendra Gunawan',
    city: 'Kota Palembang',
    province: 'Sumatera Selatan',
    fullAddress: 'Internasional Plaza Lt. 1 Blok C-02, Palembang',
    googleMapsUrl: 'https://maps.google.com/?q=Internasional+Plaza+Palembang',
    instagramHandle: '@sriwijayadigital.plg',
    whatsappNumber: '6281367001188',
    focusCategory: 'Ex-iBox (Second Resmi)',
    productInterests: ['Ex-iBox'],
    weeklyPotentialUnits: 6,
    statusCode: 'GRADUATED_TO_ERP',
    statusLabel: 'Lulus ke RG ERP',
    submittedAtWib: '22 Okt 2026 · 14.05 WIB',
    ktpSizeKb: 260,
    shopPhotoSizeKb: 318,
    salesQualificationNote:
      'Mitra reseller aktif Palembang, lulus verifikasi KYC Owner RG ERP.',
  },
];

/* ============================================================================
 * STAGE 2 PURE ASYNC API FUNCTIONS (Honoring success / loading / empty / error)
 * ============================================================================ */

/**
 * Simulated Go Backend REST Call: GET /api/v1/akuisisi/bundle
 */
export async function fetchAkuisisiHubBundle(
  simState: AsyncSimState = 'success'
): Promise<AkuisisiHubBundleDTO> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (simState === 'error') {
    throw new Error(
      'Gagal memuat data modul Akuisisi & Antrean dari server Go API (:8080/api/v1/akuisisi/bundle).'
    );
  }

  const isEmpty = simState === 'empty';

  const antreanHariIni: AntreanHariIniViewDTO = {
    title: 'Antrean Penjangkauan Harian',
    subtitlePrefix: 'Target aman 20–25 toko per nomor/hari · Skor tertinggi lebih dulu',
    activeNumbersCount: 2,
    maxNumbersCapacity: 12,
    needsInspectionCount: 0,
    needsInspectionLabel: 'Perlu periksa (0) (Tidak ada)',
    circuitBreakerText:
      'Proteksi Nomor Aman: Rasio penolakan 7 hari (0.0% < 35%). Kuota harian normal 25 toko/nomor.',
    circuitBreakerStatusLabel: 'Circuit Breaker: Normal',
    sessions: [
      { id: 'all', label: 'Semua nomor aktif (2 Nomor)' },
      { id: 'session-01', label: 'WABA Hub Nusantara (+62 811-9400-2101)' },
      { id: 'session-02', label: 'Sesi Sales 02 (+62 812-8800-3402)' },
    ],
    addNumberWarningDialog: {
      title: 'Peringatan Operasional Penambahan Nomor',
      subtitle:
        'Sesuai kaidah operasional, penambahan nomor aktif memerlukan evaluasi risiko keselamatan nomor dan batas jam kerja:',
      warnings: [
        'Sesi Nomor Kantor 02 (session-02) sempat berstatus DISCONNECTED dalam 7 hari terakhir',
        'Waktu operasional saat ini memerlukan pemantauan rasio blokir pada jam kerja sales Akun 1 (09.00–20.00 WIB)',
      ],
      confirmQuestion:
        'Apakah Anda ingin mengabaikan peringatan ini dan tetap mengaktifkan nomor baru?',
      cancelLabel: 'Batal',
      confirmLabel: 'Tetap Tambah Nomor',
    },
    items: isEmpty ? [] : FICTIONAL_DAILY_QUEUE_ITEMS,
  };

  const radarToko: RadarTokoViewDTO = {
    headerBadgeTitle: 'Radar Prospek Toko HP (Olivia 1.2 SDR)',
    totalBankDataCount: isEmpty ? 0 : 133079,
    duplicateCheckerTitle: 'Cek Duplikasi Nomor WhatsApp ke Database RG ERP',
    duplicateCheckerSubtitle:
      'Pastikan nomor toko belum menjadi reseller aktif di RG ERP sebelum mengirim sapaan pertama.',
    availableCities: [
      'Jakarta',
      'Bandung',
      'Surabaya',
      'Semarang',
      'Yogyakarta',
      'Medan',
      'Makassar',
      'Denpasar',
      'Malang',
      'Bekasi',
    ],
    categoryFilterOptions: [
      'Semua Kategori',
      'Ex-iBox (Second Resmi)',
      'New iBox (Segel Resmi)',
      'Inter (All Operator)',
    ],
    statusFilterOptions: [
      'Semua Status',
      'Belum Disapa',
      'Sudah Disapa',
      'Diskusi Aktif',
      'Menunggu ACC ERP',
      'Reseller RG ERP',
    ],
    prospects: isEmpty ? [] : FICTIONAL_RADAR_PROSPECTS,
  };

  const jadwalTindakLanjut: JadwalTindakLanjutViewDTO = {
    title: 'Jadwal Tindak Lanjut',
    helperNotice: "Centang 'Tanpa tenggat' untuk target tanpa tanggal.",
    commitments: isEmpty ? [] : FICTIONAL_FOLLOW_UP_COMMITMENTS,
    leadLookupOptions: [
      {
        leadIdNumber: 140821,
        shopName: 'Cahaya Gadget Sentosa',
        city: 'Kota Surabaya',
        whatsappNumber: '+6281194007712',
      },
      {
        leadIdNumber: 140855,
        shopName: 'Mentari Seluler Mandiri',
        city: 'Kota Bandung',
        whatsappNumber: '+6281288005519',
      },
      {
        leadIdNumber: 140902,
        shopName: 'Dirgantara Ponsel Utama',
        city: 'Kota Medan',
        whatsappNumber: '+6281362004418',
      },
      {
        leadIdNumber: 150101,
        shopName: 'Sentosa Elektronik & Ponsel',
        city: 'Kota Medan',
        whatsappNumber: '+6281366001101',
      },
      {
        leadIdNumber: 150102,
        shopName: 'Angkasa Putra Cellular',
        city: 'Kota Jakarta Pusat',
        whatsappNumber: '+6281190002202',
      },
    ],
  };

  const ketepatanWaktuSla: KetepatanWaktuSlaViewDTO = {
    title: 'Ketepatan Waktu Tindak Lanjut Tim Sales',
    subtitle: 'Monitoring komitmen waktu follow-up mitra reseller',
    overallOnTimePercent: isEmpty ? 0 : 88.5,
    avgLeadTimeLabel: isEmpty ? '—' : '42 menit',
    warningEscalatedCount: isEmpty ? 0 : 2,
    activeCommitmentsCount: isEmpty ? 0 : 6,
    serverMetricEndpointNoticeTitle: 'Status Layanan Metrik SLA Terintegrasi',
    serverMetricEndpointNoticeBody:
      'Metrik penghitungan SLA tindak lanjut sales dihitung dari selisih jadwal jatuh tempo terhadap waktu penandaan ditepati pada endpoint server Go API.',
    automationRulesTitle: 'Aturan & Otomasi Ketepatan Waktu:',
    automationRules: [
      'Bot Telegram mengirimkan pengingat H-1 jam sebelum jatuh tempo ke nomor sales penanggung jawab.',
      'Jika jam perkiraan telah lewat > 2 jam tanpa ditandai ditepati, sistem secara otomatis menandai kuning (Warning) dan meneruskan rekap ke Supervisor.',
      'Draf pesan sapaan tindak lanjut disiapkan otomatis agar sales cukup menekan tombol satu klik tanpa mengetik dari nol.',
    ],
    operatorMetrics: isEmpty
      ? []
      : [
          {
            id: 'sla-op-1',
            operatorName: 'Nadia Kusuma Wardani (Master · Akun 1)',
            waSessionLabel: 'session-01 (+62 811-9400-2101)',
            totalAssigned: 14,
            completedOnTime: 13,
            overdueWarningCount: 1,
            onTimeRatePercent: 92.9,
            avgResponseMinutes: 34,
          },
          {
            id: 'sla-op-2',
            operatorName: 'Rizky Pratama Wijaya (Sales CRM)',
            waSessionLabel: 'session-02 (+62 812-8800-3402)',
            totalAssigned: 12,
            completedOnTime: 10,
            overdueWarningCount: 1,
            onTimeRatePercent: 83.3,
            avgResponseMinutes: 51,
          },
        ],
  };

  const submissions = isEmpty ? [] : FICTIONAL_HANDOVER_SUBMISSIONS;
  const pendingCount = submissions.filter((s) => s.statusCode === 'HANDOVER_PENDING').length;
  const graduatedCount = submissions.filter((s) => s.statusCode === 'GRADUATED_TO_ERP').length;

  const antreanHandoverErp: AntreanHandoverErpViewDTO = {
    title: 'Antrean Serah Terima Prospek ke RG ERP',
    subtitle:
      'Setelah di-ACC di RG ERP, toko terkunci di Olivia 1.2 dan seluruh transaksi dijalankan penuh di RG ERP.',
    kpiTotalSubmissions: submissions.length,
    kpiPendingVerification: pendingCount,
    kpiGraduatedActive: graduatedCount,
    submissions,
  };

  return {
    antreanHariIni,
    radarToko,
    jadwalTindakLanjut,
    ketepatanWaktuSla,
    antreanHandoverErp,
  };
}

/**
 * Simulated Go Backend REST Call: GET /api/v1/erp/check-duplicate?phone=...
 */
export async function checkWhatsAppDuplicateInErp(
  rawPhone: string
): Promise<ErpDuplicateCheckDTO> {
  await new Promise((resolve) => setTimeout(resolve, 180));
  const digits = rawPhone.replace(/\D/g, '');
  const normalized = digits.startsWith('0')
    ? `62${digits.slice(1)}`
    : digits.startsWith('8')
      ? `62${digits}`
      : digits;

  // Match against graduated ERP resellers in fictional dataset
  const existingGraduated = FICTIONAL_HANDOVER_SUBMISSIONS.find(
    (s) =>
      s.statusCode === 'GRADUATED_TO_ERP' &&
      s.whatsappNumber.replace(/\D/g, '') === normalized
  );

  if (existingGraduated) {
    return {
      checkedAtWib: '29 Okt 09.25 WIB',
      isDuplicate: true,
      existingErpId: existingGraduated.erpHandoverId,
      statusMessage: `TERDAFTAR DI RG ERP: Nomor +${normalized} sudah menjadi Reseller Aktif (${existingGraduated.shopName} · ${existingGraduated.erpHandoverId}). Terkunci di SDR.`,
    };
  }

  return {
    checkedAtWib: '29 Okt 09.25 WIB',
    isDuplicate: false,
    statusMessage: `AMAN DISAPA: Nomor +${normalized} belum terdaftar sebagai reseller aktif di database RG ERP.`,
  };
}

/* ============================================================================
 * STAGE 3a TYPED DTOs: "DATA & PETA TOKO" HUB + DETAIL TOKO + DIALOGS d01, d06, d07, d08
 * ============================================================================ */

export type ShopTierCode = 'Tier A' | 'Tier B' | 'Tier C' | 'Tier X';

export type ShopChatStatusCode =
  | 'COLD_UNTOUCHED'
  | 'SALES_HANDLED'
  | 'COOLING_OFF'
  | 'AI_HANDLED';

export type ShopChatStatusLabel =
  | 'Belum Disapa (Cold)'
  | 'Ditangani Sales'
  | 'Cooling Off'
  | 'Dijawab AI';

export type ShopOwnershipCode = 'MINE' | 'SALES_2' | 'UNASSIGNED';

export type OnlineLinkType =
  | 'Situs Web'
  | 'Facebook'
  | 'Instagram'
  | 'Google Maps'
  | 'Marketplace';

export interface ShopOnlineLinkDTO {
  id: string;
  type: OnlineLinkType;
  url: string;
  displayLabel: string;
}

export interface ShopChangeHistoryEntryDTO {
  id: string;
  timestampWib: string;
  actorName: string;
  summary: string;
}

export interface ShopAiMemoryLayerDTO {
  layerNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  code: string;
  title: string;
  summary: string;
  detailDescription: string;
  updatedAtWib: string;
}

export interface ShopOpenFollowUpDTO {
  id: string;
  dueDateDisplay: string;
  topic: string;
}

export interface DatabaseShopRowDTO {
  id: string;
  leadIdNumber: number;
  shopName: string;
  fullAddress: string;
  city: string;
  province: string;
  whatsappNumber: string;
  secondaryPhones: { phone: string; label: string }[];
  picName: string;
  tier: ShopTierCode;
  score: number | null;
  coveragePercent: number;
  chatStatusCode: ShopChatStatusCode;
  chatStatusLabel: ShopChatStatusLabel;
  ownershipCode: ShopOwnershipCode;
  ownershipBadgeLabel?: 'Dipegang Anda' | 'Dipegang Sales CRM 2';
  handlerType: 'HUMAN' | 'AI';
  waSessionLabel: string;
  brandSourceLabel: string;
  lastUpdatedLabel: string;
  funnelStage: string;
  /** 1 = Prospek, 2 = Terkontak, 3 = Berminat, 4 = Negosiasi, 5 = Deal Tercapai */
  funnelStepperIndex: 1 | 2 | 3 | 4 | 5;
  isActiveReseller: boolean;
  isDisqualified: boolean;
  needsInspection: boolean;
  googleMapsUrl?: string;
  onlineLinks: ShopOnlineLinkDTO[];
  salesOwnerNote: string;
  changeHistory: ShopChangeHistoryEntryDTO[];
  openFollowUps: ShopOpenFollowUpDTO[];
  aiMemoryLayers: ShopAiMemoryLayerDTO[];
  chatMessages: ChatMessageDTO[];
}

export interface ProvinceCityDrilldownDTO {
  cityName: string;
  shopCount: number;
  tierACount: number;
  activeResellerCount: number;
}

export interface ProvinceDistributionItemDTO {
  id: string;
  provinceCode: string;
  provinceName: string;
  islandGroup:
    | 'Sumatera'
    | 'Jawa'
    | 'Kalimantan'
    | 'Bali & Nusa Tenggara'
    | 'Sulawesi'
    | 'Maluku & Papua';
  /** Row (0..5) and Col (0..11) in the abstract geographic tile-grid map of Indonesia */
  gridRow: number;
  gridCol: number;
  totalShops: number;
  tierACount: number;
  contactedCount: number;
  activeResellerCount: number;
  densityLevel: 1 | 2 | 3 | 4 | 5;
  cities: ProvinceCityDrilldownDTO[];
}

export interface CreateShopFromAcquaintancePayloadDTO {
  shopName: string;
  whatsappNumber: string;
  city: string;
  fullAddress: string;
}

export interface UpdateShopDataPayloadDTO {
  shopId: string;
  shopName: string;
  fullAddress: string;
  city: string;
}

export interface MoveShopTierPayloadDTO {
  shopId: string;
  targetTier: ShopTierCode;
  reason: string;
}

export interface UpdateShopContactNotePayloadDTO {
  shopId: string;
  picName: string;
  whatsappNumber: string;
  secondaryPhones: { phone: string; label: string }[];
  salesOwnerNote: string;
}

export interface DatabaseHubBundleDTO {
  totalAllShopsVirtualCount: number;
  totalTierAShopsVirtualCount: number;
  totalActiveResellersCount: number;
  availableCities: string[];
  shops: DatabaseShopRowDTO[];
  provinces: ProvinceDistributionItemDTO[];
}

/* ============================================================================
 * STAGE 3a 100% FICTIONAL DATASET
 * ============================================================================ */

function buildDefaultMemoryLayers(
  shopName: string,
  cityAndAddress: string,
  preferredSeries = 'Belum terdeteksi',
  budgetRange = 'Belum terdeteksi',
  tabooNotes = 'Belum ada',
  dealHistory = 'Belum ada',
  conversationSummary = 'Menunggu percakapan kualifikasi lebih lanjut.'
): ShopAiMemoryLayerDTO[] {
  return [
    {
      layerNumber: 1,
      code: 'IDENTITAS',
      title: '1. IDENTITAS',
      summary: shopName,
      detailDescription: `Identitas toko counter terverifikasi di Bank Data Olivia SDR dengan nama "${shopName}".`,
      updatedAtWib: '29 Okt 2026 · 08.15 WIB',
    },
    {
      layerNumber: 2,
      code: 'PROFIL_COUNTER',
      title: '2. PROFIL COUNTER',
      summary: cityAndAddress || '—',
      detailDescription:
        cityAndAddress && cityAndAddress !== '—'
          ? `Lokasi fisik counter berada di ${cityAndAddress}. Potensi trafik ritel jalan utama.`
          : 'Alamat fisik counter belum dilengkapi di Bank Data. Perlu verifikasi saat chat berlangsung.',
      updatedAtWib: '29 Okt 2026 · 08.15 WIB',
    },
    {
      layerNumber: 3,
      code: 'SERI_INCARAN',
      title: '3. SERI INCARAN',
      summary: preferredSeries,
      detailDescription:
        preferredSeries === 'Belum terdeteksi'
          ? 'Asisten AI belum mendeteksi seri iPhone spesifik yang paling sering dicari oleh counter ini.'
          : `Fokus perputaran unit counter pada seri: ${preferredSeries}.`,
      updatedAtWib: '29 Okt 2026 · 08.20 WIB',
    },
    {
      layerNumber: 4,
      code: 'BUDGET_RANGE',
      title: '4. BUDGET RANGE',
      summary: budgetRange,
      detailDescription:
        budgetRange === 'Belum terdeteksi'
          ? 'Rentang modal belanja mingguan belum disebutkan oleh pemilik counter.'
          : `Estimasi plafon belanja mingguan counter berada di kisaran ${budgetRange}.`,
      updatedAtWib: '29 Okt 2026 · 08.22 WIB',
    },
    {
      layerNumber: 5,
      code: 'PANTANGAN',
      title: '5. PANTANGAN',
      summary: tabooNotes,
      detailDescription:
        tabooNotes === 'Belum ada'
          ? 'Tidak ada catatan pantangan kondisi unit atau jam pengiriman pesan.'
          : `Pantangan khusus pemilik counter: ${tabooNotes}.`,
      updatedAtWib: '29 Okt 2026 · 08.25 WIB',
    },
    {
      layerNumber: 6,
      code: 'RIWAYAT_DEAL',
      title: '6. RIWAYAT DEAL',
      summary: dealHistory,
      detailDescription:
        dealHistory === 'Belum ada'
          ? 'Belum ada riwayat transaksi grosir yang tercatat di gerbang RG ERP.'
          : `Rekam jejak transaksi: ${dealHistory}.`,
      updatedAtWib: '29 Okt 2026 · 08.30 WIB',
    },
    {
      layerNumber: 7,
      code: 'PERCAKAPAN',
      title: '7. PERCAKAPAN',
      summary: conversationSummary,
      detailDescription: `Ringkasan konteks percakapan WhatsApp terakhir: ${conversationSummary}`,
      updatedAtWib: '29 Okt 2026 · 09.10 WIB',
    },
  ];
}

const FICTIONAL_DATABASE_SHOPS: DatabaseShopRowDTO[] = [
  // VARIANT 1 FROM SCREENSHOTS 09 & 09b: Human-handled lead with 12-message chat history & no online links
  {
    id: 'shop-138821',
    leadIdNumber: 138821,
    shopName: 'Razma Jayana Commercial Cell',
    fullAddress: '—',
    city: 'Kota Jakarta Pusat',
    province: 'DKI Jakarta',
    whatsappNumber: '+6285183150917',
    secondaryPhones: [],
    picName: 'Rahmat Jayana',
    tier: 'Tier B',
    score: null,
    coveragePercent: 0,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'HUMAN',
    waSessionLabel: '—',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '28 Okt 2026',
    funnelStage: 'Terkontak',
    funnelStepperIndex: 2,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: '',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Razma Jayana Commercial Cell',
      '—',
      'Belum terdeteksi',
      'Belum terdeteksi',
      'Belum ada',
      'Belum ada',
      'Prospek menanyakan syarat kemitraan grosir Rumah Gadget dan diambil alih manual oleh Sales CRM.'
    ),
    chatMessages: [
      {
        id: 'rz-01',
        senderType: 'shop',
        senderLabel: 'Razma Jayana Commercial Cell',
        body: 'Halo kak, info syarat kemitraan grosir Rumah Gadget gimana ya?',
        timestampWib: '28 Okt 21.29',
      },
      {
        id: 'rz-02',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: 'Echo duplikat balasan AI',
        timestampWib: '28 Okt 21.30',
      },
      {
        id: 'rz-03',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: 'Siap kak, saya sales Rumah Gadget lanjut bantu manual dari HP ya.',
        timestampWib: '28 Okt 21.30',
      },
      {
        id: 'rz-04',
        senderType: 'shop',
        senderLabel: 'Razma Jayana Commercial Cell',
        body: 'Siap kak terima kasih infonya',
        timestampWib: '28 Okt 21.30',
      },
      {
        id: 'rz-05',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: '[Uji E2E Inbox Olivia 1.2] Balasan keluar dari CRM Olivia melalui WABA Hub (085181727233).',
        timestampWib: '28 Okt 21.30',
      },
      {
        id: 'rz-06',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: '[Coexistence Echo] Diambil alih manual oleh sales dari HP.',
        timestampWib: '28 Okt 21.31',
      },
      {
        id: 'rz-07',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: 'Untuk tahap awal kemitraan reseller, minimal pengambilan 3 unit seri campuran (Ex-iBox / New iBox) kak.',
        timestampWib: '28 Okt 21.40',
      },
      {
        id: 'rz-08',
        senderType: 'shop',
        senderLabel: 'Razma Jayana Commercial Cell',
        body: 'Kalau garansi tukar unit kalau ada kendala sinyal atau LCD berapa hari kak?',
        timestampWib: '28 Okt 21.43',
      },
      {
        id: 'rz-09',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: 'Garansi toko 7 hari tukar unit langsung setelah barang diterima di counter kak.',
        timestampWib: '28 Okt 21.45',
      },
      {
        id: 'rz-10',
        senderType: 'sales',
        senderLabel: 'Sales CRM',
        body: 'halo',
        timestampWib: '28 Okt 21.46',
      },
      {
        id: 'rz-11',
        senderType: 'shop',
        senderLabel: 'Razma Jayana Commercial Cell',
        body: 'Hay',
        timestampWib: '28 Okt 22.07',
      },
      {
        id: 'rz-12',
        senderType: 'shop',
        senderLabel: 'Razma Jayana Commercial Cell',
        body: 'Besok pagi saya kirimkan foto KTP dan tampak depan toko ya kak.',
        timestampWib: '28 Okt 22.09',
      },
    ],
  },

  // VARIANT 2 FROM SCREENSHOT 09c & 08: Cold AI-handled lead with 2 online links & Google Maps link
  {
    id: 'shop-101',
    leadIdNumber: 1,
    shopName: 'Sentosa Medan Electronic',
    fullAddress: 'Jl. Iskandar Muda No. 133A, Babura, Medan Baru',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6281366668236',
    secondaryPhones: [],
    picName: 'Hendra Wijaya',
    tier: 'Tier X',
    score: 30.78,
    coveragePercent: 68,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'SALES_2',
    ownershipBadgeLabel: 'Dipegang Sales CRM 2',
    handlerType: 'AI',
    waSessionLabel: '—',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '8 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 1,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: false,
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Iskandar+Muda+No.+133A+Medan',
    onlineLinks: [
      {
        id: 'lnk-101-web',
        type: 'Situs Web',
        url: 'https://sentosamedanelectronic.id',
        displayLabel: 'sentosamedanelectronic.id',
      },
      {
        id: 'lnk-101-fb',
        type: 'Facebook',
        url: 'https://facebook.com/309973682918366',
        displayLabel: '309973682918366',
      },
    ],
    salesOwnerNote: '',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Sentosa Medan Electronic',
      'Kota Medan · Jl. Iskandar Muda No. 133A, Babura, Medan Baru'
    ),
    chatMessages: [],
  },

  // ROW #2 FROM SCREENSHOT 08: Disqualified ("Bukan target") + Cooling Off
  {
    id: 'shop-102',
    leadIdNumber: 2,
    shopName: 'Pilot Computer & Gadget Andalan',
    fullAddress: 'Jl. Merbau No. 14, Sekip, Medan Petisah',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6281453008825',
    secondaryPhones: [],
    picName: 'Darmawan Saputra',
    tier: 'Tier X',
    score: 21.77,
    coveragePercent: 45,
    chatStatusCode: 'COOLING_OFF',
    chatStatusLabel: 'Cooling Off',
    ownershipCode: 'UNASSIGNED',
    handlerType: 'AI',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '14 Okt 2026',
    funnelStage: 'Tidak Valid',
    funnelStepperIndex: 1,
    isActiveReseller: false,
    isDisqualified: true,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: 'Fokus servis laptop dan printer kantor, tidak menjual unit HP second/baru.',
    changeHistory: [
      {
        id: 'ch-102-1',
        timestampWib: '14 Okt 2026 · 11.20 WIB',
        actorName: 'Nadia Kusuma Wardani',
        summary: 'Menandai toko sebagai Bukan target (Fokus servis laptop).',
      },
    ],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Pilot Computer & Gadget Andalan',
      'Kota Medan · Jl. Merbau No. 14'
    ),
    chatMessages: [],
  },

  // ROW #3 FROM SCREENSHOT 08: Tier B + "Periksa dulu" + Dipegang Anda
  {
    id: 'shop-103',
    leadIdNumber: 3,
    shopName: 'Dirgantara Universal Phone',
    fullAddress: 'Jl. Gatot Subroto Km 5.5 No. 48, Sei Sikambing',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6289505401222',
    secondaryPhones: [],
    picName: 'Kevin Ginting',
    tier: 'Tier B',
    score: 40.99,
    coveragePercent: 74,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'AI',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '22 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 1,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: true,
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Gatot+Subroto+Medan',
    onlineLinks: [
      {
        id: 'lnk-103-ig',
        type: 'Instagram',
        url: 'https://instagram.com/dirgantaraphone.mdn',
        displayLabel: '@dirgantaraphone.mdn',
      },
    ],
    salesOwnerNote: 'Counter ramai di kawasan Gatot Subroto, perlu konfirmasi nama PIC pemilik.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Dirgantara Universal Phone',
      'Kota Medan · Jl. Gatot Subroto Km 5.5 No. 48',
      'iPhone 12 & iPhone 13 Ex-iBox',
      'Rp 30–50 Juta / minggu'
    ),
    chatMessages: [],
  },

  // TIER A SHOPS (`08c-toko-tier-A`)
  {
    id: 'shop-19',
    leadIdNumber: 19,
    shopName: 'Bima Sakti Ponsel Utama',
    fullAddress: 'Jl. Gatot Subroto No. 30–32, Petisah Tengah',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6281362604491',
    secondaryPhones: [{ phone: '+6281260009911', label: 'Admin Grosir' }],
    picName: 'Bima Pratama',
    tier: 'Tier A',
    score: 55.97,
    coveragePercent: 92,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'AI',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '29 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 2,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: false,
    googleMapsUrl: 'https://maps.google.com/?q=Jl.+Gatot+Subroto+30+Medan',
    onlineLinks: [
      {
        id: 'lnk-19-ig',
        type: 'Instagram',
        url: 'https://instagram.com/bimasaktiponsel.id',
        displayLabel: '@bimasaktiponsel.id',
      },
    ],
    salesOwnerNote: 'Counter Tier A prioritas utama dengan etalase iPhone terbesar di Petisah.',
    changeHistory: [],
    openFollowUps: [
      {
        id: 'fu-shop-19',
        dueDateDisplay: '29 Okt 2026 · 14.00 WIB',
        topic: 'Kirim pricelist iPhone 13 Pro 128GB & 256GB Ex-iBox Grade A',
      },
    ],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Bima Sakti Ponsel Utama',
      'Kota Medan · Jl. Gatot Subroto No. 30–32',
      'iPhone 13 Pro, 14 Pro Ex-iBox',
      'Rp 75–120 Juta / minggu',
      'Tidak menerima unit rekondisi / LCD gantian',
      'Prospek Tier A baru',
      'Siap dihubungi via sesi WABA Hub Nusantara.'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-31',
    leadIdNumber: 31,
    shopName: 'Mahkota Kencana Cellular',
    fullAddress: 'Plaza Medan Fair Lt. 4 Blok B No. 272–277, Jl. Gatot Subroto',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6282272421575',
    secondaryPhones: [],
    picName: 'Surya Kencana',
    tier: 'Tier A',
    score: 45.38,
    coveragePercent: 86,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'AI',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '28 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 2,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: false,
    googleMapsUrl: 'https://maps.google.com/?q=Plaza+Medan+Fair',
    onlineLinks: [],
    salesOwnerNote: 'Memiliki 3 cabang counter di Plaza Medan Fair Lantai 4.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Mahkota Kencana Cellular',
      'Kota Medan · Plaza Medan Fair Lt. 4 No. 272–277',
      'iPhone 13 & 14 New iBox',
      'Rp 60–90 Juta / minggu'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-88',
    leadIdNumber: 88,
    shopName: 'Intikom Nusantara Gadget',
    fullAddress: 'Komp. Center Point Jl. Timor No. 23–27 Blok H, Medan Timur',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6285312226226',
    secondaryPhones: [],
    picName: 'Lukman Hakim',
    tier: 'Tier A',
    score: 42.73,
    coveragePercent: 81,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'SALES_2',
    ownershipBadgeLabel: 'Dipegang Sales CRM 2',
    handlerType: 'AI',
    waSessionLabel: 'session-02',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '27 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 1,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: true,
    onlineLinks: [],
    salesOwnerNote: '',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Intikom Nusantara Gadget',
      'Kota Medan · Komp. Center Point Jl. Timor No. 23–27 Blok H'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-230',
    leadIdNumber: 230,
    shopName: 'Ratu Cell Pajak Sore',
    fullAddress: 'Pajak Sore, Jl. Jamin Ginting No. 240, Padang Bulan',
    city: 'Kota Medan',
    province: 'Sumatera Utara',
    whatsappNumber: '+6282165201108',
    secondaryPhones: [],
    picName: 'Ratna Sari',
    tier: 'Tier A',
    score: 38.75,
    coveragePercent: 79,
    chatStatusCode: 'COLD_UNTOUCHED',
    chatStatusLabel: 'Belum Disapa (Cold)',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'AI',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '26 Okt 2026',
    funnelStage: 'Sudah Disapa (Cold)',
    funnelStepperIndex: 1,
    isActiveReseller: false,
    isDisqualified: false,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: '',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Ratu Cell Pajak Sore',
      'Kota Medan · Jl. Jamin Ginting No. 240'
    ),
    chatMessages: [],
  },

  // 5 ACTIVE RESELLERS (`08b-reseller-aktif` — "5 unit data")
  {
    id: 'shop-3164',
    leadIdNumber: 3164,
    shopName: 'DT Dirgahayu Gadget Store',
    fullAddress: 'Belakang Kantor DPRD Provinsi Sudirman, Jl. Wonosari No. 2, Pekanbaru',
    city: 'Kota Pekanbaru',
    province: 'Riau',
    whatsappNumber: '+6282287995809',
    secondaryPhones: [],
    picName: 'Doni Tanjung',
    tier: 'Tier C',
    score: 26.83,
    coveragePercent: 88,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'HUMAN',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '29 Okt 2026',
    funnelStage: 'Reseller Aktif',
    funnelStepperIndex: 5,
    isActiveReseller: true,
    isDisqualified: false,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: 'Reseller aktif Pekanbaru, order rutin setiap Selasa & Jumat.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'DT Dirgahayu Gadget Store',
      'Kota Pekanbaru · Jl. Wonosari No. 2',
      'iPhone 12 & 13 Ex-iBox',
      'Rp 45 Juta / minggu',
      'Pengiriman wajib kargo berasuransi kayu',
      'Lulus ke RG ERP (ERP-HO-2026-4412)',
      'Mitra reseller aktif di RG ERP.'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-4452',
    leadIdNumber: 4452,
    shopName: 'Mas Jaya Sentosa Store',
    fullAddress: 'Jl. Bukit Tempurung No. 81, Rantau Laban, Tebing Tinggi',
    city: 'Kota Tebing Tinggi',
    province: 'Sumatera Utara',
    whatsappNumber: '+6288808169137',
    secondaryPhones: [],
    picName: 'Dimas Jaya',
    tier: 'Tier A',
    score: 52.0,
    coveragePercent: 95,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'HUMAN',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '29 Okt 2026',
    funnelStage: 'Reseller Aktif',
    funnelStepperIndex: 5,
    isActiveReseller: true,
    isDisqualified: false,
    needsInspection: true,
    onlineLinks: [],
    salesOwnerNote: 'Mitra Tier A & Reseller Aktif Tebing Tinggi.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Mas Jaya Sentosa Store',
      'Kota Tebing Tinggi · Jl. Bukit Tempurung No. 81',
      'iPhone 13 Pro & 14 Pro Ex-iBox',
      'Rp 80 Juta / minggu',
      'Belum ada',
      'Lulus ke RG ERP (ERP-HO-2026-4489)',
      'Mitra aktif dengan repeat order mingguan.'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-98184',
    leadIdNumber: 98184,
    shopName: 'Jaguang Minang Phoneshop',
    fullAddress: 'Halaman Bioskop Eri, Jl. Perintis Kemerdekaan No. 18, Bukittinggi',
    city: 'Kota Bukittinggi',
    province: 'Sumatera Barat',
    whatsappNumber: '+6281364433521',
    secondaryPhones: [],
    picName: 'Fikri Chaniago',
    tier: 'Tier C',
    score: 22.97,
    coveragePercent: 82,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'HUMAN',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '28 Okt 2026',
    funnelStage: 'Reseller Aktif',
    funnelStepperIndex: 5,
    isActiveReseller: true,
    isDisqualified: false,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: 'Reseller aktif wilayah Sumatera Barat (Bukittinggi).',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Jaguang Minang Phoneshop',
      'Kota Bukittinggi · Jl. Perintis Kemerdekaan No. 18'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-101381',
    leadIdNumber: 101381,
    shopName: 'Andalas Jaya Cell Dharmasraya',
    fullAddress: 'Jl. Lintas Sumatera Ps. Koto Baru, Kabupaten Dharmasraya',
    city: 'Kabupaten Dharmasraya',
    province: 'Sumatera Barat',
    whatsappNumber: '',
    secondaryPhones: [],
    picName: 'Yudi Andalas',
    tier: 'Tier X',
    score: 22.97,
    coveragePercent: 60,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'SALES_2',
    ownershipBadgeLabel: 'Dipegang Sales CRM 2',
    handlerType: 'HUMAN',
    waSessionLabel: 'session-02',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '25 Okt 2026',
    funnelStage: 'Reseller Aktif',
    funnelStepperIndex: 5,
    isActiveReseller: true,
    isDisqualified: false,
    needsInspection: false,
    onlineLinks: [],
    salesOwnerNote: 'Nomor WA utama sedang diperbarui oleh pemilik toko.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Andalas Jaya Cell Dharmasraya',
      'Kabupaten Dharmasraya · Jl. Lintas Sumatera Ps. Koto Baru'
    ),
    chatMessages: [],
  },
  {
    id: 'shop-140622',
    leadIdNumber: 140622,
    shopName: 'Nusantara Gadget Center',
    fullAddress: 'WTC e-Mall Lt. 2 Ruang 214, Jl. Pemuda No. 27–31, Surabaya',
    city: 'Kota Surabaya',
    province: 'Jawa Timur',
    whatsappNumber: '+6281134009921',
    secondaryPhones: [],
    picName: 'Arif Wibowo',
    tier: 'Tier A',
    score: 54.12,
    coveragePercent: 96,
    chatStatusCode: 'SALES_HANDLED',
    chatStatusLabel: 'Ditangani Sales',
    ownershipCode: 'MINE',
    ownershipBadgeLabel: 'Dipegang Anda',
    handlerType: 'HUMAN',
    waSessionLabel: 'session-01',
    brandSourceLabel: 'Bank Data',
    lastUpdatedLabel: '29 Okt 2026',
    funnelStage: 'Reseller Aktif',
    funnelStepperIndex: 5,
    isActiveReseller: true,
    isDisqualified: false,
    needsInspection: false,
    googleMapsUrl: 'https://maps.google.com/?q=WTC+Surabaya',
    onlineLinks: [
      {
        id: 'lnk-140622-web',
        type: 'Situs Web',
        url: 'https://nusantaragadgetsby.id',
        displayLabel: 'nusantaragadgetsby.id',
      },
    ],
    salesOwnerNote: 'Reseller utama Jawa Timur (WTC Surabaya), pengambilan 10–15 unit/minggu.',
    changeHistory: [],
    openFollowUps: [],
    aiMemoryLayers: buildDefaultMemoryLayers(
      'Nusantara Gadget Center',
      'Kota Surabaya · WTC e-Mall Lt. 2 Ruang 214',
      'iPhone 13, 14, 15 New iBox & Ex-iBox',
      'Rp 120–180 Juta / minggu',
      'Wajib faktur pajak & segel resmi',
      'Lulus ke RG ERP (ERP-HO-2026-4612)',
      'Mitra aktif prioritas Jawa Timur.'
    ),
    chatMessages: [],
  },
];

/**
 * All 38 Indonesian Provinces ranked by shop count (matching screenshot `10-peta-toko.png`)
 * with abstract archipelago grid coordinates (`gridRow` 0..5, `gridCol` 0..11) and Kabupaten/Kota drill-down.
 */
const FICTIONAL_38_PROVINCES: ProvinceDistributionItemDTO[] = [
  {
    id: 'prov-jatim',
    provinceCode: 'JATIM',
    provinceName: 'Jawa Timur',
    islandGroup: 'Jawa',
    gridRow: 4,
    gridCol: 5,
    totalShops: 4628,
    tierACount: 412,
    contactedCount: 184,
    activeResellerCount: 1,
    densityLevel: 5,
    cities: [
      { cityName: 'Kota Surabaya', shopCount: 1420, tierACount: 165, activeResellerCount: 1 },
      { cityName: 'Kota Malang', shopCount: 685, tierACount: 74, activeResellerCount: 0 },
      { cityName: 'Kabupaten Sidoarjo', shopCount: 512, tierACount: 48, activeResellerCount: 0 },
      { cityName: 'Kabupaten Gresik', shopCount: 340, tierACount: 29, activeResellerCount: 0 },
      { cityName: 'Kota Kediri', shopCount: 298, tierACount: 24, activeResellerCount: 0 },
      { cityName: 'Kabupaten Jember', shopCount: 274, tierACount: 19, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-jateng',
    provinceCode: 'JATENG',
    provinceName: 'Jawa Tengah',
    islandGroup: 'Jawa',
    gridRow: 4,
    gridCol: 4,
    totalShops: 3282,
    tierACount: 286,
    contactedCount: 118,
    activeResellerCount: 0,
    densityLevel: 5,
    cities: [
      { cityName: 'Kota Semarang', shopCount: 980, tierACount: 112, activeResellerCount: 0 },
      { cityName: 'Kota Surakarta (Solo)', shopCount: 640, tierACount: 68, activeResellerCount: 0 },
      { cityName: 'Kabupaten Banyumas', shopCount: 385, tierACount: 31, activeResellerCount: 0 },
      { cityName: 'Kota Pekalongan', shopCount: 290, tierACount: 22, activeResellerCount: 0 },
      { cityName: 'Kabupaten Kudus', shopCount: 245, tierACount: 18, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-jabar',
    provinceCode: 'JABAR',
    provinceName: 'Jawa Barat',
    islandGroup: 'Jawa',
    gridRow: 4,
    gridCol: 3,
    totalShops: 3266,
    tierACount: 310,
    contactedCount: 142,
    activeResellerCount: 0,
    densityLevel: 5,
    cities: [
      { cityName: 'Kota Bandung', shopCount: 1120, tierACount: 134, activeResellerCount: 0 },
      { cityName: 'Kota Bekasi', shopCount: 740, tierACount: 68, activeResellerCount: 0 },
      { cityName: 'Kota Bogor', shopCount: 490, tierACount: 42, activeResellerCount: 0 },
      { cityName: 'Kota Depok', shopCount: 410, tierACount: 35, activeResellerCount: 0 },
      { cityName: 'Kota Cirebon', shopCount: 260, tierACount: 19, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sumut',
    provinceCode: 'SUMUT',
    provinceName: 'Sumatera Utara',
    islandGroup: 'Sumatera',
    gridRow: 1,
    gridCol: 0,
    totalShops: 1137,
    tierACount: 148,
    contactedCount: 64,
    activeResellerCount: 1,
    densityLevel: 4,
    cities: [
      { cityName: 'Kota Medan', shopCount: 684, tierACount: 98, activeResellerCount: 0 },
      { cityName: 'Kota Tebing Tinggi', shopCount: 142, tierACount: 19, activeResellerCount: 1 },
      { cityName: 'Kota Binjai', shopCount: 118, tierACount: 14, activeResellerCount: 0 },
      { cityName: 'Kota Pematangsiantar', shopCount: 105, tierACount: 11, activeResellerCount: 0 },
      { cityName: 'Kabupaten Deli Serdang', shopCount: 88, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-riau',
    provinceCode: 'RIAU',
    provinceName: 'Riau',
    islandGroup: 'Sumatera',
    gridRow: 1,
    gridCol: 1,
    totalShops: 882,
    tierACount: 94,
    contactedCount: 41,
    activeResellerCount: 1,
    densityLevel: 4,
    cities: [
      { cityName: 'Kota Pekanbaru', shopCount: 540, tierACount: 64, activeResellerCount: 1 },
      { cityName: 'Kota Dumai', shopCount: 162, tierACount: 15, activeResellerCount: 0 },
      { cityName: 'Kabupaten Kampar', shopCount: 110, tierACount: 9, activeResellerCount: 0 },
      { cityName: 'Kabupaten Bengkalis', shopCount: 70, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sumbar',
    provinceCode: 'SUMBAR',
    provinceName: 'Sumatera Barat',
    islandGroup: 'Sumatera',
    gridRow: 2,
    gridCol: 0,
    totalShops: 786,
    tierACount: 82,
    contactedCount: 38,
    activeResellerCount: 2,
    densityLevel: 4,
    cities: [
      { cityName: 'Kota Padang', shopCount: 410, tierACount: 48, activeResellerCount: 0 },
      { cityName: 'Kota Bukittinggi', shopCount: 195, tierACount: 21, activeResellerCount: 1 },
      { cityName: 'Kabupaten Dharmasraya', shopCount: 96, tierACount: 7, activeResellerCount: 1 },
      { cityName: 'Kota Payakumbuh', shopCount: 85, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sulsel',
    provinceCode: 'SULSEL',
    provinceName: 'Sulawesi Selatan',
    islandGroup: 'Sulawesi',
    gridRow: 3,
    gridCol: 6,
    totalShops: 781,
    tierACount: 88,
    contactedCount: 35,
    activeResellerCount: 0,
    densityLevel: 4,
    cities: [
      { cityName: 'Kota Makassar', shopCount: 520, tierACount: 64, activeResellerCount: 0 },
      { cityName: 'Kota Parepare', shopCount: 115, tierACount: 12, activeResellerCount: 0 },
      { cityName: 'Kota Palopo', shopCount: 86, tierACount: 8, activeResellerCount: 0 },
      { cityName: 'Kabupaten Gowa', shopCount: 60, tierACount: 4, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-banten',
    provinceCode: 'BANTEN',
    provinceName: 'Banten',
    islandGroup: 'Jawa',
    gridRow: 4,
    gridCol: 1,
    totalShops: 738,
    tierACount: 76,
    contactedCount: 29,
    activeResellerCount: 0,
    densityLevel: 4,
    cities: [
      { cityName: 'Kota Tangerang', shopCount: 340, tierACount: 38, activeResellerCount: 0 },
      { cityName: 'Kota Tangerang Selatan', shopCount: 245, tierACount: 26, activeResellerCount: 0 },
      { cityName: 'Kota Serang', shopCount: 95, tierACount: 8, activeResellerCount: 0 },
      { cityName: 'Kota Cilegon', shopCount: 58, tierACount: 4, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sumsel',
    provinceCode: 'SUMSEL',
    provinceName: 'Sumatera Selatan',
    islandGroup: 'Sumatera',
    gridRow: 2,
    gridCol: 2,
    totalShops: 576,
    tierACount: 62,
    contactedCount: 27,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Palembang', shopCount: 390, tierACount: 46, activeResellerCount: 0 },
      { cityName: 'Kota Lubuklinggau', shopCount: 98, tierACount: 9, activeResellerCount: 0 },
      { cityName: 'Kota Prabumulih', shopCount: 88, tierACount: 7, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-lampung',
    provinceCode: 'LAMPUNG',
    provinceName: 'Lampung',
    islandGroup: 'Sumatera',
    gridRow: 3,
    gridCol: 2,
    totalShops: 566,
    tierACount: 58,
    contactedCount: 22,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Bandar Lampung', shopCount: 380, tierACount: 42, activeResellerCount: 0 },
      { cityName: 'Kota Metro', shopCount: 112, tierACount: 10, activeResellerCount: 0 },
      { cityName: 'Kabupaten Lampung Tengah', shopCount: 74, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-bali',
    provinceCode: 'BALI',
    provinceName: 'Bali',
    islandGroup: 'Bali & Nusa Tenggara',
    gridRow: 5,
    gridCol: 5,
    totalShops: 554,
    tierACount: 68,
    contactedCount: 31,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Denpasar', shopCount: 345, tierACount: 44, activeResellerCount: 0 },
      { cityName: 'Kabupaten Badung', shopCount: 135, tierACount: 18, activeResellerCount: 0 },
      { cityName: 'Kabupaten Gianyar', shopCount: 74, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-diy',
    provinceCode: 'DIY',
    provinceName: 'Daerah Istimewa Yogyakarta',
    islandGroup: 'Jawa',
    gridRow: 5,
    gridCol: 4,
    totalShops: 465,
    tierACount: 54,
    contactedCount: 26,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Yogyakarta', shopCount: 240, tierACount: 30, activeResellerCount: 0 },
      { cityName: 'Kabupaten Sleman', shopCount: 155, tierACount: 18, activeResellerCount: 0 },
      { cityName: 'Kabupaten Bantul', shopCount: 70, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-aceh',
    provinceCode: 'ACEH',
    provinceName: 'Aceh',
    islandGroup: 'Sumatera',
    gridRow: 0,
    gridCol: 0,
    totalShops: 458,
    tierACount: 42,
    contactedCount: 18,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Banda Aceh', shopCount: 245, tierACount: 26, activeResellerCount: 0 },
      { cityName: 'Kota Lhokseumawe', shopCount: 125, tierACount: 10, activeResellerCount: 0 },
      { cityName: 'Kota Langsa', shopCount: 88, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-dki',
    provinceCode: 'DKI',
    provinceName: 'DKI Jakarta',
    islandGroup: 'Jawa',
    gridRow: 4,
    gridCol: 2,
    totalShops: 430,
    tierACount: 86,
    contactedCount: 48,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Jakarta Pusat', shopCount: 165, tierACount: 38, activeResellerCount: 0 },
      { cityName: 'Kota Jakarta Selatan', shopCount: 110, tierACount: 22, activeResellerCount: 0 },
      { cityName: 'Kota Jakarta Barat', shopCount: 95, tierACount: 16, activeResellerCount: 0 },
      { cityName: 'Kota Jakarta Timur', shopCount: 60, tierACount: 10, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-ntb',
    provinceCode: 'NTB',
    provinceName: 'Nusa Tenggara Barat',
    islandGroup: 'Bali & Nusa Tenggara',
    gridRow: 5,
    gridCol: 6,
    totalShops: 394,
    tierACount: 36,
    contactedCount: 14,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Mataram', shopCount: 254, tierACount: 25, activeResellerCount: 0 },
      { cityName: 'Kota Bima', shopCount: 140, tierACount: 11, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-kalsel',
    provinceCode: 'KALSEL',
    provinceName: 'Kalimantan Selatan',
    islandGroup: 'Kalimantan',
    gridRow: 2,
    gridCol: 5,
    totalShops: 393,
    tierACount: 38,
    contactedCount: 15,
    activeResellerCount: 0,
    densityLevel: 3,
    cities: [
      { cityName: 'Kota Banjarmasin', shopCount: 265, tierACount: 28, activeResellerCount: 0 },
      { cityName: 'Kota Banjarbaru', shopCount: 128, tierACount: 10, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-kaltim',
    provinceCode: 'KALTIM',
    provinceName: 'Kalimantan Timur',
    islandGroup: 'Kalimantan',
    gridRow: 1,
    gridCol: 5,
    totalShops: 311,
    tierACount: 34,
    contactedCount: 14,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Samarinda', shopCount: 175, tierACount: 20, activeResellerCount: 0 },
      { cityName: 'Kota Balikpapan', shopCount: 136, tierACount: 14, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-kalbar',
    provinceCode: 'KALBAR',
    provinceName: 'Kalimantan Barat',
    islandGroup: 'Kalimantan',
    gridRow: 1,
    gridCol: 3,
    totalShops: 291,
    tierACount: 29,
    contactedCount: 11,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Pontianak', shopCount: 198, tierACount: 21, activeResellerCount: 0 },
      { cityName: 'Kota Singkawang', shopCount: 93, tierACount: 8, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sultra',
    provinceCode: 'SULTRA',
    provinceName: 'Sulawesi Tenggara',
    islandGroup: 'Sulawesi',
    gridRow: 3,
    gridCol: 7,
    totalShops: 239,
    tierACount: 22,
    contactedCount: 9,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Kendari', shopCount: 164, tierACount: 16, activeResellerCount: 0 },
      { cityName: 'Kota Baubau', shopCount: 75, tierACount: 6, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sulteng',
    provinceCode: 'SULTENG',
    provinceName: 'Sulawesi Tengah',
    islandGroup: 'Sulawesi',
    gridRow: 2,
    gridCol: 6,
    totalShops: 218,
    tierACount: 19,
    contactedCount: 8,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Palu', shopCount: 152, tierACount: 14, activeResellerCount: 0 },
      { cityName: 'Kabupaten Banggai', shopCount: 66, tierACount: 5, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-jambi',
    provinceCode: 'JAMBI',
    provinceName: 'Jambi',
    islandGroup: 'Sumatera',
    gridRow: 2,
    gridCol: 1,
    totalShops: 204,
    tierACount: 18,
    contactedCount: 7,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Jambi', shopCount: 148, tierACount: 14, activeResellerCount: 0 },
      { cityName: 'Kota Sungai Penuh', shopCount: 56, tierACount: 4, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-sulut',
    provinceCode: 'SULUT',
    provinceName: 'Sulawesi Utara',
    islandGroup: 'Sulawesi',
    gridRow: 1,
    gridCol: 7,
    totalShops: 196,
    tierACount: 21,
    contactedCount: 9,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Manado', shopCount: 142, tierACount: 16, activeResellerCount: 0 },
      { cityName: 'Kota Bitung', shopCount: 54, tierACount: 5, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-ntt',
    provinceCode: 'NTT',
    provinceName: 'Nusa Tenggara Timur',
    islandGroup: 'Bali & Nusa Tenggara',
    gridRow: 5,
    gridCol: 7,
    totalShops: 184,
    tierACount: 16,
    contactedCount: 6,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Kupang', shopCount: 128, tierACount: 12, activeResellerCount: 0 },
      { cityName: 'Kabupaten Sikka', shopCount: 56, tierACount: 4, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-kepri',
    provinceCode: 'KEPRI',
    provinceName: 'Kepulauan Riau',
    islandGroup: 'Sumatera',
    gridRow: 1,
    gridCol: 2,
    totalShops: 172,
    tierACount: 22,
    contactedCount: 10,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Batam', shopCount: 128, tierACount: 18, activeResellerCount: 0 },
      { cityName: 'Kota Tanjungpinang', shopCount: 44, tierACount: 4, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-bengkulu',
    provinceCode: 'BENGKULU',
    provinceName: 'Bengkulu',
    islandGroup: 'Sumatera',
    gridRow: 3,
    gridCol: 1,
    totalShops: 148,
    tierACount: 12,
    contactedCount: 5,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [{ cityName: 'Kota Bengkulu', shopCount: 148, tierACount: 12, activeResellerCount: 0 }],
  },
  {
    id: 'prov-babel',
    provinceCode: 'BABEL',
    provinceName: 'Kepulauan Bangka Belitung',
    islandGroup: 'Sumatera',
    gridRow: 2,
    gridCol: 3,
    totalShops: 132,
    tierACount: 11,
    contactedCount: 4,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Pangkalpinang', shopCount: 92, tierACount: 8, activeResellerCount: 0 },
      { cityName: 'Kabupaten Belitung', shopCount: 40, tierACount: 3, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-kalteng',
    provinceCode: 'KALTENG',
    provinceName: 'Kalimantan Tengah',
    islandGroup: 'Kalimantan',
    gridRow: 2,
    gridCol: 4,
    totalShops: 126,
    tierACount: 11,
    contactedCount: 4,
    activeResellerCount: 0,
    densityLevel: 2,
    cities: [
      { cityName: 'Kota Palangka Raya', shopCount: 84, tierACount: 8, activeResellerCount: 0 },
      { cityName: 'Kabupaten Kotawaringin Timur', shopCount: 42, tierACount: 3, activeResellerCount: 0 },
    ],
  },
  {
    id: 'prov-maluku',
    provinceCode: 'MALUKU',
    provinceName: 'Maluku',
    islandGroup: 'Maluku & Papua',
    gridRow: 3,
    gridCol: 8,
    totalShops: 94,
    tierACount: 8,
    contactedCount: 3,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Ambon', shopCount: 94, tierACount: 8, activeResellerCount: 0 }],
  },
  {
    id: 'prov-gorontalo',
    provinceCode: 'GORONTALO',
    provinceName: 'Gorontalo',
    islandGroup: 'Sulawesi',
    gridRow: 1,
    gridCol: 6,
    totalShops: 88,
    tierACount: 7,
    contactedCount: 3,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Gorontalo', shopCount: 88, tierACount: 7, activeResellerCount: 0 }],
  },
  {
    id: 'prov-papua',
    provinceCode: 'PAPUA',
    provinceName: 'Papua',
    islandGroup: 'Maluku & Papua',
    gridRow: 2,
    gridCol: 10,
    totalShops: 76,
    tierACount: 7,
    contactedCount: 2,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Jayapura', shopCount: 76, tierACount: 7, activeResellerCount: 0 }],
  },
  {
    id: 'prov-kaltara',
    provinceCode: 'KALTARA',
    provinceName: 'Kalimantan Utara',
    islandGroup: 'Kalimantan',
    gridRow: 0,
    gridCol: 5,
    totalShops: 64,
    tierACount: 5,
    contactedCount: 2,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Tarakan', shopCount: 64, tierACount: 5, activeResellerCount: 0 }],
  },
  {
    id: 'prov-malut',
    provinceCode: 'MALUT',
    provinceName: 'Maluku Utara',
    islandGroup: 'Maluku & Papua',
    gridRow: 1,
    gridCol: 8,
    totalShops: 58,
    tierACount: 5,
    contactedCount: 2,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Ternate', shopCount: 58, tierACount: 5, activeResellerCount: 0 }],
  },
  {
    id: 'prov-sulbar',
    provinceCode: 'SULBAR',
    provinceName: 'Sulawesi Barat',
    islandGroup: 'Sulawesi',
    gridRow: 2,
    gridCol: 7,
    totalShops: 49,
    tierACount: 4,
    contactedCount: 1,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kabupaten Mamuju', shopCount: 49, tierACount: 4, activeResellerCount: 0 }],
  },
  {
    id: 'prov-pabar',
    provinceCode: 'PABAR',
    provinceName: 'Papua Barat',
    islandGroup: 'Maluku & Papua',
    gridRow: 2,
    gridCol: 9,
    totalShops: 38,
    tierACount: 3,
    contactedCount: 1,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kabupaten Manokwari', shopCount: 38, tierACount: 3, activeResellerCount: 0 }],
  },
  {
    id: 'prov-papsel',
    provinceCode: 'PAPSEL',
    provinceName: 'Papua Selatan',
    islandGroup: 'Maluku & Papua',
    gridRow: 4,
    gridCol: 11,
    totalShops: 24,
    tierACount: 2,
    contactedCount: 1,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kabupaten Merauke', shopCount: 24, tierACount: 2, activeResellerCount: 0 }],
  },
  {
    id: 'prov-papteng',
    provinceCode: 'PAPTENG',
    provinceName: 'Papua Tengah',
    islandGroup: 'Maluku & Papua',
    gridRow: 3,
    gridCol: 10,
    totalShops: 19,
    tierACount: 2,
    contactedCount: 1,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kabupaten Mimika (Timika)', shopCount: 19, tierACount: 2, activeResellerCount: 0 }],
  },
  {
    id: 'prov-pabd',
    provinceCode: 'PABD',
    provinceName: 'Papua Barat Daya',
    islandGroup: 'Maluku & Papua',
    gridRow: 1,
    gridCol: 9,
    totalShops: 14,
    tierACount: 1,
    contactedCount: 0,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kota Sorong', shopCount: 14, tierACount: 1, activeResellerCount: 0 }],
  },
  {
    id: 'prov-pappeg',
    provinceCode: 'PAPPEG',
    provinceName: 'Papua Pegunungan',
    islandGroup: 'Maluku & Papua',
    gridRow: 3,
    gridCol: 11,
    totalShops: 4,
    tierACount: 0,
    contactedCount: 0,
    activeResellerCount: 0,
    densityLevel: 1,
    cities: [{ cityName: 'Kabupaten Jayawijaya (Wamena)', shopCount: 4, tierACount: 0, activeResellerCount: 0 }],
  },
];

/**
 * Simulated Go Backend REST Call: GET /api/v1/database/bundle
 * Honors all 4 async simulation states ('success' | 'loading' | 'empty' | 'error').
 */
export async function fetchDatabaseHubBundle(
  simState: AsyncSimState = 'success'
): Promise<DatabaseHubBundleDTO> {
  await new Promise((resolve) => setTimeout(resolve, 140));

  if (simState === 'error') {
    throw new Error(
      'Gagal memuat data modul Data & Peta Toko dari server Go API (:8080/api/v1/database/bundle).'
    );
  }

  const isEmpty = simState === 'empty';

  return {
    totalAllShopsVirtualCount: isEmpty ? 0 : 133079,
    totalTierAShopsVirtualCount: isEmpty ? 0 : 1737,
    totalActiveResellersCount: isEmpty ? 0 : 5,
    availableCities: [
      'Kota Medan',
      'Kota Surabaya',
      'Kota Jakarta Pusat',
      'Kota Pekanbaru',
      'Kota Tebing Tinggi',
      'Kota Bukittinggi',
      'Kabupaten Dharmasraya',
      'Kota Bandung',
      'Kota Semarang',
      'Kota Makassar',
      'Kota Denpasar',
    ],
    shops: isEmpty ? [] : FICTIONAL_DATABASE_SHOPS,
    provinces: isEmpty ? [] : FICTIONAL_38_PROVINCES,
  };
}

/* ============================================================================
 * STAGE 3b TYPED DTOs: "KATALOG & MEDIA" HUB (2 SEGMENTS + DIALOG d05)
 * ============================================================================ */

export type PriceCatalogCategoryFilterOption =
  | 'Semua Kategori'
  | 'Ex-iBox (Second Resmi)'
  | 'New iBox (Segel Resmi)'
  | 'Inter (All Operator)';

export interface PriceCatalogItemDTO {
  id: string;
  modelName: string;
  capacityLabel: string;
  warrantyCategory:
    | 'Ex-iBox (Second Resmi)'
    | 'New iBox (Segel Resmi)'
    | 'Inter (All Operator)';
  warrantyBadgeShort: 'Ex-iBox' | 'New iBox' | 'Inter';
  minPriceIdr: number;
  maxPriceIdr: number;
  syncedAtLabel: string;
  erpSkuCode: string;
}

export type PromotionalMediaCategory =
  | 'Katalog Harga (PDF/Gambar)'
  | 'Brosur Program'
  | 'Panduan Garansi'
  | 'Materi Kampanye';

export interface PromotionalMediaItemDTO {
  id: string;
  rowNumber: number;
  documentTitle: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG';
  category: PromotionalMediaCategory;
  fileSizeLabel: string;
  waMediaHandle: string;
  waHashCacheNote: string;
  updatedAtWib: string;
}

export interface DeletedMediaItemDTO {
  id: string;
  documentTitle: string;
  fileName: string;
  category: PromotionalMediaCategory;
  fileSizeLabel: string;
  waMediaHandle: string;
  deletedAtWib: string;
  deletedByOperator: string;
}

export interface UploadMediaPayloadDTO {
  documentTitle: string;
  category: PromotionalMediaCategory;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
}

export interface KatalogMediaHubBundleDTO {
  priceCatalog: {
    headerBadgeLabel: string;
    title: string;
    subtitle: string;
    calloutTitle: string;
    calloutBody: string;
    lastErpSyncWib: string;
    categoryFilterOptions: PriceCatalogCategoryFilterOption[];
    items: PriceCatalogItemDTO[];
  };
  promotionalMedia: {
    headerBadgeLabel: string;
    title: string;
    subtitle: string;
    kpiTotalFilesCount: number;
    kpiTotalFilesSubtext: string;
    kpiDistributionChannelLabel: string;
    kpiDistributionSubtext: string;
    hashCachingBlueprintTitle: string;
    hashCachingBlueprintBody: string;
    categoryOptions: PromotionalMediaCategory[];
    activeItems: PromotionalMediaItemDTO[];
    deletedItems: DeletedMediaItemDTO[];
  };
}

const FICTIONAL_PRICE_CATALOG_ITEMS: PriceCatalogItemDTO[] = [
  {
    id: 'cat-01',
    modelName: 'iPhone 11',
    capacityLabel: '64GB / 128GB',
    warrantyCategory: 'Ex-iBox (Second Resmi)',
    warrantyBadgeShort: 'Ex-iBox',
    minPriceIdr: 4150000,
    maxPriceIdr: 4850000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP11-EX',
  },
  {
    id: 'cat-02',
    modelName: 'iPhone 12',
    capacityLabel: '64GB / 128GB',
    warrantyCategory: 'Ex-iBox (Second Resmi)',
    warrantyBadgeShort: 'Ex-iBox',
    minPriceIdr: 5400000,
    maxPriceIdr: 6250000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP12-EX',
  },
  {
    id: 'cat-03',
    modelName: 'iPhone 12 Pro',
    capacityLabel: '128GB / 256GB',
    warrantyCategory: 'Inter (All Operator)',
    warrantyBadgeShort: 'Inter',
    minPriceIdr: 6850000,
    maxPriceIdr: 7650000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP12P-INT',
  },
  {
    id: 'cat-04',
    modelName: 'iPhone 13',
    capacityLabel: '128GB / 256GB',
    warrantyCategory: 'Ex-iBox (Second Resmi)',
    warrantyBadgeShort: 'Ex-iBox',
    minPriceIdr: 7350000,
    maxPriceIdr: 8400000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP13-EX',
  },
  {
    id: 'cat-05',
    modelName: 'iPhone 13',
    capacityLabel: '128GB',
    warrantyCategory: 'New iBox (Segel Resmi)',
    warrantyBadgeShort: 'New iBox',
    minPriceIdr: 9650000,
    maxPriceIdr: 9950000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP13-NEW',
  },
  {
    id: 'cat-06',
    modelName: 'iPhone 13 Pro',
    capacityLabel: '128GB / 256GB',
    warrantyCategory: 'Ex-iBox (Second Resmi)',
    warrantyBadgeShort: 'Ex-iBox',
    minPriceIdr: 9800000,
    maxPriceIdr: 11200000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP13P-EX',
  },
  {
    id: 'cat-07',
    modelName: 'iPhone 14',
    capacityLabel: '128GB / 256GB',
    warrantyCategory: 'Ex-iBox (Second Resmi)',
    warrantyBadgeShort: 'Ex-iBox',
    minPriceIdr: 8950000,
    maxPriceIdr: 10150000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP14-EX',
  },
  {
    id: 'cat-08',
    modelName: 'iPhone 15',
    capacityLabel: '128GB / 256GB',
    warrantyCategory: 'New iBox (Segel Resmi)',
    warrantyBadgeShort: 'New iBox',
    minPriceIdr: 12850000,
    maxPriceIdr: 14650000,
    syncedAtLabel: 'Hari ini · 08.30 WIB',
    erpSkuCode: 'RG-IP15-NEW',
  },
];

const FICTIONAL_PROMO_MEDIA_ACTIVE: PromotionalMediaItemDTO[] = [
  {
    id: 'med-01',
    rowNumber: 1,
    documentTitle: 'Brosur Harga Grosir iPhone Ex-iBox Minggu Ke-4 Oktober',
    fileName: 'pricelist-grosir-ex-ibox-okt-w4.pdf',
    fileType: 'PDF',
    category: 'Katalog Harga (PDF/Gambar)',
    fileSizeLabel: '412 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDNBMDhGMkM5RTRCMTAA',
    waHashCacheNote: 'SHA-256 cached · Siap forward instan tanpa re-upload',
    updatedAtWib: '29 Okt 2026 · 08.15 WIB',
  },
  {
    id: 'med-02',
    rowNumber: 2,
    documentTitle: 'Panduan Program Titip Jual (Konsinyasi) Mitra Tier A',
    fileName: 'panduan-konsinyasi-tier-a-2026.pdf',
    fileType: 'PDF',
    category: 'Brosur Program',
    fileSizeLabel: '628 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDdCMTllNEEwOTlGMjAA',
    waHashCacheNote: 'SHA-256 cached · Siap forward instan tanpa re-upload',
    updatedAtWib: '27 Okt 2026 · 14.20 WIB',
  },
  {
    id: 'med-03',
    rowNumber: 3,
    documentTitle: 'Infografis Standar QC 32 Titik & Garansi Tukar Unit 7 Hari',
    fileName: 'sop-qc-32-titik-garansi-retur.jpg',
    fileType: 'JPG',
    category: 'Panduan Garansi',
    fileSizeLabel: '285 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDRDODBBNzEyMTBCMwA=',
    waHashCacheNote: 'SHA-256 cached · Siap forward instan tanpa re-upload',
    updatedAtWib: '25 Okt 2026 · 10.05 WIB',
  },
  {
    id: 'med-04',
    rowNumber: 4,
    documentTitle: 'Poster Promo Bundel 10 Unit New iBox Bebas Ongkir Asuransi',
    fileName: 'poster-promo-bundel-10unit-new-ibox.png',
    fileType: 'PNG',
    category: 'Materi Kampanye',
    fileSizeLabel: '354 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDlFRjQxMkM3ODhBNOA=',
    waHashCacheNote: 'SHA-256 cached · Siap forward instan tanpa re-upload',
    updatedAtWib: '22 Okt 2026 · 16.40 WIB',
  },
];

const FICTIONAL_PROMO_MEDIA_DELETED: DeletedMediaItemDTO[] = [
  {
    id: 'med-del-01',
    documentTitle: 'Katalog Harga Grosir iPhone Minggu Ke-2 Oktober (Arsip)',
    fileName: 'pricelist-grosir-okt-w2-lama.pdf',
    category: 'Katalog Harga (PDF/Gambar)',
    fileSizeLabel: '390 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDFFMjhDOUExMDBGNQA=',
    deletedAtWib: '21 Okt 2026 · 09.10 WIB',
    deletedByOperator: 'Nadia Kusuma Wardani',
  },
  {
    id: 'med-del-02',
    documentTitle: 'Flyer Kampanye Diskon Awal Bulan Oktober',
    fileName: 'flyer-awal-oktober-2026.jpg',
    category: 'Materi Kampanye',
    fileSizeLabel: '310 KB',
    waMediaHandle: 'wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFDVBNzJCMTllNDRDMQA=',
    deletedAtWib: '15 Okt 2026 · 17.30 WIB',
    deletedByOperator: 'Nadia Kusuma Wardani',
  },
];

/**
 * Simulated Go Backend REST Call: GET /api/v1/katalog/bundle
 * Honors all 4 async simulation states ('success' | 'loading' | 'empty' | 'error').
 */
export async function fetchKatalogMediaHubBundle(
  simState: AsyncSimState = 'success'
): Promise<KatalogMediaHubBundleDTO> {
  await new Promise((resolve) => setTimeout(resolve, 130));

  if (simState === 'error') {
    throw new Error(
      'Gagal memuat data modul Katalog & Media dari server Go API (:8080/api/v1/katalog/bundle).'
    );
  }

  const isEmpty = simState === 'empty';

  return {
    priceCatalog: {
      headerBadgeLabel: 'Katalog Acuan Indikatif Harian (Tanpa Stok Fisik / IMEI)',
      title: 'Katalog Harga Acuan Reseller',
      subtitle:
        'Rentang harga grosir harian untuk sapaan awal dan negosiasi mitra toko HP di seluruh Indonesia.',
      calloutTitle: 'Katalog Acuan Indikatif Harian (Tanpa Stok Fisik / IMEI)',
      calloutBody:
        'Harga Acuan Indikatif (Bukan Stok Fisik Mengikat — Stok Real-Time & IMEI dikelola di RG ERP). Gunakan tombol Salin Harga untuk menyisipkan rentang harga ke percakapan WhatsApp.',
      lastErpSyncWib: '29 Okt 2026 · 08.30 WIB',
      categoryFilterOptions: [
        'Semua Kategori',
        'Ex-iBox (Second Resmi)',
        'New iBox (Segel Resmi)',
        'Inter (All Operator)',
      ],
      items: isEmpty ? [] : FICTIONAL_PRICE_CATALOG_ITEMS,
    },
    promotionalMedia: {
      headerBadgeLabel: 'Pustaka Media & Brosur WhatsApp',
      title: 'Pustaka Media Promosi',
      subtitle:
        'Kelola dokumen PDF dan gambar promosi yang siap dikirim ke prospek tanpa unggah berulang.',
      kpiTotalFilesCount: isEmpty ? 0 : FICTIONAL_PROMO_MEDIA_ACTIVE.length,
      kpiTotalFilesSubtext: 'Berkas aktif siap distribusi lintas sesi WA',
      kpiDistributionChannelLabel: 'Sesi WA',
      kpiDistributionSubtext: 'Terhubung ke 2 sesi nomor aktif dengan Hash Caching',
      hashCachingBlueprintTitle: 'Teknologi WhatsApp Media Hash Caching (Blueprint §3.4)',
      hashCachingBlueprintBody:
        'Setiap berkas PDF/Gambar yang diunggah dihitung sidik jari SHA-256 dan disimpan sebagai Media Handle WhatsApp. Saat Sales mengirim brosur di Hunter Chat, sistem meneruskan Media Handle yang sudah ter-cache tanpa mengunggah ulang byte berkas ke server WhatsApp.',
      categoryOptions: [
        'Katalog Harga (PDF/Gambar)',
        'Brosur Program',
        'Panduan Garansi',
        'Materi Kampanye',
      ],
      activeItems: isEmpty ? [] : FICTIONAL_PROMO_MEDIA_ACTIVE,
      deletedItems: isEmpty ? [] : FICTIONAL_PROMO_MEDIA_DELETED,
    },
  };
}

/* ============================================================================
 * STAGE 4a: "Laporan & Target" & "Impor Data" Hub DTOs & Datasets
 * ============================================================================ */

// 1. Hub Laporan & Target (`laporan`)
export interface ReplyRateTierRowDTO {
  id: string;
  tier: 'Tier A' | 'Tier B' | 'Tier C' | 'Tier X';
  totalToko: number;
  tokoDisapa: number;
  tokoMembalas: number;
  replyRateLabel: string;
  isValidSample: boolean;
  validityBadgeText: string;
}

export interface StockDistributionSummaryDTO {
  title: string;
  locationLabel: string;
  readyShowcaseUnits: number;
  readyShowcaseSubtext: string;
  consignedUnits: number;
  consignedSubtext: string;
  soldAndRemittedUnits: number;
  soldAndRemittedSubtext: string;
}

export interface LaporanPeriodeDTO {
  bankDataCounter: number;
  bankDataSubtext: string;
  aiOptInToko: number;
  aiOptInSubtext: string;
  pendingStockTickets: number;
  pendingStockSubtext: string;
  b2bRevenueJuta: number;
  b2bRevenueFormatted: string;
  b2bRevenueSubtext: string;
  stockDistribution: StockDistributionSummaryDTO;
  replyRateTable: {
    title: string;
    subtitle: string;
    thresholdBadgeText: string;
    rows: ReplyRateTierRowDTO[];
  };
}

export interface SalesRepTargetProgressDTO {
  id: string;
  name: string;
  currentCount: number;
  targetCount: number;
  percentage: number;
}

export interface LaporanTargetDTO {
  title: string;
  salesReps: SalesRepTargetProgressDTO[];
  outreachPanel: {
    title: string;
    subtitle: string;
    currentReached: number;
    targetReached: number;
    achievedPercentLabel: string;
    safeCapacityPerNumber: string;
    teamDailyTarget: string;
    sendMethod: string;
    waSafetyStatus: string;
  };
}

export type SapaanPeriodDays = 7 | 30 | 90;

export interface SapaanTierPerformanceDTO {
  id: string;
  tier: string;
  disapa: number;
  membalas: number;
  pamit: number;
  angkaBalas: string;
}

export interface SapaanTemplatePerformanceDTO {
  id: string;
  templateId: string;
  templateName: string;
  disapa: number;
  membalas: number;
  pamit: number;
  angkaBalas: string;
}

export interface SapaanHourPerformanceDTO {
  id: string;
  hourRangeWib: string;
  disapa: number;
  membalas: number;
  pamit: number;
  angkaBalas: string;
}

export interface LaporanSapaanDTO {
  title: string;
  subtitle: string;
  activePeriod: SapaanPeriodDays;
  kpis: {
    tokoDisapa: number;
    tokoDisapaSubtext: string;
    tokoMembalas: number;
    tokoMembalasSubtext: string;
    pamitMenolak: number;
    pamitMenolakSubtext: string;
    angkaBalasLabel: string;
    angkaBalasSubtext: string;
  };
  chartSummary: {
    title: string;
    subtitle: string;
    bars: { label: string; count: number; percentage: number }[];
  };
  tierTable: SapaanTierPerformanceDTO[];
  templateTable: SapaanTemplatePerformanceDTO[];
  hourTable: SapaanHourPerformanceDTO[];
}

export interface LaporanHubBundleDTO {
  periode: LaporanPeriodeDTO;
  target: LaporanTargetDTO;
  sapaan: LaporanSapaanDTO;
}

// 2. Hub Impor Data (`impor`)
export interface ImportHistoryRowDTO {
  id: string;
  waktuWib: string;
  berkasName: string;
  fileSizeBytes: number;
  olehOperator: string;
  totalBaris: number;
  diimporCount: number;
  dilewatiCount: number;
  duplikatCount: number;
}

export interface StockUploadHistoryRowDTO {
  id: string;
  waktuUnggahWib: string;
  berkasName: string;
  status: 'Diterbitkan' | 'Menunggu Verifikasi' | 'Ditolak';
  diterimaCount: number;
  ditolakCount: number;
  aksiLabel: string;
}

export interface PriceUploadHistoryRowDTO {
  id: string;
  waktuUnggahWib: string;
  berkasName: string;
  status: 'Diterbitkan' | 'Menunggu Verifikasi' | 'Ditolak';
  diterimaCount: number;
  ditolakCount: number;
  aksiLabel: string;
}

export interface ImportSimulationReceiptDTO {
  batchId: string;
  fileName: string;
  waktuWib: string;
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
}

export interface ImporHubBundleDTO {
  historyRecords: ImportHistoryRowDTO[];
  stockHistoryRecords: StockUploadHistoryRowDTO[];
  priceHistoryRecords: PriceUploadHistoryRowDTO[];
}

// Fictional datasets for Stage 4a
export const FICTIONAL_REPLY_RATE_TIER_ROWS: ReplyRateTierRowDTO[] = [
  {
    id: 'rr-tier-a',
    tier: 'Tier A',
    totalToko: 1737,
    tokoDisapa: 1,
    tokoMembalas: 1,
    replyRateLabel: '—',
    isValidSample: false,
    validityBadgeText: 'Data belum cukup (< 30 sampel)',
  },
  {
    id: 'rr-tier-b',
    tier: 'Tier B',
    totalToko: 20003,
    tokoDisapa: 1,
    tokoMembalas: 1,
    replyRateLabel: '—',
    isValidSample: false,
    validityBadgeText: 'Data belum cukup (< 30 sampel)',
  },
  {
    id: 'rr-tier-c',
    tier: 'Tier C',
    totalToko: 7880,
    tokoDisapa: 2,
    tokoMembalas: 2,
    replyRateLabel: '—',
    isValidSample: false,
    validityBadgeText: 'Data belum cukup (< 30 sampel)',
  },
  {
    id: 'rr-tier-x',
    tier: 'Tier X',
    totalToko: 103458,
    tokoDisapa: 8934,
    tokoMembalas: 1,
    replyRateLabel: '0.0%',
    isValidSample: true,
    validityBadgeText: '✓ Sampel valid (8934 toko)',
  },
];

export const FICTIONAL_IMPORT_HISTORY_ROWS: ImportHistoryRowDTO[] = [
  {
    id: 'imp-hist-01',
    waktuWib: '28 Okt 2026 · 14.22 WIB',
    berkasName: 'daftar-counter-hp-medan-delitua.xlsx',
    fileSizeBytes: 248 * 1024,
    olehOperator: 'Nadia Kusuma Wardani',
    totalBaris: 420,
    diimporCount: 388,
    dilewatiCount: 14,
    duplikatCount: 18,
  },
  {
    id: 'imp-hist-02',
    waktuWib: '25 Okt 2026 · 10.15 WIB',
    berkasName: 'leads-toko-surabaya-pusat.csv',
    fileSizeBytes: 180 * 1024,
    olehOperator: 'Olivia Putri Marshanda',
    totalBaris: 310,
    diimporCount: 295,
    dilewatiCount: 8,
    duplikatCount: 7,
  },
  {
    id: 'imp-hist-03',
    waktuWib: '20 Okt 2026 · 16.40 WIB',
    berkasName: 'prospek-makassar-panakkukang.xlsx',
    fileSizeBytes: 312 * 1024,
    olehOperator: 'Nadia Kusuma Wardani',
    totalBaris: 550,
    diimporCount: 512,
    dilewatiCount: 15,
    duplikatCount: 23,
  },
];

export const FICTIONAL_STOCK_HISTORY_ROWS: StockUploadHistoryRowDTO[] = [
  {
    id: 'stk-hist-01',
    waktuUnggahWib: '28 Okt 2026 · 08.00 WIB',
    berkasName: 'stok-iphone-minggu-4-okt.xlsx',
    status: 'Diterbitkan',
    diterimaCount: 148,
    ditolakCount: 0,
    aksiLabel: 'Unduh Excel',
  },
  {
    id: 'stk-hist-02',
    waktuUnggahWib: '21 Okt 2026 · 08.15 WIB',
    berkasName: 'stok-iphone-minggu-3-okt.xlsx',
    status: 'Diterbitkan',
    diterimaCount: 132,
    ditolakCount: 2,
    aksiLabel: 'Unduh Excel',
  },
];

export const FICTIONAL_PRICE_HISTORY_ROWS: PriceUploadHistoryRowDTO[] = [
  {
    id: 'prc-hist-01',
    waktuUnggahWib: '29 Okt 2026 · 08.30 WIB',
    berkasName: 'pricelist-acuan-reseller-29okt.xlsx',
    status: 'Diterbitkan',
    diterimaCount: 24,
    ditolakCount: 0,
    aksiLabel: 'Unduh Excel',
  },
  {
    id: 'prc-hist-02',
    waktuUnggahWib: '28 Okt 2026 · 08.20 WIB',
    berkasName: 'pricelist-acuan-reseller-28okt.xlsx',
    status: 'Diterbitkan',
    diterimaCount: 24,
    ditolakCount: 0,
    aksiLabel: 'Unduh Excel',
  },
];

/**
 * Simulated Go Backend REST Call: GET /api/v1/laporan/bundle
 */
export async function fetchLaporanHubBundle(
  simState: AsyncSimState = 'success',
  periodDays: SapaanPeriodDays = 30
): Promise<LaporanHubBundleDTO> {
  await new Promise((resolve) => setTimeout(resolve, 140));

  if (simState === 'error') {
    throw new Error('Gagal memuat modul Laporan & Target dari server Go API (:8080/api/v1/laporan/bundle).');
  }

  const isEmpty = simState === 'empty';

  return {
    periode: {
      bankDataCounter: isEmpty ? 0 : 133079,
      bankDataSubtext: 'Total calon reseller di bank data',
      aiOptInToko: isEmpty ? 0 : 0,
      aiOptInSubtext: 'Percakapan aktif ditangani AI',
      pendingStockTickets: isEmpty ? 0 : 0,
      pendingStockSubtext: '0 tiket telah dikonfirmasi',
      b2bRevenueJuta: isEmpty ? 0 : 0.0,
      b2bRevenueFormatted: 'Rp 0.0 Jt',
      b2bRevenueSubtext: 'Setoran lunas dari mitra',
      stockDistribution: {
        title: 'Ringkasan Distribusi Stok Fisik & Konsinyasi',
        locationLabel: 'Gudang Rumah Gadget',
        readyShowcaseUnits: isEmpty ? 0 : 0,
        readyShowcaseSubtext: 'Siap dijual langsung / konfirmasi AI',
        consignedUnits: isEmpty ? 0 : 0,
        consignedSubtext: 'Sedang dipajang di counter mitra',
        soldAndRemittedUnits: isEmpty ? 0 : 0,
        soldAndRemittedSubtext: 'Lunas masuk rekening Rumah',
      },
      replyRateTable: {
        title: 'Tingkat Balasan Berdasarkan Kualitas Toko (Reply Rate per Tier)',
        subtitle:
          'Evaluasi akurasi model skoring m1-overture — dihitung dari respons riil pesan pertama.',
        thresholdBadgeText: 'Ambang Uji: Min. 30 Kontak',
        rows: isEmpty ? [] : FICTIONAL_REPLY_RATE_TIER_ROWS,
      },
    },
    target: {
      title: 'Target & SLA Tim Sales',
      salesReps: isEmpty
        ? []
        : [
            { id: 'sr-1', name: 'Olivia', currentCount: 0, targetCount: 275, percentage: 0 },
            { id: 'sr-2', name: 'Pujangga', currentCount: 0, targetCount: 25, percentage: 0 },
            { id: 'sr-3', name: 'Alwiyandi', currentCount: 0, targetCount: 25, percentage: 0 },
            { id: 'sr-4', name: 'Budi Santoso (sales1@example.com)', currentCount: 0, targetCount: 25, percentage: 0 },
          ],
      outreachPanel: {
        title: 'Target Penjangkauan Harian (Outreach Target)',
        subtitle: 'Batas aman human-first: maksimal 25 pesan pertama per nomor WhatsApp per hari.',
        currentReached: 0,
        targetReached: 25,
        achievedPercentLabel: '0% Tercapai',
        safeCapacityPerNumber: '25 Toko/Nomor/Hari',
        teamDailyTarget: '25 Toko / Hari',
        sendMethod: '100% Manual wa.me',
        waSafetyStatus: 'Aman / Anti-Banned',
      },
    },
    sapaan: {
      title: 'Efektivitas & Performa Sapaan',
      subtitle: 'Evaluasi konversi sapaan awal ke respon toko mitra berdasarkan data riil sapaan.',
      activePeriod: periodDays,
      kpis: {
        tokoDisapa: isEmpty ? 0 : periodDays === 7 ? 42 : periodDays === 30 ? 182 : 540,
        tokoDisapaSubtext: `Sapaan terkirim (${periodDays} hari)`,
        tokoMembalas: isEmpty ? 0 : periodDays === 7 ? 11 : periodDays === 30 ? 46 : 138,
        tokoMembalasSubtext: 'Balasan aktif non-pamit',
        pamitMenolak: isEmpty ? 0 : periodDays === 7 ? 3 : periodDays === 30 ? 12 : 36,
        pamitMenolakSubtext: 'Status cooling-off / menolak',
        angkaBalasLabel: isEmpty ? '—' : periodDays === 7 ? '26.2%' : periodDays === 30 ? '25.3%' : '25.6%',
        angkaBalasSubtext: 'Rasio respon balasan',
      },
      chartSummary: {
        title: `Distribusi Respon Sapaan (${periodDays} Hari Terakhir)`,
        subtitle: 'Perbandingan sapaan terkirim vs balasan prospek',
        bars: isEmpty
          ? []
          : [
              { label: 'Membalas Positif', count: periodDays === 7 ? 11 : periodDays === 30 ? 46 : 138, percentage: 25.3 },
              { label: 'Menunggu Balasan', count: periodDays === 7 ? 28 : periodDays === 30 ? 124 : 366, percentage: 68.1 },
              { label: 'Pamit / Menolak', count: periodDays === 7 ? 3 : periodDays === 30 ? 12 : 36, percentage: 6.6 },
            ],
      },
      tierTable: isEmpty
        ? []
        : [
            { id: 'st-tier-a', tier: 'Tier A (Skor 80–100)', disapa: 45, membalas: 18, pamit: 2, angkaBalas: '40.0%' },
            { id: 'st-tier-b', tier: 'Tier B (Skor 60–79)', disapa: 85, membalas: 21, pamit: 6, angkaBalas: '24.7%' },
            { id: 'st-tier-c', tier: 'Tier C (Skor 40–59)', disapa: 32, membalas: 6, pamit: 3, angkaBalas: '18.8%' },
            { id: 'st-tier-x', tier: 'Tier X (Belum Diskor)', disapa: 20, membalas: 1, pamit: 1, angkaBalas: '5.0%' },
          ],
      templateTable: isEmpty
        ? []
        : [
            { id: 'st-tpl-1', templateId: 'SP-01', templateName: 'Sapaan Kemitraan Grosir Ex-iBox', disapa: 94, membalas: 28, pamit: 5, angkaBalas: '29.8%' },
            { id: 'st-tpl-2', templateId: 'SP-02', templateName: 'Penawaran Restok Toko Offline', disapa: 56, membalas: 13, pamit: 4, angkaBalas: '23.2%' },
            { id: 'st-tpl-3', templateId: 'SP-03', templateName: 'Konsinyasi Bebas Modal Rumah Gadget', disapa: 32, membalas: 5, pamit: 3, angkaBalas: '15.6%' },
          ],
      hourTable: isEmpty
        ? []
        : [
            { id: 'st-hr-1', hourRangeWib: '09:00 - 11:00 WIB', disapa: 62, membalas: 20, pamit: 3, angkaBalas: '32.3%' },
            { id: 'st-hr-2', hourRangeWib: '11:00 - 13:00 WIB', disapa: 40, membalas: 8, pamit: 2, angkaBalas: '20.0%' },
            { id: 'st-hr-3', hourRangeWib: '13:00 - 15:00 WIB', disapa: 52, membalas: 14, pamit: 4, angkaBalas: '26.9%' },
            { id: 'st-hr-4', hourRangeWib: '15:00 - 17:00 WIB', disapa: 28, membalas: 4, pamit: 3, angkaBalas: '14.3%' },
          ],
    },
  };
}

/**
 * Simulated Go Backend REST Call: GET /api/v1/impor/bundle
 */
export async function fetchImporHubBundle(
  simState: AsyncSimState = 'success'
): Promise<ImporHubBundleDTO> {
  await new Promise((resolve) => setTimeout(resolve, 130));

  if (simState === 'error') {
    throw new Error('Gagal memuat riwayat Impor Data dari server Go API (:8080/api/v1/impor/bundle).');
  }

  const isEmpty = simState === 'empty';

  return {
    historyRecords: isEmpty ? [] : FICTIONAL_IMPORT_HISTORY_ROWS,
    stockHistoryRecords: isEmpty ? [] : FICTIONAL_STOCK_HISTORY_ROWS,
    priceHistoryRecords: isEmpty ? [] : FICTIONAL_PRICE_HISTORY_ROWS,
  };
}

/**
 * Simulated Go Backend REST Call: POST /api/v1/impor/upload
 */
export async function simulateImportUpload(
  fileName: string,
  rowCount = 120,
  simulateError = false
): Promise<ImportSimulationReceiptDTO> {
  await new Promise((resolve) => setTimeout(resolve, 380));

  if (simulateError) {
    throw new Error('Gagal mengurai baris berkas di server Go API. Format kolom tidak sesuai templat.');
  }

  const duplicate = Math.max(2, Math.floor(rowCount * 0.05));
  const skipped = Math.max(1, Math.floor(rowCount * 0.03));
  const imported = rowCount - duplicate - skipped;

  return {
    batchId: `IMP-${Date.now()}`,
    fileName,
    waktuWib: '29 Okt 2026 · 10.30 WIB',
    totalRows: rowCount,
    importedCount: imported,
    skippedCount: skipped,
    duplicateCount: duplicate,
  };
}


