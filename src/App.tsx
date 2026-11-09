/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MateriInputStep } from './components/MateriInputStep';
import { RppView } from './components/RppView';
import { SchoolCustomizerModal } from './components/SchoolCustomizerModal';
import { SectionEditorModal } from './components/SectionEditorModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import {
  ModulAjarData,
  IdentitasSekolah,
  KustomisasiFitur,
  GenerateRPPRequest,
} from './types/rpp';
import { DEFAULT_IDENTITAS_SEKOLAH, DEFAULT_KUSTOMISASI } from './data/aklPresets';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY_DRAFTS = 'genrpp_akl_drafts';
const STORAGE_KEY_SEKOLAH = 'genrpp_akl_sekolah';
const STORAGE_KEY_KUSTOMISASI = 'genrpp_akl_kustomisasi';

export default function App() {
  const [currentRpp, setCurrentRpp] = useState<ModulAjarData | null>(null);
  const [drafts, setDrafts] = useState<ModulAjarData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [regenerateModalState, setRegenerateModalState] = useState<{
    isOpen: boolean;
    sectionKey: string;
    sectionTitle: string;
    currentData: any;
  }>({
    isOpen: false,
    sectionKey: '',
    sectionTitle: '',
    currentData: null,
  });

  // Settings
  const [identitasSekolah, setIdentitasSekolah] = useState<IdentitasSekolah>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SEKOLAH);
      return stored ? JSON.parse(stored) : DEFAULT_IDENTITAS_SEKOLAH;
    } catch {
      return DEFAULT_IDENTITAS_SEKOLAH;
    }
  });

  const [kustomisasi, setKustomisasi] = useState<KustomisasiFitur>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_KUSTOMISASI);
      return stored ? JSON.parse(stored) : DEFAULT_KUSTOMISASI;
    } catch {
      return DEFAULT_KUSTOMISASI;
    }
  });

  // Load saved drafts on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFTS);
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load drafts from storage:', err);
    }
  }, []);

  const handleSaveSettings = (newIdentitas: IdentitasSekolah, newKustomisasi: KustomisasiFitur) => {
    setIdentitasSekolah(newIdentitas);
    setKustomisasi(newKustomisasi);
    try {
      localStorage.setItem(STORAGE_KEY_SEKOLAH, JSON.stringify(newIdentitas));
      localStorage.setItem(STORAGE_KEY_KUSTOMISASI, JSON.stringify(newKustomisasi));
    } catch (err) {
      console.error('Failed to save settings to storage:', err);
    }

    // If currently viewing an RPP, update its school identity too
    if (currentRpp) {
      setCurrentRpp({
        ...currentRpp,
        identitas: {
          ...currentRpp.identitas,
          namaSatuanPendidikan: newIdentitas.namaSekolah,
          namaGuru: newIdentitas.namaGuru,
          nipGuru: newIdentitas.nipGuru,
          tahunPelajaran: newIdentitas.tahunPelajaran,
        },
        pengesahan: {
          ...currentRpp.pengesahan,
          tempatTitimangsa: newIdentitas.tempatTitimangsa,
          namaKepalaSekolah: newIdentitas.namaKepalaSekolah,
          nipKepalaSekolah: newIdentitas.nipKepalaSekolah,
          namaGuru: newIdentitas.namaGuru,
          nipGuru: newIdentitas.nipGuru,
        },
        kustomisasi: newKustomisasi,
      });
    }
  };

  const handleGenerate = async (request: GenerateRPPRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Gagal menyusun RPP. Silakan coba kembali.');
      }

      const generatedData: ModulAjarData = {
        ...json.data,
        id: json.data.id || `rpp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        kustomisasi: request.kustomisasi,
      };

      setCurrentRpp(generatedData);
      // Auto save to drafts
      saveDraftToStorage(generatedData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating RPP:', err);
      setErrorMessage(err.message || 'Terjadi gangguan saat memproses materi ajar.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraftToStorage = (rpp: ModulAjarData) => {
    setDrafts((prev) => {
      const filtered = prev.filter((d) => d.id !== rpp.id);
      const updated = [rpp, ...filtered].slice(0, 30); // keep up to 30 drafts
      try {
        localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
      } catch (err) {
        console.error('Storage full or unavailable', err);
      }
      return updated;
    });
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    if (currentRpp?.id === id) {
      setCurrentRpp(null);
    }
  };

  const handleExportAllDrafts = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(drafts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cadangan_rpp_akl_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportDrafts = (imported: ModulAjarData[]) => {
    setDrafts((prev) => {
      const merged = [...imported, ...prev.filter((p) => !imported.some((i) => i.id === p.id))];
      try {
        localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(merged));
      } catch (err) {
        console.error(err);
      }
      return merged;
    });
    if (imported.length > 0) {
      setCurrentRpp(imported[0]);
    }
    setNotification(`Berhasil mengimpor ${imported.length} draf modul ajar.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenRegenerate = (sectionKey: string, sectionTitle: string, currentData: any) => {
    setRegenerateModalState({
      isOpen: true,
      sectionKey,
      sectionTitle,
      currentData,
    });
  };

  const handleApplySectionUpdate = (sectionKey: string, updatedData: any) => {
    if (!currentRpp) return;
    const updated: ModulAjarData = {
      ...currentRpp,
      [sectionKey]: updatedData,
      updatedAt: new Date().toISOString(),
    };
    setCurrentRpp(updated);
    saveDraftToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onNew={() => setCurrentRpp(null)}
        savedCount={drafts.length}
      />

      <main className="flex-1 pb-16">
        {errorMessage && (
          <div className="no-print max-w-4xl mx-auto mt-4 px-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Gagal Menyusun Modul Ajar</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {notification && (
          <div className="no-print max-w-4xl mx-auto mt-4 px-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span>{notification}</span>
              <button
                onClick={() => setNotification(null)}
                className="text-emerald-600 hover:text-emerald-800 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {currentRpp ? (
          <RppView
            rpp={currentRpp}
            onUpdateRpp={(updated) => {
              setCurrentRpp(updated);
              saveDraftToStorage(updated);
            }}
            onBack={() => setCurrentRpp(null)}
            onOpenRegenerateModal={handleOpenRegenerate}
            onSaveToDrafts={() => saveDraftToStorage(currentRpp)}
          />
        ) : (
          <MateriInputStep
            onGenerate={handleGenerate}
            isLoading={isLoading}
            identitasSekolah={identitasSekolah}
            kustomisasi={kustomisasi}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <SchoolCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        identitas={identitasSekolah}
        kustomisasi={kustomisasi}
        onSave={handleSaveSettings}
      />

      <SavedDraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        drafts={drafts}
        onSelectDraft={(selected) => setCurrentRpp(selected)}
        onDeleteDraft={handleDeleteDraft}
        onExportAll={handleExportAllDrafts}
        onImportDrafts={handleImportDrafts}
      />

      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {currentRpp && (
        <SectionEditorModal
          isOpen={regenerateModalState.isOpen}
          onClose={() => setRegenerateModalState((prev) => ({ ...prev, isOpen: false }))}
          sectionKey={regenerateModalState.sectionKey}
          sectionTitle={regenerateModalState.sectionTitle}
          currentData={regenerateModalState.currentData}
          context={{
            mapel: currentRpp.identitas.mataPelajaran,
            fase: currentRpp.identitas.faseKelasSemester,
            topik: currentRpp.identitas.topikPembelajaran,
          }}
          onApplyUpdate={handleApplySectionUpdate}
        />
      )}
    </div>
  );
}
