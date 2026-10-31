# Olivia SDR — Operator Language & Microcopy Pass

This update refines all user-visible Indonesian copy across the application so every screen, table, dialog, empty state, and message reads like a practical B2B sales operations tool built by practitioners rather than generated prose. Layout, visual styling, theme tokens, routing, interactive behavior, and data transfer object (DTO) shapes remain completely unchanged.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following terminology and scope decisions were confirmed and govern this pass across all hubs and mock data responses:

- **Confirmed Decision 1 — Standardized Domain Vocabulary**: Use **Toko** consistently for retail shop entities across UI headers, labels, filters, and tables (replacing inconsistent *counter* / *outlet* labels outside untouched compliance templates), and use **Tindak lanjut** consistently for scheduled follow-up actions while keeping **Janji** specifically for SLA promise tracking.
- **Confirmed Decision 2 — Zero-Hit Grep Cleanliness Across Comments & Dev Toolbar**: Remove em-dashes (`—`) and en-dashes (`–`) from code comments and the developer toolbar in addition to production UI strings so that automated verification checks return zero hits outside explicitly protected compliance copy.
- **Protected Compliance Copy (Untouched)**: Greeting templates and spintax (*Sapaan*), bot/AI automated replies, farewell (*pamit*) messages, price and stock WhatsApp reply snippets, and business guardrail explanations (`otomatis` bot self-identification, manual human first message, stock confirmation before transfer, and `COOLING_OFF` behavior) are preserved word for word.

---

### 1. Overview & Core Concept

- **What It Does**: Replaces padded, rhetorical, or inconsistent UI strings, empty-value placeholders, button labels, and status messages with direct, sentence-case Indonesian tailored to a B2B iPhone wholesale sales operator (*Tim Hunter*).
- **Target Audience / Persona**: Sales operators and team leads managing daily outreach queues, WhatsApp conversations, catalog price references, shop database records, and ERP handover workflows under time pressure.
- **Key Value**: Operators scan queues, diagnose import or SLA issues, and act on shop records faster because headings name the exact object, empty states explain the missing fact and next step, and missing fields state what is absent (`Belum diisi`, `Belum dinilai`, `Belum ada`) instead of rendering ambiguous bare dashes.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Daily Outreach & Queue Execution (*Akuisisi & Antrean*)**: Operators review daily targets (`20-25 toko per nomor/hari`), inspect shop scores (`Belum dinilai` when unscored), log follow-ups (`Catat tindak lanjut`), and monitor SLA compliance with clear, unpadded operational guidance.
  2. **Shop Directory & Detail Inspection (*Database Toko*)**: Operators browse the national directory, inspect shop profiles where missing addresses or contacts explicitly read `Belum diisi` or `Belum ada rincian jalan`, and read chat history sender labels rendered via clean text and existing icon components rather than inline emojis.
  3. **Catalog & Bulk Imports (*Katalog & Impor Data*)**: Operators copy wholesale price references (with plain hyphens for price ranges and no exclamation marks in confirmation toasts) and validate spreadsheet imports where validation statuses use icon components plus plain text (`Ya`, `Sampel valid (8.934 toko)`).
  4. **Performance Reporting (*Laporan*)**: Operators evaluate outreach conversion and model accuracy metrics with direct explanations and plain empty-metric fallbacks (`Belum ada data`) instead of bare em-dashes.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-density, utilitarian B2B operator workspace with Apple HIG-inspired glass chrome and clean tabular data presentation.
  - *Color Palette & Mood*: Preserves the existing light and dark mode CSS custom properties (`--surface-bg`, `--surface-card`, `--text-primary`, `--text-secondary`, `--brand-pink`, `--status-success`, `--status-warning`, `--status-danger`) without modification.
  - *Typography & Hierarchy*: Sentence-case buttons and section titles, tabular numerals (`tabular-nums`) for scores, prices, and SLA timers, and middle dots (`·`) restricted strictly to inline metadata separators.
  - *Component Styling & Layout*: Zero layout, spacing, or component structure changes; status emphasis relies on existing Lucide icon components and semantic color tokens rather than text emojis or decorative symbols.
- **Interactive Feedback & Motion**: Toasts, inline save confirmations, and error banners state the concrete outcome and recovery action in one or two calm sentences without exclamation marks, apologies, or marketing slogans.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Contextual Empty-Value Fallbacks Instead of Bare Dashes**
  - *Chosen Approach*: Replace bare `'—'` fallbacks in UI rendering and mock data summaries with field-specific Indonesian phrases (`Belum diisi` for address/city/contact fields, `Belum dinilai` for null priority scores, `Belum ada` or `Belum aktif` for WhatsApp session/metric labels, and hiding percentages when the denominator is zero).
  - *Why*: A bare dash is ambiguous between "not applicable", "loading", and "missing data". Field-specific words tell the operator whether they need to collect the data or wait for scoring.
  - *Alternatives Considered*: Using a single generic `"Kosong"` string everywhere, which was rejected because `"Belum dinilai"` for a score and `"Belum diisi"` for an address carry distinct operational meaning.
- **Decision 2 — Strict Separation of UI Copy vs. Compliance WhatsApp Templates**
  - *Chosen Approach*: Clean all UI chrome, headers, tooltips, table cells, and system descriptions while leaving WhatsApp message bodies (`QuickReplyTemplate.body`, chat message previews, and compliance guardrail notices) untouched and documented by file and line number.
  - *Why*: WhatsApp templates and guardrail notices represent approved operational compliance copy.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Typed Mock Data & State Layer                        │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │       Mock API Responses       │  │     Application State Store    │  │
│  │  - Plain hyphen ranges (20-25) │  │  - Contextual empty fallbacks  │  │
│  │  - Direct SLA/metric titles    │  │    ("Belum diisi", etc.)       │  │
│  │  - Untouched WA compliance msg │  │  - Consistent "Toko" naming    │  │
│  └───────────────┬────────────────┘  └───────────────┬────────────────┘  │
└──────────────────┼───────────────────────────────────┼───────────────────┘
                   │                                   │
                   ▼                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Operator Workspace Views                          │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│  │  Akuisisi & Antrean  │ │    Database Toko     │ │ Katalog & Impor  │  │
│  │  - Antrean hari ini  │ │  - Direktori & Peta  │ │ - Harga & Media  │  │
│  │  - Radar & Handover  │ │  - Detail & Riwayat  │ │ - Validasi Impor │  │
│  │  - Tindak lanjut/SLA │ │    (No text emojis)  │ │   (No ! or ✓)    │  │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────┘  │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│  │    Kotak Masuk WA    │ │   Laporan & Metrik   │ │  Modals & Shell  │  │
│  │  - Compliance intact │ │  - Periode & Target  │ │ - Sentence-case  │  │
│  │  - Clean UI labels   │ │  - Evaluasi Sapaan   │ │   action verbs   │  │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - All TypeScript interfaces, object keys, enum values, and route identifiers remain 100% untouched.
  - String values inside mock payloads and component fallback expressions are updated in place so existing state transitions, filters, and form handlers continue to operate identically.
- **Interactive Component & State Mapping**:
  - **Form Modals (Add/Edit Shop, Follow-up, Media Upload)**: Option placeholders and default empty field normalizers map empty strings to `'Belum diisi'` instead of `'—'`, and normalize `'Belum diisi'` back to `''` when pre-filling edit inputs.
  - **Score & Metric Badges**: Null scores render `'Belum dinilai'`; empty SLA or reply-rate metrics in zero-state views render `'Belum ada'` or omit invalid percentages.
  - **Copy & Save Actions**: Clipboard copy feedback (`Brosur harga tersalin.`) and note save states (`Tersimpan`) use calm declarative text paired with existing icon state rather than exclamation marks or Unicode checkmarks.
  - **Verification Pipeline**: Automated regex checks (`grep`) for em/en-dashes, Unicode emojis/symbols, banned buzzwords, and exclamation marks, followed by `tsc --noEmit` and `vite build`.
