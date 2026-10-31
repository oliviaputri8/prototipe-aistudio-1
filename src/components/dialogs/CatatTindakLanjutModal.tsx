import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Check } from 'lucide-react';
import { CreateFollowUpPayloadDTO, LeadLookupOptionDTO } from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface CatatTindakLanjutModalProps {
  open: boolean;
  onClose: () => void;
  leadLookupOptions: LeadLookupOptionDTO[];
  initialLead?: { leadIdNumber: number; shopName: string } | null;
  onSubmitFollowUp: (payload: CreateFollowUpPayloadDTO) => void;
}

/**
 * Dialog `d02-dialog-tindak-lanjut`: Catat Tindak Lanjut
 * - Presentational component (no data fetching).
 * - Supports Lead ID entry + quick fictional shop selection,
 *   "Tanpa tenggat (target)" toggle, Tanggal Jatuh Tempo, Jam, and Topik Tindak Lanjut.
 * - All mobile interactive elements strictly `>= 44×44px`.
 */
export const CatatTindakLanjutModal: React.FC<CatatTindakLanjutModalProps> = ({
  open,
  onClose,
  leadLookupOptions,
  initialLead,
  onSubmitFollowUp,
}) => {
  const [leadIdText, setLeadIdText] = useState<string>('');
  const [selectedShopName, setSelectedShopName] = useState<string>('');
  const [isNoDeadline, setIsNoDeadline] = useState<boolean>(false);
  const [dueDateIso, setDueDateIso] = useState<string>('2026-10-29');
  const [dueTimeWib, setDueTimeWib] = useState<string>('14:00');
  const [topic, setTopic] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setLeadIdText(initialLead ? String(initialLead.leadIdNumber) : '');
    setSelectedShopName(initialLead ? initialLead.shopName : '');
    setIsNoDeadline(false);
    setDueDateIso('2026-10-29');
    setDueTimeWib('14:00');
    setTopic('');
    setErrors({});
  }, [open, initialLead]);

  const handleSelectLeadOption = (opt: LeadLookupOptionDTO) => {
    setLeadIdText(String(opt.leadIdNumber));
    setSelectedShopName(opt.shopName);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.leadId;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    const parsedLeadId = Number(leadIdText.trim());
    if (!leadIdText.trim() || !Number.isFinite(parsedLeadId) || parsedLeadId <= 0) {
      nextErrors.leadId = 'ID Mitra Toko (Lead ID) wajib diisi dengan angka valid.';
    }
    if (!isNoDeadline && !dueDateIso.trim()) {
      nextErrors.dueDate = 'Tanggal jatuh tempo wajib diisi (atau centang Tanpa tenggat).';
    }
    if (!topic.trim()) {
      nextErrors.topic = 'Topik tindak lanjut / komitmen wajib diisi.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const matchedLead = leadLookupOptions.find((l) => l.leadIdNumber === parsedLeadId);

    onSubmitFollowUp({
      leadIdNumber: parsedLeadId,
      shopName: matchedLead?.shopName || selectedShopName || `Mitra Toko #${parsedLeadId}`,
      isNoDeadline,
      dueDateIso: isNoDeadline ? '' : dueDateIso,
      dueTimeWib: isNoDeadline ? '' : dueTimeWib || '14:00',
      topic: topic.trim(),
    });
    onClose();
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="md"
      title="Catat Tindak Lanjut"
      subtitle="Jadwalkan komitmen follow-up mitra toko counter"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Simpan Tindak Lanjut
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* 1. ID Mitra Toko (Lead ID) */}
        <div className="space-y-1.5">
          <label
            htmlFor="d02-lead-id"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            ID Mitra Toko (Lead ID) *
          </label>
          <input
            id="d02-lead-id"
            type="text"
            inputMode="numeric"
            value={leadIdText}
            onChange={(e) => setLeadIdText(e.target.value.replace(/\D/g, ''))}
            placeholder="Cth: 140821"
            className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums placeholder:text-[var(--text-tertiary)]"
          />
          {errors.leadId && (
            <p className="text-[12px] text-[var(--status-danger)]">{errors.leadId}</p>
          )}

          {/* Quick Select Fictional Leads */}
          {leadLookupOptions.length > 0 && (
            <div className="pt-1 space-y-1.5">
              <span className="hig-caption text-[var(--text-tertiary)] block">
                Pilih cepat mitra toko aktif:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {leadLookupOptions.map((opt) => {
                  const isSelected = leadIdText === String(opt.leadIdNumber);
                  return (
                    <button
                      key={opt.leadIdNumber}
                      type="button"
                      onClick={() => handleSelectLeadOption(opt)}
                      className={`min-h-[44px] min-w-[44px] md:min-h-[32px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-medium border cursor-pointer tabular-nums hig-transition ${
                        isSelected
                          ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent font-semibold'
                          : 'bg-[var(--surface-recessed)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      #{opt.leadIdNumber} · {opt.shopName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Switch Button: Tanpa tenggat (target) */}
        <button
          type="button"
          role="switch"
          aria-checked={isNoDeadline}
          onClick={() => setIsNoDeadline((prev) => !prev)}
          className={`w-full min-h-[44px] min-w-[44px] px-3.5 py-2.5 rounded-[var(--radius-xs)] border flex items-center gap-2.5 text-left cursor-pointer select-none hig-transition ${
            isNoDeadline
              ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
              : 'bg-[var(--surface-recessed)] text-[var(--text-primary)] border-[var(--border-hairline)]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`w-4 h-4 rounded-[4px] flex items-center justify-center border shrink-0 ${
              isNoDeadline
                ? 'bg-white text-[var(--accent-fill)] border-white'
                : 'bg-[var(--surface-solid)] border-[var(--border-strong)]'
            }`}
          >
            {isNoDeadline && <Check className="w-3 h-3 stroke-[3]" />}
          </span>
          <span className="text-[13px] font-semibold">Tanpa tenggat (target)</span>
        </button>

        {/* 3. Tanggal Jatuh Tempo & Jam */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
            isNoDeadline ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="d02-due-date"
              className="block text-[13px] font-semibold text-[var(--text-primary)]"
            >
              Tanggal Jatuh Tempo *
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
              <input
                id="d02-due-date"
                type="date"
                disabled={isNoDeadline}
                value={dueDateIso}
                onChange={(e) => setDueDateIso(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums"
              />
            </div>
            {errors.dueDate && (
              <p className="text-[12px] text-[var(--status-danger)]">{errors.dueDate}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="d02-due-time"
              className="block text-[13px] font-semibold text-[var(--text-primary)]"
            >
              Jam (WIB)
            </label>
            <div className="relative flex items-center">
              <Clock className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
              <input
                id="d02-due-time"
                type="time"
                disabled={isNoDeadline}
                value={dueTimeWib}
                onChange={(e) => setDueTimeWib(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* 4. Topik Tindak Lanjut */}
        <div className="space-y-1.5">
          <label
            htmlFor="d02-topic"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            Topik Tindak Lanjut *
          </label>
          <textarea
            id="d02-topic"
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Kirim pricelist iPhone 13 Pro 128GB dan konfirmasi stok fisik"
            className="w-full p-3 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          {errors.topic && (
            <p className="text-[12px] text-[var(--status-danger)]">{errors.topic}</p>
          )}
        </div>
      </form>
    </ModalSheet>
  );
};
