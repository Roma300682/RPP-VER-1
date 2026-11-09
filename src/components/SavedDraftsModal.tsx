import React from 'react';
import { X, FolderArchive, Trash2, ExternalLink, Calendar, FileText, Download, Upload } from 'lucide-react';
import { ModulAjarData } from '../types/rpp';

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: ModulAjarData[];
  onSelectDraft: (rpp: ModulAjarData) => void;
  onDeleteDraft: (id: string) => void;
  onExportAll: () => void;
  onImportDrafts: (imported: ModulAjarData[]) => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onExportAll,
  onImportDrafts,
}) => {
  const [importError, setImportError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportDrafts(json);
        } else if (json && json.id) {
          onImportDrafts([json]);
        }
      } catch (err) {
        setImportError('Format file JSON cadangan tidak valid.');
        setTimeout(() => setImportError(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Koleksi Draf Modul Ajar AKL ({drafts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Tersimpan di memori peramban Anda secara aman
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {importError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {importError}
            </div>
          )}
          {drafts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Belum ada RPP yang disimpan.</p>
              <p className="mt-1">
                Setelah menyusun RPP dengan AI, klik tombol &quot;Simpan Draf&quot; untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start justify-between gap-4"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectDraft(d);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm hover:text-blue-600 line-clamp-1">
                      {d.identitas.topikPembelajaran}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {d.identitas.faseKelasSemester}
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 font-medium line-clamp-1 mb-1">
                    {d.identitas.mataPelajaran}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(d.createdAt || Date.now()).toLocaleDateString('id-ID')}</span>
                    </span>
                    <span>•</span>
                    <span>{d.identitas.alokasiWaktu}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onSelectDraft(d);
                      onClose();
                    }}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Buka RPP ini"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDraft(d.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Hapus dari draf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex space-x-2">
            <button
              onClick={onExportAll}
              disabled={drafts.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 disabled:opacity-40"
              title="Unduh berkas JSON cadangan"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Cadangkan (.json)</span>
            </button>

            <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Pulihkan</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
