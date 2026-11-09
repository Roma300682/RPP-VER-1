import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Check } from 'lucide-react';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  sectionTitle: string;
  currentData: any;
  context: {
    mapel: string;
    fase: string;
    topik: string;
  };
  onApplyUpdate: (sectionKey: string, updatedData: any) => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  isOpen,
  onClose,
  sectionKey,
  sectionTitle,
  currentData,
  context,
  onApplyUpdate,
}) => {
  const [promptRequest, setPromptRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey,
          currentData,
          promptRequest,
          context,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal meregenerasi bagian modul ajar.');
      }
      setPreviewData(json.updatedSection);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onApplyUpdate(sectionKey, previewData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Regenerasi Bagian: {sectionTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Berikan instruksi tambahan pada AI untuk memperkaya bagian ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Instruksi Khusus untuk AI (Opsional):
            </label>
            <textarea
              rows={3}
              value={promptRequest}
              onChange={(e) => setPromptRequest(e.target.value)}
              placeholder="Contoh: Tambahkan studi kasus bukti faktur kredit dan nota debet retur; atau buat pertanyaan pemantik yang lebih menantang..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRegenerate}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Sedang Menyusun Ulang...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mulai Regenerasi Bagian Ini</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {previewData && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 mb-2">
                <Check className="w-4 h-4" />
                <span>Hasil Regenerasi AI Berhasil Dibuat:</span>
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 max-h-56 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{JSON.stringify(previewData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
          {previewData && (
            <button
              onClick={handleApply}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Perubahan ke Modul Ajar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
