import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AkuisisiHubBundleDTO,
  AsyncSimState,
  BerandaDashboardDTO,
  checkWhatsAppDuplicateInErp,
  CreateFollowUpPayloadDTO,
  CreateShopFromAcquaintancePayloadDTO,
  DatabaseHubBundleDTO,
  DatabaseShopRowDTO,
  ErpDuplicateCheckDTO,
  fetchAkuisisiHubBundle,
  fetchBerandaDashboard,
  fetchDatabaseHubBundle,
  fetchHunterInboxWorkspace,
  fetchImporHubBundle,
  fetchKatalogMediaHubBundle,
  fetchLaporanHubBundle,
  fetchShellBootstrap,
  HandoverSubmissionPayloadDTO,
  HandoverSubmissionReceiptDTO,
  HubId,
  HunterInboxWorkspaceDTO,
  ImporHubBundleDTO,
  ImportSimulationReceiptDTO,
  InboxLeadThreadDTO,
  KatalogMediaHubBundleDTO,
  LaporanHubBundleDTO,
  MoveShopTierPayloadDTO,
  NavHubItem,
  OnlineLinkType,
  OperatorProfileDTO,
  PromotionalMediaItemDTO,
  SapaanPeriodDays,
  SegmentId,
  ShellBootstrapResponseDTO,
  submitResellerHandoverToErp,
  UpdateShopContactNotePayloadDTO,
  UpdateShopDataPayloadDTO,
  UploadMediaPayloadDTO,
  UserRole,
} from '../mock/api';
import { QueueLastAction } from '../components/akuisisi/AntreanHariIniView';

export type ThemeMode = 'light' | 'dark';
export type VisualDirection = 'A' | 'B' | 'C';

export interface AppStateContextValue {
  // Data from Go Mock API (`src/mock/api.ts`)
  bootstrap: ShellBootstrapResponseDTO | null;
  berandaData: BerandaDashboardDTO | null;
  inboxWorkspace: HunterInboxWorkspaceDTO | null;
  akuisisiBundle: AkuisisiHubBundleDTO | null;
  databaseBundle: DatabaseHubBundleDTO | null;
  katalogBundle: KatalogMediaHubBundleDTO | null;
  laporanBundle: LaporanHubBundleDTO | null;
  imporBundle: ImporHubBundleDTO | null;
  visibleHubs: NavHubItem[];
  currentOperator: OperatorProfileDTO | null;
  unreadNotificationCount: number;

  // Navigation & Auth State
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeHub: HubId;
  activeSegment: SegmentId;
  navigateTo: (hub: HubId, segment?: SegmentId) => void;

  // Global Chrome Interactive Controls
  aiKillSwitchActive: boolean;
  toggleAiKillSwitch: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  markAllNotificationsRead: () => void;

  // Hunter Inbox Interactive State & Actions
  selectedThreadId: string;
  setSelectedThreadId: (threadId: string) => void;
  sendInboxMessage: (threadId: string, body: string) => void;
  toggleInboxThreadHandler: (threadId: string) => void;
  markInboxThreadDisqualified: (threadId: string) => void;

  // Dialog d03 (Ajukan Reseller ke RG ERP) State & Actions
  handoverModalLead: InboxLeadThreadDTO | null;
  openHandoverModal: (lead?: InboxLeadThreadDTO) => void;
  closeHandoverModal: () => void;
  submitHandoverToErp: (
    payload: HandoverSubmissionPayloadDTO
  ) => Promise<HandoverSubmissionReceiptDTO>;

  // Stage 2: "Akuisisi & Antrean" Hub State & Actions (Segments 1-5 + Dialogs d02 & d04)
  lastQueueAction: QueueLastAction | null;
  markQueueItem: (itemId: string, nextStatus: 'sent' | 'disqualified') => void;
  undoLastQueueAction: () => void;
  isAddNumberModalOpen: boolean;
  setIsAddNumberModalOpen: (open: boolean) => void;
  confirmAddActiveNumber: () => void;
  checkDuplicatePhoneInErp: (phone: string) => Promise<ErpDuplicateCheckDTO>;
  checkRadarRowErp: (rowId: string, phone: string) => void;
  sendRadarRowSpintax: (rowId: string) => void;
  addRadarCityChip: (cityName: string) => void;
  isCreateFollowUpModalOpen: boolean;
  setIsCreateFollowUpModalOpen: (open: boolean) => void;
  markFollowUpCompleted: (commitmentId: string) => void;
  createFollowUpCommitment: (payload: CreateFollowUpPayloadDTO) => void;

  // Stage 3a: "Data & Peta Toko" Hub + Detail Toko + Dialogs d01, d06, d07, d08
  selectedShopDetailId: string | null;
  setSelectedShopDetailId: (shopId: string | null) => void;
  databaseCityFilterOverride: string;
  setDatabaseCityFilterOverride: (city: string) => void;
  filterShopsByRegionFromMap: (regionQuery: string) => void;
  isAddShopModalOpen: boolean;
  setIsAddShopModalOpen: (open: boolean) => void;
  createShopFromAcquaintance: (payload: CreateShopFromAcquaintancePayloadDTO) => void;
  isEditShopDataModalOpen: boolean;
  setIsEditShopDataModalOpen: (open: boolean) => void;
  updateShopData: (payload: UpdateShopDataPayloadDTO) => void;
  addShopOnlineLink: (shopId: string, type: OnlineLinkType, url: string) => void;
  removeShopOnlineLink: (shopId: string, linkId: string) => void;
  moveShopTierWithReason: (payload: MoveShopTierPayloadDTO) => void;
  isEditShopContactModalOpen: boolean;
  editShopContactFocusField: 'contact' | 'note';
  openEditShopContactModal: (focusField: 'contact' | 'note') => void;
  closeEditShopContactModal: () => void;
  updateShopContactAndNote: (payload: UpdateShopContactNotePayloadDTO) => void;
  isDeleteShopModalOpen: boolean;
  setIsDeleteShopModalOpen: (open: boolean) => void;
  softDeleteShop: (shopId: string) => void;
  toggleShopDisqualified: (shopId: string) => void;
  updateShopFunnelStep: (shopId: string, stepIndex: 1 | 2 | 3 | 4 | 5) => void;
  saveShopInlineOwnerNote: (shopId: string, note: string) => void;
  openShopInHunterInbox: (shop: DatabaseShopRowDTO) => void;
  mapTransitionTrigger: number;
  triggerMapTransitionSimulation: () => void;

  // Stage 3b: "Katalog & Media" Hub + Dialog d05
  isUploadMediaModalOpen: boolean;
  setIsUploadMediaModalOpen: (open: boolean) => void;
  syncPriceCatalogFromErp: () => void;
  uploadPromotionalMedia: (payload: UploadMediaPayloadDTO) => void;
  softDeletePromotionalMedia: (mediaId: string) => void;
  restorePromotionalMedia: (deletedMediaId: string) => void;
  uploadMediaPrefill: { name: string; sizeBytes: number; mimeType: string; title: string } | null;
  openUploadMediaWithSample: () => void;

  // Stage 4a: "Laporan & Target" & "Impor Data" Hub Controls
  sapaanPeriod: SapaanPeriodDays;
  setSapaanPeriod: (period: SapaanPeriodDays) => void;
  refreshLaporanData: () => void;
  refreshImporData: () => void;
  addImportHistoryRecord: (receipt: ImportSimulationReceiptDTO) => void;

  // Theme, Visual Direction & Accessibility Controls
  visualDirection: VisualDirection;
  setVisualDirection: (dir: VisualDirection) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  reducedTransparency: boolean;
  setReducedTransparency: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  // Go Backend Async State & Error Simulation (Controlled via PrototypeDevToolbar)
  asyncState: AsyncSimState;
  setAsyncState: (state: AsyncSimState) => void;
  simulateErpError: boolean;
  setSimulateErpError: (val: boolean) => void;
  reloadCurrentViewData: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const FUNNEL_LABELS_BY_STEP: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Prospek',
  2: 'Terkontak',
  3: 'Berminat',
  4: 'Negosiasi',
  5: 'Deal Tercapai',
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bootstrap, setBootstrap] = useState<ShellBootstrapResponseDTO | null>(null);
  const [berandaData, setBerandaData] = useState<BerandaDashboardDTO | null>(null);
  const [inboxWorkspace, setInboxWorkspace] = useState<HunterInboxWorkspaceDTO | null>(null);
  const [akuisisiBundle, setAkuisisiBundle] = useState<AkuisisiHubBundleDTO | null>(null);
  const [databaseBundle, setDatabaseBundle] = useState<DatabaseHubBundleDTO | null>(null);
  const [katalogBundle, setKatalogBundle] = useState<KatalogMediaHubBundleDTO | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [role, setRoleState] = useState<UserRole>('admin');
  const [activeHub, setActiveHub] = useState<HubId>('database');
  const [activeSegment, setActiveSegment] = useState<SegmentId>('semua_toko');
  const [aiKillSwitchActive, setAiKillSwitchActive] = useState<boolean>(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [readNotifIds, setReadNotifIds] = useState<Record<string, boolean>>({});

  // Hunter Inbox & Dialog d03 state
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thr-101');
  const [handoverModalLead, setHandoverModalLead] = useState<InboxLeadThreadDTO | null>(null);

  // Stage 2: Antrean Hari Ini undo & Dialogs d02 / d04 state
  const [lastQueueAction, setLastQueueAction] = useState<QueueLastAction | null>(null);
  const [isAddNumberModalOpen, setIsAddNumberModalOpen] = useState<boolean>(false);
  const [isCreateFollowUpModalOpen, setIsCreateFollowUpModalOpen] = useState<boolean>(false);

  // Stage 3a: "Data & Peta Toko" + Detail Toko + Dialogs d01, d06, d07, d08 state
  const [selectedShopDetailId, setSelectedShopDetailId] = useState<string | null>(null);
  const [databaseCityFilterOverride, setDatabaseCityFilterOverride] = useState<string>('');
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState<boolean>(false);
  const [isEditShopDataModalOpen, setIsEditShopDataModalOpen] = useState<boolean>(false);
  const [isEditShopContactModalOpen, setIsEditShopContactModalOpen] = useState<boolean>(false);
  const [editShopContactFocusField, setEditShopContactFocusField] = useState<'contact' | 'note'>(
    'contact'
  );
  const [isDeleteShopModalOpen, setIsDeleteShopModalOpen] = useState<boolean>(false);
  const [mapTransitionTrigger, setMapTransitionTrigger] = useState<number>(0);

  // Stage 3b: "Katalog & Media" + Dialog d05 state
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState<boolean>(false);
  const [uploadMediaPrefill, setUploadMediaPrefill] = useState<{
    name: string;
    sizeBytes: number;
    mimeType: string;
    title: string;
  } | null>(null);

  // Stage 4a: "Laporan & Target" and "Impor Data" Hub state
  const [laporanBundle, setLaporanBundle] = useState<LaporanHubBundleDTO | null>(null);
  const [imporBundle, setImporBundle] = useState<ImporHubBundleDTO | null>(null);
  const [sapaanPeriod, setSapaanPeriod] = useState<SapaanPeriodDays>(30);

  // Theme, Visual Direction & Accessibility state
  const [visualDirection, setVisualDirection] = useState<VisualDirection>('A');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [reducedTransparency, setReducedTransparency] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Async simulation state ('success' | 'loading' | 'empty' | 'error') & ERP POST failure flag
  const [asyncState, setAsyncState] = useState<AsyncSimState>('success');
  const [simulateErpError, setSimulateErpError] = useState<boolean>(false);

  const loadAllAppData = useCallback(async (sim: AsyncSimState) => {
    try {
      const shellRes = await fetchShellBootstrap(sim === 'error' ? 'success' : sim);
      setBootstrap(shellRes);
      setAiKillSwitchActive(shellRes.runtimeStatus.aiEmergencyKillSwitchActive);

      const [berandaRes, inboxRes, akuisisiRes, dbRes, katalogRes, laporanRes, imporRes] =
        await Promise.all([
          fetchBerandaDashboard(sim),
          fetchHunterInboxWorkspace(sim),
          fetchAkuisisiHubBundle(sim),
          fetchDatabaseHubBundle(sim),
          fetchKatalogMediaHubBundle(sim),
          fetchLaporanHubBundle(sim, sapaanPeriod),
          fetchImporHubBundle(sim),
        ]);
      setBerandaData(berandaRes);
      setInboxWorkspace(inboxRes);
      setAkuisisiBundle(akuisisiRes);
      setDatabaseBundle(dbRes);
      setKatalogBundle(katalogRes);
      setLaporanBundle(laporanRes);
      setImporBundle(imporRes);
      setLastQueueAction(null);

      if (inboxRes.threads.length > 0) {
        setSelectedThreadId((prev) =>
          inboxRes.threads.some((t) => t.id === prev) ? prev : inboxRes.threads[0].id
        );
      }
    } catch {
      // Viewport error state is rendered by AsyncStateWrapper
    }
  }, [sapaanPeriod]);

  useEffect(() => {
    loadAllAppData(asyncState);
  }, [asyncState, loadAllAppData]);

  // Sync theme, visual direction, and accessibility attributes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-direction', visualDirection);
    root.setAttribute('data-reduced-transparency', String(reducedTransparency));
    root.setAttribute('data-high-contrast', String(highContrast));
  }, [theme, visualDirection, reducedTransparency, highContrast]);

  // Global keyboard shortcut Ctrl+K / Cmd+K to open Spotlight Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isAuthenticated) {
          setIsCommandPaletteOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const visibleHubs = useMemo(() => {
    if (!bootstrap) return [];
    return bootstrap.navigationHubs.filter((hub) => (role === 'sales_crm' ? !hub.adminOnly : true));
  }, [bootstrap, role]);

  const navigateTo = useCallback(
    (hubId: HubId, segmentId?: SegmentId) => {
      if (!bootstrap) return;
      const targetHub = bootstrap.navigationHubs.find((h) => h.id === hubId);
      if (!targetHub) return;

      // Clear open shop detail view when navigating via sidebar/tab/segment
      setSelectedShopDetailId(null);

      if (role === 'sales_crm' && targetHub.adminOnly) {
        setActiveHub('beranda');
        setActiveSegment('beranda_utama');
        return;
      }

      setActiveHub(hubId);
      if (segmentId && targetHub.segments.some((s) => s.id === segmentId)) {
        setActiveSegment(segmentId);
      } else if (targetHub.segments.length > 0) {
        setActiveSegment(targetHub.segments[0].id);
      }
    },
    [bootstrap, role]
  );

  const setRole = useCallback(
    (nextRole: UserRole) => {
      setRoleState(nextRole);
      if (nextRole === 'sales_crm' && bootstrap) {
        const currentHubObj = bootstrap.navigationHubs.find((h) => h.id === activeHub);
        if (currentHubObj?.adminOnly) {
          setActiveHub('beranda');
          setActiveSegment('beranda_utama');
        }
      }
    },
    [bootstrap, activeHub]
  );

  const toggleAiKillSwitch = useCallback(() => {
    setAiKillSwitchActive((prev) => !prev);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!bootstrap) return;
    const nextRead: Record<string, boolean> = {};
    bootstrap.notifications.forEach((n) => {
      nextRead[n.id] = true;
    });
    setReadNotifIds(nextRead);
  }, [bootstrap]);

  const unreadNotificationCount = useMemo(() => {
    if (!bootstrap) return 0;
    return bootstrap.notifications.filter((n) => n.unread && !readNotifIds[n.id]).length;
  }, [bootstrap, readNotifIds]);

  const currentOperator = useMemo(() => {
    if (!bootstrap) return null;
    return bootstrap.operators[role];
  }, [bootstrap, role]);

  // Hunter Inbox mutations
  const sendInboxMessage = useCallback((threadId: string, body: string) => {
    setInboxWorkspace((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        threads: prev.threads.map((t) => {
          if (t.id !== threadId) return t;
          const nextMsg = {
            id: `m-${Date.now()}`,
            senderType: 'sales' as const,
            senderLabel: 'Hunter SDR',
            body,
            timestampWib: '29 Okt 09.19',
          };
          return {
            ...t,
            filterCategory: 'sales',
            handlerBadgeLabel: 'Dipegang Sales',
            cycleStatusLabel: 'Ditangani manusia',
            lastMessageTimestamp: 'Baru saja',
            lastMessagePreview: body,
            messages: [...t.messages, nextMsg],
          };
        }),
      };
    });
  }, []);

  const toggleInboxThreadHandler = useCallback((threadId: string) => {
    setInboxWorkspace((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        threads: prev.threads.map((t) => {
          if (t.id !== threadId) return t;
          const handToAi = t.handlerBadgeLabel !== 'Dijawab AI';
          return {
            ...t,
            filterCategory: handToAi ? 'ai' : 'sales',
            handlerBadgeLabel: handToAi ? 'Dijawab AI' : 'Dipegang Sales',
            cycleStatusLabel: handToAi ? 'Otomatisasi AI' : 'Ditangani manusia',
          };
        }),
      };
    });
  }, []);

  const markInboxThreadDisqualified = useCallback((threadId: string) => {
    setInboxWorkspace((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        threads: prev.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                funnelStageBadge: 'Bukan Target (DISQUALIFIED)',
              }
            : t
        ),
      };
    });
  }, []);

  const openHandoverModal = useCallback(
    (lead?: InboxLeadThreadDTO) => {
      if (lead) {
        setHandoverModalLead(lead);
      } else if (inboxWorkspace && inboxWorkspace.threads.length > 0) {
        setHandoverModalLead(inboxWorkspace.threads[0]);
      }
    },
    [inboxWorkspace]
  );

  const closeHandoverModal = useCallback(() => {
    setHandoverModalLead(null);
  }, []);

  const submitHandoverToErp = useCallback(
    async (payload: HandoverSubmissionPayloadDTO) => {
      const receipt = await submitResellerHandoverToErp(payload, simulateErpError);

      // Append new handover submission to Antrean Handover ERP table
      setAkuisisiBundle((prev) => {
        if (!prev) return prev;
        const newRow = {
          id: `ho-${Date.now()}`,
          erpHandoverId: receipt.erpHandoverId,
          leadIdNumber: Math.floor(141100 + Math.random() * 899),
          shopName: payload.shopName,
          picName: payload.picName,
          city: payload.city,
          province: payload.province,
          fullAddress: payload.fullAddress,
          googleMapsUrl: payload.googleMapsUrl,
          instagramHandle: payload.instagramHandle,
          whatsappNumber: payload.whatsappNumber,
          focusCategory: payload.primaryFocusCategory,
          productInterests: payload.productInterests,
          weeklyPotentialUnits: payload.weeklyPotentialUnits,
          statusCode: 'HANDOVER_PENDING' as const,
          statusLabel: 'Menunggu ACC ERP' as const,
          submittedAtWib: receipt.submittedAtWib,
          ktpSizeKb: receipt.compressedKtpSizeKb,
          shopPhotoSizeKb: receipt.compressedShopPhotoSizeKb,
          salesQualificationNote: payload.salesQualificationNote,
        };
        const nextSubmissions = [newRow, ...prev.antreanHandoverErp.submissions];
        return {
          ...prev,
          antreanHandoverErp: {
            ...prev.antreanHandoverErp,
            kpiTotalSubmissions: nextSubmissions.length,
            kpiPendingVerification: nextSubmissions.filter(
              (s) => s.statusCode === 'HANDOVER_PENDING'
            ).length,
            submissions: nextSubmissions,
          },
        };
      });

      return receipt;
    },
    [simulateErpError]
  );

  // Stage 2: Antrean Hari Ini actions
  const markQueueItem = useCallback((itemId: string, nextStatus: 'sent' | 'disqualified') => {
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      const target = prev.antreanHariIni.items.find((i) => i.id === itemId);
      if (!target) return prev;

      setLastQueueAction({
        itemId: target.id,
        shopName: target.shopName,
        previousStatus: target.status,
        appliedStatus: nextStatus,
      });

      return {
        ...prev,
        antreanHariIni: {
          ...prev.antreanHariIni,
          items: prev.antreanHariIni.items.map((item) =>
            item.id === itemId ? { ...item, status: nextStatus } : item
          ),
        },
      };
    });
  }, []);

  const undoLastQueueAction = useCallback(() => {
    if (!lastQueueAction) return;
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        antreanHariIni: {
          ...prev.antreanHariIni,
          items: prev.antreanHariIni.items.map((item) =>
            item.id === lastQueueAction.itemId
              ? { ...item, status: lastQueueAction.previousStatus }
              : item
          ),
        },
      };
    });
    setLastQueueAction(null);
  }, [lastQueueAction]);

  const confirmAddActiveNumber = useCallback(() => {
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      const nextCount = Math.min(
        prev.antreanHariIni.maxNumbersCapacity,
        prev.antreanHariIni.activeNumbersCount + 1
      );
      const newSessionId = `session-0${nextCount}`;
      const nextSessions = prev.antreanHariIni.sessions.some((s) => s.id === newSessionId)
        ? prev.antreanHariIni.sessions
        : [
            { id: 'all', label: `Semua nomor aktif (${nextCount} Nomor)` },
            ...prev.antreanHariIni.sessions.filter((s) => s.id !== 'all'),
            {
              id: newSessionId,
              label: `Sesi Sales 0${nextCount} (+62 813-7700-450${nextCount})`,
            },
          ];
      return {
        ...prev,
        antreanHariIni: {
          ...prev.antreanHariIni,
          activeNumbersCount: nextCount,
          sessions: nextSessions,
        },
      };
    });
  }, []);

  // Stage 2: Radar Toko HP actions
  const checkDuplicatePhoneInErp = useCallback(async (phone: string) => {
    return checkWhatsAppDuplicateInErp(phone);
  }, []);

  const checkRadarRowErp = useCallback(async (rowId: string, phone: string) => {
    const res = await checkWhatsAppDuplicateInErp(phone);
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        radarToko: {
          ...prev.radarToko,
          prospects: prev.radarToko.prospects.map((row) =>
            row.id === rowId ? { ...row, erpCheckStatus: res } : row
          ),
        },
      };
    });
  }, []);

  const sendRadarRowSpintax = useCallback((rowId: string) => {
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        radarToko: {
          ...prev.radarToko,
          prospects: prev.radarToko.prospects.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  sdrStatusCode:
                    row.sdrStatusCode === 'UNTOUCHED' ? 'TOUCHED' : row.sdrStatusCode,
                  sdrStatusLabel:
                    row.sdrStatusLabel === 'Belum Disapa'
                      ? 'Sudah Disapa'
                      : row.sdrStatusLabel,
                  spintaxSentAtWib: 'Baru saja',
                }
              : row
          ),
        },
      };
    });
  }, []);

  const addRadarCityChip = useCallback((cityName: string) => {
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      if (
        prev.radarToko.availableCities.some(
          (c) => c.toLowerCase() === cityName.toLowerCase()
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        radarToko: {
          ...prev.radarToko,
          availableCities: [...prev.radarToko.availableCities, cityName],
        },
      };
    });
  }, []);

  // Stage 2: Jadwal Tindak Lanjut actions
  const markFollowUpCompleted = useCallback((commitmentId: string) => {
    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        jadwalTindakLanjut: {
          ...prev.jadwalTindakLanjut,
          commitments: prev.jadwalTindakLanjut.commitments.map((c) =>
            c.id === commitmentId
              ? {
                  ...c,
                  status: 'DITEPATI',
                  overdueWarningBadge: undefined,
                  completedAtWib: '29 Okt 2026 · 09.30 WIB',
                }
              : c
          ),
        },
      };
    });
  }, []);

  const createFollowUpCommitment = useCallback((payload: CreateFollowUpPayloadDTO) => {
    const formattedDate = payload.isNoDeadline
      ? 'Tanpa tenggat'
      : `${payload.dueDateIso.split('-').reverse().join('/')} · ${payload.dueTimeWib} WIB`;

    setAkuisisiBundle((prev) => {
      if (!prev) return prev;
      const maxNum = prev.jadwalTindakLanjut.commitments.reduce(
        (acc, c) => Math.max(acc, c.commitmentNumber),
        0
      );

      const newRow = {
        id: `fu-${Date.now()}`,
        commitmentNumber: maxNum + 1,
        leadIdNumber: payload.leadIdNumber,
        shopName: payload.shopName || `Mitra Toko #${payload.leadIdNumber}`,
        city: 'Indonesia',
        whatsappNumber: '+6281194007712',
        isNoDeadline: payload.isNoDeadline,
        dueDateIso: payload.dueDateIso,
        dueDateDisplay: formattedDate,
        topic: payload.topic,
        status: 'MENUNGGU' as const,
        overdueWarningBadge: payload.isNoDeadline ? undefined : 'Terjadwal Baru',
      };

      return {
        ...prev,
        jadwalTindakLanjut: {
          ...prev.jadwalTindakLanjut,
          commitments: [newRow, ...prev.jadwalTindakLanjut.commitments],
        },
      };
    });

    // Also attach open follow-up to matching shop in DatabaseHubBundle
    setDatabaseBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shops: prev.shops.map((s) =>
          s.leadIdNumber === payload.leadIdNumber
            ? {
                ...s,
                openFollowUps: [
                  {
                    id: `fu-shop-${Date.now()}`,
                    dueDateDisplay: formattedDate,
                    topic: payload.topic,
                  },
                  ...s.openFollowUps,
                ],
              }
            : s
        ),
      };
    });
  }, []);

  /* ==========================================================================
   * STAGE 3a ACTIONS: "DATA & PETA TOKO" + DETAIL TOKO + DIALOGS d01, d06, d07, d08
   * ========================================================================== */

  const filterShopsByRegionFromMap = useCallback((regionQuery: string) => {
    setDatabaseCityFilterOverride(regionQuery);
    setSelectedShopDetailId(null);
    setActiveHub('database');
    setActiveSegment('semua_toko');
  }, []);

  // Dialog d01: Tambah Toko dari Kenalan
  const createShopFromAcquaintance = useCallback(
    (payload: CreateShopFromAcquaintancePayloadDTO) => {
      const normalizedDigits = payload.whatsappNumber.replace(/\D/g, '');
      const formattedWa = normalizedDigits.startsWith('0')
        ? `+62${normalizedDigits.slice(1)}`
        : normalizedDigits.startsWith('62')
          ? `+${normalizedDigits}`
          : `+62${normalizedDigits}`;

      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        const maxLeadId = prev.shops.reduce(
          (acc, s) => Math.max(acc, s.leadIdNumber),
          141000
        );
        const newLeadId = maxLeadId + 1;
        const newShop: DatabaseShopRowDTO = {
          id: `db-shop-${newLeadId}`,
          leadIdNumber: newLeadId,
          shopName: payload.shopName,
          fullAddress: payload.fullAddress || '—',
          city: payload.city || 'Indonesia',
          province: 'Indonesia',
          whatsappNumber: formattedWa,
          secondaryPhones: [],
          picName: 'Kenalan Sales',
          tier: 'Tier B',
          score: 76,
          coveragePercent: 80,
          chatStatusCode: 'SALES_HANDLED',
          chatStatusLabel: 'Ditangani Sales',
          ownershipCode: 'MINE',
          ownershipBadgeLabel: 'Dipegang Anda',
          handlerType: 'HUMAN',
          waSessionLabel: 'session-01',
          brandSourceLabel: 'Kenalan Sales',
          lastUpdatedLabel: 'Baru saja',
          funnelStage: 'Prospek',
          funnelStepperIndex: 1,
          isActiveReseller: false,
          isDisqualified: false,
          needsInspection: false,
          onlineLinks: [],
          salesOwnerNote: 'Ditambahkan manual dari kenalan sales.',
          changeHistory: [
            {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.32 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: 'Menambahkan toko baru dari kenalan sales.',
            },
          ],
          openFollowUps: [],
          aiMemoryLayers: [
            {
              layerNumber: 1,
              code: 'IDENTITAS',
              title: 'IDENTITAS',
              summary: payload.shopName,
              detailDescription: `ID Lead #${newLeadId} · Ditambahkan dari kenalan sales · Nomor utama ${formattedWa}.`,
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 2,
              code: 'PROFIL_COUNTER',
              title: 'PROFIL COUNTER',
              summary: payload.city || '—',
              detailDescription: payload.fullAddress || 'Belum ada rincian alamat.',
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 3,
              code: 'SERI_INCARE',
              title: 'SERI INCARAN',
              summary: 'Belum terdeteksi',
              detailDescription: 'Menunggu percakapan pertama.',
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 4,
              code: 'BUDGET_RANGE',
              title: 'BUDGET RANGE',
              summary: 'Belum terdeteksi',
              detailDescription: 'Menunggu percakapan pertama.',
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 5,
              code: 'PANTANGAN',
              title: 'PANTANGAN',
              summary: 'Belum ada',
              detailDescription: 'Belum ada catatan keberatan.',
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 6,
              code: 'RIWAYAT_DEAL',
              title: 'RIWAYAT DEAL',
              summary: 'Belum ada',
              detailDescription: 'Prospek baru dari kenalan.',
              updatedAtWib: 'Baru saja',
            },
            {
              layerNumber: 7,
              code: 'PERCAKAPAN',
              title: 'PERCAKAPAN',
              summary: 'Belum ada percakapan',
              detailDescription: 'Siap dihubungi via Hunter Inbox.',
              updatedAtWib: 'Baru saja',
            },
          ],
          chatMessages: [],
        };

        const nextCities =
          payload.city && !prev.availableCities.includes(payload.city)
            ? [payload.city, ...prev.availableCities]
            : prev.availableCities;

        return {
          ...prev,
          totalAllShopsVirtualCount: prev.totalAllShopsVirtualCount + 1,
          availableCities: nextCities,
          shops: [newShop, ...prev.shops],
        };
      });
    },
    [currentOperator]
  );

  // Dialog d07: Ubah Data Toko
  const updateShopData = useCallback(
    (payload: UpdateShopDataPayloadDTO) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) => {
            if (s.id !== payload.shopId) return s;
            const historyEntry = {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.35 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: `Memperbarui data toko (${payload.shopName}, ${payload.city || 'tanpa kota'}).`,
            };
            return {
              ...s,
              shopName: payload.shopName,
              fullAddress: payload.fullAddress,
              city: payload.city || s.city,
              lastUpdatedLabel: 'Baru saja',
              changeHistory: [historyEntry, ...s.changeHistory],
            };
          }),
        };
      });
    },
    [currentOperator]
  );

  const addShopOnlineLink = useCallback(
    (shopId: string, type: OnlineLinkType, url: string) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) => {
            if (s.id !== shopId) return s;
            const newLink = {
              id: `lnk-${Date.now()}`,
              type,
              url,
              displayLabel: url.replace(/^https?:\/\//i, ''),
            };
            const historyEntry = {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.36 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: `Menambahkan tautan ${type}: ${url}`,
            };
            return {
              ...s,
              onlineLinks: [...s.onlineLinks, newLink],
              lastUpdatedLabel: 'Baru saja',
              changeHistory: [historyEntry, ...s.changeHistory],
            };
          }),
        };
      });
    },
    [currentOperator]
  );

  const removeShopOnlineLink = useCallback(
    (shopId: string, linkId: string) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) => {
            if (s.id !== shopId) return s;
            const target = s.onlineLinks.find((l) => l.id === linkId);
            const historyEntry = {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.36 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: `Menghapus tautan ${target?.type ?? 'online'}`,
            };
            return {
              ...s,
              onlineLinks: s.onlineLinks.filter((l) => l.id !== linkId),
              lastUpdatedLabel: 'Baru saja',
              changeHistory: [historyEntry, ...s.changeHistory],
            };
          }),
        };
      });
    },
    [currentOperator]
  );

  const moveShopTierWithReason = useCallback(
    (payload: MoveShopTierPayloadDTO) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) => {
            if (s.id !== payload.shopId) return s;
            const historyEntry = {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.37 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: `Memindahkan tier ${s.tier} → ${payload.targetTier} (Alasan: ${payload.reason})`,
            };
            return {
              ...s,
              tier: payload.targetTier,
              lastUpdatedLabel: 'Baru saja',
              changeHistory: [historyEntry, ...s.changeHistory],
            };
          }),
        };
      });
    },
    [currentOperator]
  );

  // Dialog d06: Ubah Kontak & Edit Catatan
  const openEditShopContactModal = useCallback((focusField: 'contact' | 'note') => {
    setEditShopContactFocusField(focusField);
    setIsEditShopContactModalOpen(true);
  }, []);

  const closeEditShopContactModal = useCallback(() => {
    setIsEditShopContactModalOpen(false);
  }, []);

  const updateShopContactAndNote = useCallback(
    (payload: UpdateShopContactNotePayloadDTO) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) => {
            if (s.id !== payload.shopId) return s;
            const historyEntry = {
              id: `ch-${Date.now()}`,
              timestampWib: '29 Okt 2026 · 09.38 WIB',
              actorName: currentOperator?.fullName || 'Nadia Kusuma Wardani',
              summary: `Memperbarui kontak WhatsApp (${payload.whatsappNumber}) dan catatan sales.`,
            };
            return {
              ...s,
              picName: payload.picName,
              whatsappNumber: payload.whatsappNumber,
              secondaryPhones: payload.secondaryPhones,
              salesOwnerNote: payload.salesOwnerNote,
              lastUpdatedLabel: 'Baru saja',
              changeHistory: [historyEntry, ...s.changeHistory],
            };
          }),
        };
      });
    },
    [currentOperator]
  );

  // Dialog d08: Hapus Toko (Soft delete)
  const softDeleteShop = useCallback((shopId: string) => {
    setDatabaseBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalAllShopsVirtualCount: Math.max(0, prev.totalAllShopsVirtualCount - 1),
        shops: prev.shops.filter((s) => s.id !== shopId),
      };
    });
    setSelectedShopDetailId((curr) => (curr === shopId ? null : curr));
  }, []);

  const toggleShopDisqualified = useCallback((shopId: string) => {
    setDatabaseBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shops: prev.shops.map((s) =>
          s.id === shopId
            ? {
                ...s,
                isDisqualified: !s.isDisqualified,
                lastUpdatedLabel: 'Baru saja',
              }
            : s
        ),
      };
    });
  }, []);

  const updateShopFunnelStep = useCallback(
    (shopId: string, stepIndex: 1 | 2 | 3 | 4 | 5) => {
      setDatabaseBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          shops: prev.shops.map((s) =>
            s.id === shopId
              ? {
                  ...s,
                  funnelStepperIndex: stepIndex,
                  funnelStage: FUNNEL_LABELS_BY_STEP[stepIndex],
                  isActiveReseller: stepIndex === 5 ? true : s.isActiveReseller,
                  lastUpdatedLabel: 'Baru saja',
                }
              : s
          ),
        };
      });
    },
    []
  );

  const saveShopInlineOwnerNote = useCallback((shopId: string, note: string) => {
    setDatabaseBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shops: prev.shops.map((s) =>
          s.id === shopId
            ? {
                ...s,
                salesOwnerNote: note.trim(),
                lastUpdatedLabel: 'Baru saja',
              }
            : s
        ),
      };
    });
  }, []);

  const openShopInHunterInbox = useCallback(
    (shop: DatabaseShopRowDTO) => {
      // Check if thread already exists for this shop; if not, select first thread or create one
      if (inboxWorkspace) {
        const match = inboxWorkspace.threads.find(
          (t) =>
            t.leadIdNumber === shop.leadIdNumber ||
            t.shopName.toLowerCase() === shop.shopName.toLowerCase()
        );
        if (match) {
          setSelectedThreadId(match.id);
        } else {
          const newThreadId = `thr-db-${shop.leadIdNumber}`;
          const newThread: InboxLeadThreadDTO = {
            id: newThreadId,
            leadIdNumber: shop.leadIdNumber,
            shopName: shop.shopName,
            picName: shop.picName,
            avatarInitial: (shop.shopName.trim()[0] || 'T').toUpperCase(),
            whatsappNumber: shop.whatsappNumber.replace(/\D/g, ''),
            city: shop.city,
            province: shop.province,
            fullAddress: shop.fullAddress,
            googleMapsUrl: shop.googleMapsUrl || 'https://maps.google.com',
            instagramHandle: '@mitratoko.id',
            filterCategory: shop.handlerType === 'HUMAN' ? 'sales' : 'ai',
            handlerBadgeLabel:
              shop.handlerType === 'HUMAN' ? 'Dipegang Sales' : 'Dijawab AI',
            funnelStageBadge: `${shop.funnelStage} (QUALIFYING)`,
            priorityScore: shop.score ?? 80,
            waSessionId: 'session-01',
            waSessionLabel: 'WABA Hub Nusantara (6281194002101)',
            cycleStatusLabel:
              shop.handlerType === 'HUMAN' ? 'Ditangani manusia' : 'Otomatisasi AI',
            lastMessageTimestamp: shop.lastUpdatedLabel,
            lastMessagePreview:
              shop.chatMessages[shop.chatMessages.length - 1]?.body ||
              'Siap memulai sapaan WhatsApp dengan toko ini.',
            unreadCount: 0,
            defaultFocusCategory: 'Ex-iBox (Second Resmi)',
            defaultProductInterests: ['Ex-iBox', 'New iBox'],
            defaultWeeklyPotentialUnits: 6,
            defaultHandoverNote: shop.salesOwnerNote || 'Prospek dari direktori Data Toko.',
            erpDuplicateCheck: {
              checkedAtWib: '29 Okt 09.30 WIB',
              isDuplicate: false,
              statusMessage: `Nomor ${shop.whatsappNumber} belum terdaftar di RG ERP.`,
            },
            cognitiveMemory: {
              funnelStageCode: 'WARM_TALKING',
              picName: shop.picName,
              counterProfile: shop.aiMemoryLayers[1]?.summary || shop.city,
              preferredSeries: shop.aiMemoryLayers[2]?.summary || 'Belum terdeteksi',
              budgetRange: shop.aiMemoryLayers[3]?.summary || 'Belum terdeteksi',
              tabooNotes: shop.aiMemoryLayers[4]?.summary || 'Belum ada',
              dealHistorySummary: shop.aiMemoryLayers[5]?.summary || 'Belum ada',
              conversationSummary:
                shop.aiMemoryLayers[6]?.summary || 'Dibuka dari halaman Data Toko.',
            },
            messages:
              shop.chatMessages.length > 0
                ? shop.chatMessages
                : [
                    {
                      id: `msg-init-${Date.now()}`,
                      senderType: 'sales',
                      senderLabel: 'Hunter SDR',
                      body: `Halo Kak ${shop.picName} di ${shop.shopName}, salam kenal dari Rumah Gadget. Boleh kami bagikan katalog harga acuan grosir iPhone minggu ini?`,
                      timestampWib: '29 Okt 09.30',
                    },
                  ],
          };
          setInboxWorkspace((prev) =>
            prev ? { ...prev, threads: [newThread, ...prev.threads] } : prev
          );
          setSelectedThreadId(newThreadId);
        }
      }
      setSelectedShopDetailId(null);
      setActiveHub('inbox');
      setActiveSegment('inbox_workspace');
    },
    [inboxWorkspace]
  );

  const triggerMapTransitionSimulation = useCallback(() => {
    setSelectedShopDetailId(null);
    setActiveHub('database');
    setActiveSegment('peta_toko');
    setMapTransitionTrigger((n) => n + 1);
  }, []);

  /* ==========================================================================
   * STAGE 3b ACTIONS: "KATALOG & MEDIA" HUB + DIALOG d05
   * ========================================================================== */

  const syncPriceCatalogFromErp = useCallback(() => {
    setKatalogBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceCatalog: {
          ...prev.priceCatalog,
          lastErpSyncWib: 'Baru saja · Tersinkron dari RG ERP',
          items: prev.priceCatalog.items.map((item) => ({
            ...item,
            syncedAtLabel: 'Baru saja',
          })),
        },
      };
    });
  }, []);

  const uploadPromotionalMedia = useCallback((payload: UploadMediaPayloadDTO) => {
    const ext = payload.fileName.split('.').pop()?.toUpperCase();
    const fileType: 'PDF' | 'JPG' | 'PNG' =
      ext === 'JPG' || ext === 'JPEG' ? 'JPG' : ext === 'PNG' ? 'PNG' : 'PDF';
    const sizeKb = Math.max(1, Math.round(payload.fileSizeBytes / 1024));
    const randomHash = Math.random().toString(36).substring(2, 12).toUpperCase();

    setKatalogBundle((prev) => {
      if (!prev) return prev;
      const nextNum =
        prev.promotionalMedia.activeItems.reduce((acc, m) => Math.max(acc, m.rowNumber), 0) + 1;
      const newMedia: PromotionalMediaItemDTO = {
        id: `med-${Date.now()}`,
        rowNumber: nextNum,
        documentTitle: payload.documentTitle,
        fileName: payload.fileName,
        fileType,
        category: payload.category,
        fileSizeLabel: `${sizeKb} KB`,
        waMediaHandle: `wamid.HBgNNjI4MTE5NDAwMjEwMRUCABIYFD${randomHash}AA==`,
        waHashCacheNote: 'SHA-256 cached · Siap forward instan tanpa re-upload',
        updatedAtWib: 'Baru saja',
      };
      const nextActive = [newMedia, ...prev.promotionalMedia.activeItems];
      return {
        ...prev,
        promotionalMedia: {
          ...prev.promotionalMedia,
          kpiTotalFilesCount: nextActive.length,
          activeItems: nextActive,
        },
      };
    });
  }, []);

  const softDeletePromotionalMedia = useCallback(
    (mediaId: string) => {
      setKatalogBundle((prev) => {
        if (!prev) return prev;
        const target = prev.promotionalMedia.activeItems.find((m) => m.id === mediaId);
        if (!target) return prev;
        const remaining = prev.promotionalMedia.activeItems.filter((m) => m.id !== mediaId);
        const deletedEntry = {
          id: `del-${target.id}`,
          documentTitle: target.documentTitle,
          fileName: target.fileName,
          category: target.category,
          fileSizeLabel: target.fileSizeLabel,
          waMediaHandle: target.waMediaHandle,
          deletedAtWib: 'Baru saja',
          deletedByOperator: currentOperator?.fullName || 'Nadia Kusuma Wardani',
        };
        return {
          ...prev,
          promotionalMedia: {
            ...prev.promotionalMedia,
            kpiTotalFilesCount: remaining.length,
            activeItems: remaining,
            deletedItems: [deletedEntry, ...prev.promotionalMedia.deletedItems],
          },
        };
      });
    },
    [currentOperator]
  );

  const restorePromotionalMedia = useCallback((deletedMediaId: string) => {
    setKatalogBundle((prev) => {
      if (!prev) return prev;
      const target = prev.promotionalMedia.deletedItems.find((d) => d.id === deletedMediaId);
      if (!target) return prev;
      const ext = target.fileName.split('.').pop()?.toUpperCase();
      const fileType: 'PDF' | 'JPG' | 'PNG' =
        ext === 'JPG' || ext === 'JPEG' ? 'JPG' : ext === 'PNG' ? 'PNG' : 'PDF';
      const nextNum =
        prev.promotionalMedia.activeItems.reduce((acc, m) => Math.max(acc, m.rowNumber), 0) + 1;
      const restoredItem: PromotionalMediaItemDTO = {
        id: `med-restored-${Date.now()}`,
        rowNumber: nextNum,
        documentTitle: target.documentTitle,
        fileName: target.fileName,
        fileType,
        category: target.category,
        fileSizeLabel: target.fileSizeLabel,
        waMediaHandle: target.waMediaHandle,
        waHashCacheNote: 'SHA-256 cached · Dipulihkan ke pustaka aktif',
        updatedAtWib: 'Baru saja (Dipulihkan)',
      };
      const nextActive = [restoredItem, ...prev.promotionalMedia.activeItems];
      return {
        ...prev,
        promotionalMedia: {
          ...prev.promotionalMedia,
          kpiTotalFilesCount: nextActive.length,
          activeItems: nextActive,
          deletedItems: prev.promotionalMedia.deletedItems.filter(
            (d) => d.id !== deletedMediaId
          ),
        },
      };
    });
  }, []);

  const openUploadMediaWithSample = useCallback(() => {
    setUploadMediaPrefill({
      name: 'pricelist-grosir-iphone-november-2026.pdf',
      sizeBytes: 448 * 1024,
      mimeType: 'application/pdf',
      title: 'Katalog Harga Grosir iPhone Minggu Ke-1 November',
    });
    setIsUploadMediaModalOpen(true);
  }, []);

  const handleSelectSapaanPeriod = useCallback(
    async (period: SapaanPeriodDays) => {
      setSapaanPeriod(period);
      try {
        const res = await fetchLaporanHubBundle(asyncState, period);
        setLaporanBundle(res);
      } catch {}
    },
    [asyncState]
  );

  const refreshLaporanData = useCallback(async () => {
    try {
      const res = await fetchLaporanHubBundle(asyncState, sapaanPeriod);
      setLaporanBundle(res);
    } catch {}
  }, [asyncState, sapaanPeriod]);

  const refreshImporData = useCallback(async () => {
    try {
      const res = await fetchImporHubBundle(asyncState);
      setImporBundle(res);
    } catch {}
  }, [asyncState]);

  const addImportHistoryRecord = useCallback(
    (receipt: ImportSimulationReceiptDTO) => {
      setImporBundle((prev) => {
        if (!prev) return prev;
        const newRow = {
          id: receipt.batchId,
          waktuWib: receipt.waktuWib,
          berkasName: receipt.fileName,
          fileSizeBytes: 240 * 1024,
          olehOperator: currentOperator?.fullName || 'Nadia Kusuma Wardani',
          totalBaris: receipt.totalRows,
          diimporCount: receipt.importedCount,
          dilewatiCount: receipt.skippedCount,
          duplikatCount: receipt.duplicateCount,
        };
        return {
          ...prev,
          historyRecords: [newRow, ...prev.historyRecords],
        };
      });
    },
    [currentOperator]
  );

  const reloadCurrentViewData = useCallback(() => {
    setAsyncState('success');
    loadAllAppData('success');
  }, [loadAllAppData]);

  const value: AppStateContextValue = {
    bootstrap,
    berandaData,
    inboxWorkspace,
    akuisisiBundle,
    databaseBundle,
    katalogBundle,
    laporanBundle,
    imporBundle,
    visibleHubs,
    currentOperator,
    unreadNotificationCount,
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
    activeHub,
    activeSegment,
    navigateTo,
    aiKillSwitchActive,
    toggleAiKillSwitch,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    markAllNotificationsRead,
    selectedThreadId,
    setSelectedThreadId,
    sendInboxMessage,
    toggleInboxThreadHandler,
    markInboxThreadDisqualified,
    handoverModalLead,
    openHandoverModal,
    closeHandoverModal,
    submitHandoverToErp,
    lastQueueAction,
    markQueueItem,
    undoLastQueueAction,
    isAddNumberModalOpen,
    setIsAddNumberModalOpen,
    confirmAddActiveNumber,
    checkDuplicatePhoneInErp,
    checkRadarRowErp,
    sendRadarRowSpintax,
    addRadarCityChip,
    isCreateFollowUpModalOpen,
    setIsCreateFollowUpModalOpen,
    markFollowUpCompleted,
    createFollowUpCommitment,
    selectedShopDetailId,
    setSelectedShopDetailId,
    databaseCityFilterOverride,
    setDatabaseCityFilterOverride,
    filterShopsByRegionFromMap,
    isAddShopModalOpen,
    setIsAddShopModalOpen,
    createShopFromAcquaintance,
    isEditShopDataModalOpen,
    setIsEditShopDataModalOpen,
    updateShopData,
    addShopOnlineLink,
    removeShopOnlineLink,
    moveShopTierWithReason,
    isEditShopContactModalOpen,
    editShopContactFocusField,
    openEditShopContactModal,
    closeEditShopContactModal,
    updateShopContactAndNote,
    isDeleteShopModalOpen,
    setIsDeleteShopModalOpen,
    softDeleteShop,
    toggleShopDisqualified,
    updateShopFunnelStep,
    saveShopInlineOwnerNote,
    openShopInHunterInbox,
    mapTransitionTrigger,
    triggerMapTransitionSimulation,
    isUploadMediaModalOpen,
    setIsUploadMediaModalOpen,
    syncPriceCatalogFromErp,
    uploadPromotionalMedia,
    softDeletePromotionalMedia,
    restorePromotionalMedia,
    uploadMediaPrefill,
    openUploadMediaWithSample,
    sapaanPeriod,
    setSapaanPeriod: handleSelectSapaanPeriod,
    refreshLaporanData,
    refreshImporData,
    addImportHistoryRecord,
    visualDirection,
    setVisualDirection,
    theme,
    setTheme,
    reducedTransparency,
    setReducedTransparency,
    highContrast,
    setHighContrast,
    asyncState,
    setAsyncState,
    simulateErpError,
    setSimulateErpError,
    reloadCurrentViewData,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState harus digunakan di dalam AppStateProvider');
  }
  return ctx;
}
