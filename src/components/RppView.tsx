import React, { useState, useEffect } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  Edit3,
  Sparkles,
  ArrowLeft,
  Save,
  FileCheck2,
  Calendar,
  Award,
  ClipboardList,
  Plus,
  Trash2,
} from 'lucide-react';
import { ModulAjarData, PertemuanBelajar, RubrikIndikator } from '../types/rpp';
import { exportRppToWord } from '../utils/wordExport';

interface RppViewProps {
  rpp: ModulAjarData;
  onUpdateRpp: (updated: ModulAjarData) => void;
  onBack: () => void;
  onOpenRegenerateModal: (sectionKey: string, sectionTitle: string, currentData: any) => void;
  onSaveToDrafts: () => void;
}

const inputClass =
  'w-full px-2.5 py-1.5 border border-amber-300 bg-amber-50/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-900 transition-colors';
const textareaClass =
  'w-full px-2.5 py-1.5 border border-amber-300 bg-amber-50/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-900 leading-relaxed transition-colors';

export const RppView: React.FC<RppViewProps> = ({
  rpp,
  onUpdateRpp,
  onBack,
  onOpenRegenerateModal,
  onSaveToDrafts,
}) => {
  const [activeTab, setActiveTab] = useState<'lengkap' | 'pengalaman' | 'asesmen' | 'lkpd'>('lengkap');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const [data, setData] = useState<ModulAjarData>(rpp);

  // Sync local state if rpp prop updates (e.g. from AI section regeneration or school settings modal)
  useEffect(() => {
    setData(rpp);
  }, [rpp]);

  const commitUpdate = (updater: (prev: ModulAjarData) => ModulAjarData) => {
    setData((prev) => {
      const updated = {
        ...updater(prev),
        updatedAt: new Date().toISOString(),
      };
      onUpdateRpp(updated);
      return updated;
    });
  };

  const handleFieldChange = (section: keyof ModulAjarData, field: string, value: any) => {
    commitUpdate((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleProfilDimensionToggle = (dimKey: string) => {
    if (!isEditMode) return;
    commitUpdate((prev) => ({
      ...prev,
      identifikasi: {
        ...prev.identifikasi,
        dimensiProfilLulusan: {
          ...prev.identifikasi.dimensiProfilLulusan,
          [dimKey]: !(prev.identifikasi.dimensiProfilLulusan as any)?.[dimKey],
        },
      },
    }));
  };

  // Tujuan Pembelajaran list handlers
  const handleTujuanChange = (idx: number, val: string) => {
    commitUpdate((prev) => {
      const next = [...prev.desainPembelajaran.tujuanPembelajaran];
      next[idx] = val;
      return {
        ...prev,
        desainPembelajaran: { ...prev.desainPembelajaran, tujuanPembelajaran: next },
      };
    });
  };

  const handleAddTujuan = () => {
    commitUpdate((prev) => ({
      ...prev,
      desainPembelajaran: {
        ...prev.desainPembelajaran,
        tujuanPembelajaran: [
          ...prev.desainPembelajaran.tujuanPembelajaran,
          'Peserta didik mampu menyusun dan mengevaluasi hasil tugas pembelajaran dengan tepat.',
        ],
      },
    }));
  };

  const handleRemoveTujuan = (idx: number) => {
    commitUpdate((prev) => ({
      ...prev,
      desainPembelajaran: {
        ...prev.desainPembelajaran,
        tujuanPembelajaran: prev.desainPembelajaran.tujuanPembelajaran.filter((_, i) => i !== idx),
      },
    }));
  };

  // Pengalaman Belajar per pertemuan handlers
  const handlePertemuanChange = (
    pIdx: number,
    updater: (m: PertemuanBelajar) => PertemuanBelajar
  ) => {
    commitUpdate((prev) => {
      const next = prev.pengalamanBelajar.map((m, idx) => (idx === pIdx ? updater(m) : m));
      return { ...prev, pengalamanBelajar: next };
    });
  };

  // Asesmen handlers
  const handleAsesmenField = (
    jenis: 'asesmenAwal' | 'asesmenProses' | 'asesmenAkhir',
    field: 'teknikDanInstrumen' | 'waktuPelaksanaan',
    val: string
  ) => {
    commitUpdate((prev) => ({
      ...prev,
      asesmenPembelajaran: {
        ...prev.asesmenPembelajaran,
        [jenis]: {
          ...prev.asesmenPembelajaran[jenis],
          [field]: val,
        },
      },
    }));
  };

  // Rubrik handlers
  const handleRubrikChange = (rIdx: number, field: keyof RubrikIndikator, val: string) => {
    commitUpdate((prev) => {
      const next = prev.asesmenPembelajaran.rubrikPenilaian.map((r, i) =>
        i === rIdx ? { ...r, [field]: val } : r
      );
      return {
        ...prev,
        asesmenPembelajaran: { ...prev.asesmenPembelajaran, rubrikPenilaian: next },
      };
    });
  };

  const handleAddRubrik = () => {
    commitUpdate((prev) => ({
      ...prev,
      asesmenPembelajaran: {
        ...prev.asesmenPembelajaran,
        rubrikPenilaian: [
          ...prev.asesmenPembelajaran.rubrikPenilaian,
          {
            kriteria: 'Kriteria Penilaian Tambahan',
            sangatBaik: 'Menunjukkan penguasaan sangat baik dan menyeluruh.',
            baik: 'Menunjukkan penguasaan baik sesuai standar.',
            cukup: 'Memerlukan sedikit arahan dalam penyelesaian tugas.',
            perluBimbingan: 'Memerlukan pendampingan intensif.',
          },
        ],
      },
    }));
  };

  const handleRemoveRubrik = (rIdx: number) => {
    commitUpdate((prev) => ({
      ...prev,
      asesmenPembelajaran: {
        ...prev.asesmenPembelajaran,
        rubrikPenilaian: prev.asesmenPembelajaran.rubrikPenilaian.filter((_, i) => i !== rIdx),
      },
    }));
  };

  // LKPD handlers
  const handleLkpdChange = (field: string, value: any) => {
    commitUpdate((prev) => ({
      ...prev,
      lampiran: {
        ...prev.lampiran,
        lkpd: {
          ...prev.lampiran.lkpd,
          [field]: value,
        },
      },
    }));
  };

  const handleLkpdListChange = (
    listKey: 'petunjukPengerjaan' | 'soalAnalisis',
    idx: number,
    val: string
  ) => {
    commitUpdate((prev) => {
      const next = [...(prev.lampiran.lkpd[listKey] || [])];
      next[idx] = val;
      return {
        ...prev,
        lampiran: {
          ...prev.lampiran,
          lkpd: { ...prev.lampiran.lkpd, [listKey]: next },
        },
      };
    });
  };

  const handleLkpdListAdd = (listKey: 'petunjukPengerjaan' | 'soalAnalisis') => {
    commitUpdate((prev) => ({
      ...prev,
      lampiran: {
        ...prev.lampiran,
        lkpd: {
          ...prev.lampiran.lkpd,
          [listKey]: [
            ...(prev.lampiran.lkpd[listKey] || []),
            listKey === 'petunjukPengerjaan'
              ? 'Petunjuk tambahan pengerjaan.'
              : 'Pertanyaan analisis tambahan.',
          ],
        },
      },
    }));
  };

  const handleLkpdListRemove = (listKey: 'petunjukPengerjaan' | 'soalAnalisis', idx: number) => {
    commitUpdate((prev) => ({
      ...prev,
      lampiran: {
        ...prev.lampiran,
        lkpd: {
          ...prev.lampiran.lkpd,
          [listKey]: (prev.lampiran.lkpd[listKey] || []).filter((_, i) => i !== idx),
        },
      },
    }));
  };

  const handleLkpdTableHeaderChange = (colIdx: number, val: string) => {
    commitUpdate((prev) => {
      const cols = [...(prev.lampiran.lkpd.tabelPengerjaan?.judulKolom || [])];
      cols[colIdx] = val;
      return {
        ...prev,
        lampiran: {
          ...prev.lampiran,
          lkpd: {
            ...prev.lampiran.lkpd,
            tabelPengerjaan: {
              ...prev.lampiran.lkpd.tabelPengerjaan,
              judulKolom: cols,
            },
          },
        },
      };
    });
  };

  const handleLkpdTableCellChange = (rIdx: number, cIdx: number, val: string) => {
    commitUpdate((prev) => {
      const rows = (prev.lampiran.lkpd.tabelPengerjaan?.barisPanduan || []).map((row, ri) =>
        ri === rIdx ? row.map((cell, ci) => (ci === cIdx ? val : cell)) : row
      );
      return {
        ...prev,
        lampiran: {
          ...prev.lampiran,
          lkpd: {
            ...prev.lampiran.lkpd,
            tabelPengerjaan: {
              ...prev.lampiran.lkpd.tabelPengerjaan,
              barisPanduan: rows,
            },
          },
        },
      };
    });
  };

  const handleAddLkpdRow = () => {
    commitUpdate((prev) => {
      const colCount = prev.lampiran.lkpd.tabelPengerjaan?.judulKolom?.length || 5;
      const newRow = Array.from({ length: colCount }, (_, i) => (i === 0 ? '-' : ''));
      return {
        ...prev,
        lampiran: {
          ...prev.lampiran,
          lkpd: {
            ...prev.lampiran.lkpd,
            tabelPengerjaan: {
              ...prev.lampiran.lkpd.tabelPengerjaan,
              barisPanduan: [
                ...(prev.lampiran.lkpd.tabelPengerjaan?.barisPanduan || []),
                newRow,
              ],
            },
          },
        },
      };
    });
  };

  const handleRemoveLkpdRow = (rIdx: number) => {
    commitUpdate((prev) => ({
      ...prev,
      lampiran: {
        ...prev.lampiran,
        lkpd: {
          ...prev.lampiran.lkpd,
          tabelPengerjaan: {
            ...prev.lampiran.lkpd.tabelPengerjaan,
            barisPanduan: (prev.lampiran.lkpd.tabelPengerjaan?.barisPanduan || []).filter(
              (_, i) => i !== rIdx
            ),
          },
        },
      },
    }));
  };

  const handleDiferensiasiChange = (field: 'konten' | 'proses' | 'produk', val: string) => {
    commitUpdate((prev) => ({
      ...prev,
      lampiran: {
        ...prev.lampiran,
        diferensiasi: {
          ...prev.lampiran.diferensiasi,
          [field]: val,
        },
      },
    }));
  };

  const handleCopyText = () => {
    const markdown = `
# RENCANA PELAKSANAAN PEMBELAJARAN (MODUL AJAR)
# PEMBELAJARAN MENDALAM (KURIKULUM MERDEKA)
Satuan Pendidikan: ${data.identitas.namaSatuanPendidikan}
Guru Mata Pelajaran: ${data.identitas.namaGuru} (${data.identitas.nipGuru})
Mata Pelajaran: ${data.identitas.mataPelajaran}
Fase/Kelas: ${data.identitas.faseKelasSemester}
Topik: ${data.identitas.topikPembelajaran}
Alokasi Waktu: ${data.identitas.alokasiWaktu}
Tahun Pelajaran: ${data.identitas.tahunPelajaran}

## 1. IDENTIFIKASI PEMBELAJARAN
- Kesiapan Belajar: ${data.identifikasi.kesiapanBelajarMurid}
- Gaya Belajar: ${data.identifikasi.minatDanGayaBelajar}
- Latar Belakang: ${data.identifikasi.latarBelakangDanKebutuhanKhusus}
- Jenis Pengetahuan: ${data.identifikasi.jenisPengetahuanMateri}
- Relevansi Nyata: ${data.identifikasi.relevansiKehidupanNyata}

## 2. DESAIN PEMBELAJARAN
- CP: ${data.desainPembelajaran.capaianPembelajaran}
- Tujuan: ${data.desainPembelajaran.tujuanPembelajaran.join('; ')}
- Praktik Pedagogis: ${data.desainPembelajaran.praktikPedagogis}
- Kemitraan: ${data.desainPembelajaran.kemitraanPembelajaran}
- Pemanfaatan Digital: ${data.desainPembelajaran.pemanfaatanDigital}

## 3. PENGALAMAN BELAJAR
${data.pengalamanBelajar
  .map(
    (p) => `
### Pertemuan ke-${p.pertemuanKe} (${p.alokasiWaktu}) - ${p.fokusMateri}
- Awal: ${p.tahapAwal.apersepsiDanPemantik}
- Inti Memahami: ${p.tahapInti.memahami}
- Inti Mengaplikasi: ${p.tahapInti.mengaplikasi}
- Inti Merefleksi: ${p.tahapInti.merefleksi}
- Penutup: ${p.tahapPenutup.kesimpulanDanRefleksi}
`
  )
  .join('\n')}

## 4. ASESMEN & LKPD
- Asesmen Awal: ${data.asesmenPembelajaran.asesmenAwal.teknikDanInstrumen}
- Asesmen Proses: ${data.asesmenPembelajaran.asesmenProses.teknikDanInstrumen}
- Asesmen Akhir: ${data.asesmenPembelajaran.asesmenAkhir.teknikDanInstrumen}
- LKPD: ${data.lampiran.lkpd.judul}
    `;

    navigator.clipboard.writeText(markdown.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    exportRppToWord(data);
  };

  const handleSaveDraft = () => {
    onSaveToDrafts();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Action Top Bar */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6 sticky top-18 z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Kembali ke formulir"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                  {data.identitas.topikPembelajaran}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    isEditMode
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isEditMode ? 'Sedang Diedit' : 'Siap Unduh'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {data.identitas.mataPelajaran} • {data.identitas.faseKelasSemester}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500 border-amber-600 text-white shadow-xs hover:bg-amber-600'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {isEditMode ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'Selesai Edit' : 'Edit Isi RPP'}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span>Simpan Draf</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyText}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-t border-slate-100 mt-3 pt-2 overflow-x-auto gap-1">
          {[
            { id: 'lengkap', label: 'Dokumen Lengkap (Format Resmi)', icon: FileCheck2 },
            { id: 'pengalaman', label: 'Pengalaman Belajar (Deep Learning)', icon: Calendar },
            { id: 'asesmen', label: 'Asesmen & Rubrik 4 Skala', icon: Award },
            { id: 'lkpd', label: 'LKPD & Lampiran', icon: ClipboardList },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Edit Mode Helper Banner */}
        {isEditMode && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Mode Edit Aktif:</strong> Ubah teks, tabel, tujuan, skenario pertemuan, rubrik, LKPD, maupun pengesahan langsung di bawah. Perubahan otomatis tersimpan sebelum Anda mengunduh Word (.doc) atau Cetak/PDF.
              </span>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0 self-end sm:self-center"
            >
              Selesai Edit
            </button>
          </div>
        )}
      </div>

      {/* Main Document Body */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 sm:p-10 print-card print:p-0">
        {/* Kop Surat Sekolah */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
            {data.identitas.namaSatuanPendidikan}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-800">
            KURIKULUM MERDEKA • {data.identitas.mataPelajaran.toUpperCase()}
          </p>
          <p className="text-xs text-slate-600">
            Tahun Pelajaran {data.identitas.tahunPelajaran}
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
            RENCANA PELAKSANAAN PEMBELAJARAN (MODUL AJAR)
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-700">
            PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful)
          </p>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: DOKUMEN LENGKAP ATAU PENGALAMAN BELAJAR            */}
        {/* ========================================================= */}
        {(activeTab === 'lengkap' || activeTab === 'pengalaman') && (
          <div className="space-y-6">
            {/* 1. IDENTITAS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                  1. Identitas Pembelajaran
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/3 p-2.5 font-bold bg-slate-50 text-slate-700">
                        Nama Satuan Pendidikan
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.namaSatuanPendidikan}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'namaSatuanPendidikan', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.namaSatuanPendidikan
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Nama & NIP Guru Mata Pelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={data.identitas.namaGuru}
                              onChange={(e) =>
                                handleFieldChange('identitas', 'namaGuru', e.target.value)
                              }
                              placeholder="Nama Guru"
                              className={inputClass}
                            />
                            <input
                              type="text"
                              value={data.identitas.nipGuru}
                              onChange={(e) =>
                                handleFieldChange('identitas', 'nipGuru', e.target.value)
                              }
                              placeholder="NIP Guru"
                              className={inputClass}
                            />
                          </div>
                        ) : (
                          <>
                            {data.identitas.namaGuru}{' '}
                            {data.identitas.nipGuru ? `(NIP: ${data.identitas.nipGuru})` : ''}
                          </>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Mata Pelajaran</td>
                      <td className="p-2.5 text-slate-800 font-semibold">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.mataPelajaran}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'mataPelajaran', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.mataPelajaran
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Fase / Kelas / Semester
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.faseKelasSemester}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'faseKelasSemester', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.faseKelasSemester
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Topik Pembelajaran
                      </td>
                      <td className="p-2.5 text-slate-800 font-bold text-blue-900">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.topikPembelajaran}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'topikPembelajaran', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.topikPembelajaran
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Alokasi Waktu</td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.alokasiWaktu}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'alokasiWaktu', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.alokasiWaktu
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Tahun Pelajaran</td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.identitas.tahunPelajaran}
                            onChange={(e) =>
                              handleFieldChange('identitas', 'tahunPelajaran', e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.identitas.tahunPelajaran
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. IDENTIFIKASI */}
            {data.kustomisasi.tampilkanIdentifikasi && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                    2. Identifikasi Pembelajaran Mendalam
                  </h3>
                  <button
                    onClick={() =>
                      onOpenRegenerateModal(
                        'identifikasi',
                        'Bagian 2: Identifikasi',
                        data.identifikasi
                      )
                    }
                    className="no-print inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Regenerasi AI</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-300 border-collapse mb-3">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="w-1/3 p-2.5 font-bold bg-slate-50 text-slate-700">
                          Kesiapan Belajar Murid
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {isEditMode ? (
                            <textarea
                              rows={3}
                              value={data.identifikasi.kesiapanBelajarMurid}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'kesiapanBelajarMurid',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.identifikasi.kesiapanBelajarMurid
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Minat dan Gaya Belajar
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.identifikasi.minatDanGayaBelajar}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'minatDanGayaBelajar',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.identifikasi.minatDanGayaBelajar
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Latar Belakang & Kebutuhan Khusus
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.identifikasi.latarBelakangDanKebutuhanKhusus}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'latarBelakangDanKebutuhanKhusus',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.identifikasi.latarBelakangDanKebutuhanKhusus
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Jenis Pengetahuan Materi
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {isEditMode ? (
                            <textarea
                              rows={3}
                              value={data.identifikasi.jenisPengetahuanMateri}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'jenisPengetahuanMateri',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.identifikasi.jenisPengetahuanMateri
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Relevansi Materi dengan Kehidupan Nyata / Dunia Kerja
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.identifikasi.relevansiKehidupanNyata}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'relevansiKehidupanNyata',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.identifikasi.relevansiKehidupanNyata
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Profil Lulusan */}
                {data.kustomisasi.tampilkanProfilLulusan && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <span className="font-bold text-slate-800 block mb-2">
                      Dimensi Profil Lulusan yang Ditargetkan{' '}
                      {isEditMode && (
                        <span className="text-[11px] font-normal text-amber-700">
                          (Klik kotak untuk memilih/menghapus centang)
                        </span>
                      )}
                      :
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'keimanan', label: 'Keimanan & Ketakwaan' },
                        { key: 'kewargaan', label: 'Kewargaan' },
                        { key: 'penalaranKritis', label: 'Penalaran Kritis' },
                        { key: 'kreativitas', label: 'Kreativitas' },
                        { key: 'kolaborasi', label: 'Kolaborasi' },
                        { key: 'kemandirian', label: 'Kemandirian' },
                        { key: 'kesehatan', label: 'Kesehatan' },
                        { key: 'komunikasi', label: 'Komunikasi' },
                      ].map((dim) => {
                        const isChecked =
                          (data.identifikasi.dimensiProfilLulusan as any)?.[dim.key] ?? false;
                        return (
                          <button
                            type="button"
                            key={dim.key}
                            onClick={() => handleProfilDimensionToggle(dim.key)}
                            disabled={!isEditMode}
                            className={`flex items-center space-x-1.5 p-1.5 rounded-lg border text-left transition-colors ${
                              isChecked
                                ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-400'
                            } ${isEditMode ? 'cursor-pointer hover:border-amber-400' : 'cursor-default'}`}
                          >
                            <span className="text-xs">{isChecked ? '☑' : '☐'}</span>
                            <span className="text-[11px]">{dim.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {isEditMode ? (
                      <div className="mt-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Integrasi Aktivitas:
                        </label>
                        <textarea
                          rows={2}
                          value={data.identifikasi.dimensiProfilLulusanCatatan || ''}
                          onChange={(e) =>
                            handleFieldChange(
                              'identifikasi',
                              'dimensiProfilLulusanCatatan',
                              e.target.value
                            )
                          }
                          className={textareaClass}
                        />
                      </div>
                    ) : (
                      data.identifikasi.dimensiProfilLulusanCatatan && (
                        <p className="mt-2 text-[11px] text-slate-600 italic">
                          <strong>Integrasi Aktivitas:</strong>{' '}
                          {data.identifikasi.dimensiProfilLulusanCatatan}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. DESAIN PEMBELAJARAN */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                  3. Desain Pembelajaran
                </h3>
                <button
                  onClick={() =>
                    onOpenRegenerateModal(
                      'desainPembelajaran',
                      'Bagian 3: Desain Pembelajaran',
                      data.desainPembelajaran
                    )
                  }
                  className="no-print inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Regenerasi AI</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/3 p-2.5 font-bold bg-slate-50 text-slate-700">
                        Capaian Pembelajaran (CP)
                      </td>
                      <td className="p-2.5 text-slate-800 leading-relaxed font-serif">
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={data.desainPembelajaran.capaianPembelajaran}
                            onChange={(e) =>
                              handleFieldChange(
                                'desainPembelajaran',
                                'capaianPembelajaran',
                                e.target.value
                              )
                            }
                            className={textareaClass}
                          />
                        ) : (
                          data.desainPembelajaran.capaianPembelajaran
                        )}
                      </td>
                    </tr>
                    {data.kustomisasi.tampilkanLintasDisiplin && (
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Lintas Disiplin Ilmu
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.desainPembelajaran.lintasDisiplinIlmu}
                              onChange={(e) =>
                                handleFieldChange(
                                  'desainPembelajaran',
                                  'lintasDisiplinIlmu',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.desainPembelajaran.lintasDisiplinIlmu
                          )}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700 align-top">
                        Tujuan Pembelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <div className="space-y-2">
                            {data.desainPembelajaran.tujuanPembelajaran.map((tp, idx) => (
                              <div key={idx} className="flex items-start space-x-1.5">
                                <span className="font-bold text-slate-500 pt-1.5 w-5 shrink-0">
                                  {idx + 1}.
                                </span>
                                <textarea
                                  rows={2}
                                  value={tp}
                                  onChange={(e) => handleTujuanChange(idx, e.target.value)}
                                  className={textareaClass}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTujuan(idx)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg mt-0.5"
                                  title="Hapus tujuan"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={handleAddTujuan}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Tujuan Pembelajaran</span>
                            </button>
                          </div>
                        ) : (
                          <ol className="list-decimal pl-4 space-y-1">
                            {data.desainPembelajaran.tujuanPembelajaran.map((tp, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {tp}
                              </li>
                            ))}
                          </ol>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Topik Pembelajaran Kontekstual
                      </td>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={data.desainPembelajaran.topikPembelajaranKontekstual}
                            onChange={(e) =>
                              handleFieldChange(
                                'desainPembelajaran',
                                'topikPembelajaranKontekstual',
                                e.target.value
                              )
                            }
                            className={textareaClass}
                          />
                        ) : (
                          data.desainPembelajaran.topikPembelajaranKontekstual
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Praktik Pedagogis (Model)
                      </td>
                      <td className="p-2.5 text-slate-800 font-semibold text-blue-900">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={data.desainPembelajaran.praktikPedagogis}
                            onChange={(e) =>
                              handleFieldChange(
                                'desainPembelajaran',
                                'praktikPedagogis',
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                        ) : (
                          data.desainPembelajaran.praktikPedagogis
                        )}
                      </td>
                    </tr>
                    {data.kustomisasi.tampilkanKemitraanDudi && (
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Kemitraan Pembelajaran (DUDI / Industri)
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.desainPembelajaran.kemitraanPembelajaran}
                              onChange={(e) =>
                                handleFieldChange(
                                  'desainPembelajaran',
                                  'kemitraanPembelajaran',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.desainPembelajaran.kemitraanPembelajaran
                          )}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Lingkungan Pembelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={data.desainPembelajaran.lingkunganPembelajaran}
                            onChange={(e) =>
                              handleFieldChange(
                                'desainPembelajaran',
                                'lingkunganPembelajaran',
                                e.target.value
                              )
                            }
                            className={textareaClass}
                          />
                        ) : (
                          data.desainPembelajaran.lingkunganPembelajaran
                        )}
                      </td>
                    </tr>
                    {data.kustomisasi.tampilkanPemanfaatanDigital && (
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Pemanfaatan Digital
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.desainPembelajaran.pemanfaatanDigital}
                              onChange={(e) =>
                                handleFieldChange(
                                  'desainPembelajaran',
                                  'pemanfaatanDigital',
                                  e.target.value
                                )
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.desainPembelajaran.pemanfaatanDigital
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. PENGALAMAN BELAJAR */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                    4. Pengalaman Belajar (Skenario Pertemuan Mendalam)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Pendekatan Pembelajaran Mendalam: Berkesadaran (sadar tujuan), Bermakna (terkait kehidupan nyata), Menggembirakan (positif & menantang).
                  </p>
                </div>
                <button
                  onClick={() =>
                    onOpenRegenerateModal(
                      'pengalamanBelajar',
                      'Bagian 4: Pengalaman Belajar',
                      data.pengalamanBelajar
                    )
                  }
                  className="no-print inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Regenerasi AI</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.pengalamanBelajar.map((m, pIdx) => (
                  <div key={m.pertemuanKe} className="avoid-break">
                    <div className="bg-blue-50/70 border border-blue-200 px-3 py-2 rounded-t-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      {isEditMode ? (
                        <div className="flex flex-wrap items-center gap-2 w-full">
                          <span className="font-bold text-xs text-blue-900">
                            Pertemuan ke-{m.pertemuanKe}
                          </span>
                          <input
                            type="text"
                            value={m.alokasiWaktu}
                            onChange={(e) =>
                              handlePertemuanChange(pIdx, (prev) => ({
                                ...prev,
                                alokasiWaktu: e.target.value,
                              }))
                            }
                            placeholder="Alokasi Waktu"
                            className="px-2 py-1 border border-amber-300 bg-white rounded text-xs w-36"
                          />
                          <input
                            type="text"
                            value={m.fokusMateri}
                            onChange={(e) =>
                              handlePertemuanChange(pIdx, (prev) => ({
                                ...prev,
                                fokusMateri: e.target.value,
                              }))
                            }
                            placeholder="Fokus Materi Pertemuan"
                            className="px-2 py-1 border border-amber-300 bg-white rounded text-xs flex-1 min-w-48"
                          />
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-xs text-blue-900">
                            Pertemuan ke-{m.pertemuanKe} ({m.alokasiWaktu})
                          </span>
                          <span className="text-[11px] font-medium text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                            Fokus: {m.fokusMateri}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-300 border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-300">
                            <th className="p-2.5 w-1/4 border-r border-slate-300">
                              Tahap Pembelajaran
                            </th>
                            <th className="p-2.5 w-3/5 border-r border-slate-300">
                              Kegiatan Pembelajaran Berkesadaran & Bermakna
                            </th>
                            <th className="p-2.5 w-[15%] text-center">Waktu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Awal */}
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Awal: Salam, Doa, Presensi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {isEditMode ? (
                                <textarea
                                  rows={2}
                                  value={m.tahapAwal.salamDoaPresensi}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapAwal: {
                                        ...prev.tahapAwal,
                                        salamDoaPresensi: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapAwal.salamDoaPresensi
                              )}
                            </td>
                            <td
                              rowSpan={3}
                              className="p-2.5 text-center font-bold text-slate-600 bg-slate-50/50 align-top"
                            >
                              {isEditMode ? (
                                <div className="flex flex-col items-center gap-1">
                                  <input
                                    type="number"
                                    min={1}
                                    value={m.tahapAwal.alokasiWaktuMenit}
                                    onChange={(e) =>
                                      handlePertemuanChange(pIdx, (prev) => ({
                                        ...prev,
                                        tahapAwal: {
                                          ...prev.tahapAwal,
                                          alokasiWaktuMenit: Number(e.target.value) || 0,
                                        },
                                      }))
                                    }
                                    className="w-14 px-1.5 py-1 border border-amber-300 bg-white rounded text-center text-xs"
                                  />
                                  <span className="text-[10px]">menit</span>
                                </div>
                              ) : (
                                `${m.tahapAwal.alokasiWaktuMenit} mnt`
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Awal: Apersepsi & Pertanyaan Pemantik
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top font-medium text-indigo-900">
                              {isEditMode ? (
                                <textarea
                                  rows={2}
                                  value={m.tahapAwal.apersepsiDanPemantik}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapAwal: {
                                        ...prev.tahapAwal,
                                        apersepsiDanPemantik: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapAwal.apersepsiDanPemantik
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Awal: Penyampaian Tujuan & Ice Breaking
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {isEditMode ? (
                                <textarea
                                  rows={2}
                                  value={m.tahapAwal.penyampaianTujuanIceBreaking}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapAwal: {
                                        ...prev.tahapAwal,
                                        penyampaianTujuanIceBreaking: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapAwal.penyampaianTujuanIceBreaking
                              )}
                            </td>
                          </tr>

                          {/* Inti Deep Learning */}
                          <tr className="border-b border-slate-200 bg-blue-50/30">
                            <td className="p-2.5 font-bold text-blue-900 border-r border-slate-200 align-top">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] mb-1">
                                Deep Learning
                              </span>
                              <br />
                              Inti: Memahami
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={m.tahapInti.memahami}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapInti: {
                                        ...prev.tahapInti,
                                        memahami: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapInti.memahami
                              )}
                            </td>
                            <td
                              rowSpan={3}
                              className="p-2.5 text-center font-bold text-slate-700 bg-blue-50/50 align-top"
                            >
                              {isEditMode ? (
                                <div className="flex flex-col items-center gap-1">
                                  <input
                                    type="number"
                                    min={1}
                                    value={m.tahapInti.alokasiWaktuMenit}
                                    onChange={(e) =>
                                      handlePertemuanChange(pIdx, (prev) => ({
                                        ...prev,
                                        tahapInti: {
                                          ...prev.tahapInti,
                                          alokasiWaktuMenit: Number(e.target.value) || 0,
                                        },
                                      }))
                                    }
                                    className="w-14 px-1.5 py-1 border border-amber-300 bg-white rounded text-center text-xs"
                                  />
                                  <span className="text-[10px]">menit</span>
                                </div>
                              ) : (
                                `${m.tahapInti.alokasiWaktuMenit} mnt`
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200 bg-blue-50/30">
                            <td className="p-2.5 font-bold text-blue-900 border-r border-slate-200 align-top">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] mb-1">
                                Praktik
                              </span>
                              <br />
                              Inti: Mengaplikasi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top leading-relaxed font-serif">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={m.tahapInti.mengaplikasi}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapInti: {
                                        ...prev.tahapInti,
                                        mengaplikasi: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapInti.mengaplikasi
                              )}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200 bg-blue-50/30">
                            <td className="p-2.5 font-bold text-blue-900 border-r border-slate-200 align-top">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] mb-1">
                                Evaluasi
                              </span>
                              <br />
                              Inti: Merefleksi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={m.tahapInti.merefleksi}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapInti: {
                                        ...prev.tahapInti,
                                        merefleksi: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapInti.merefleksi
                              )}
                            </td>
                          </tr>

                          {/* Penutup */}
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Penutup: Kesimpulan & Refleksi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {isEditMode ? (
                                <textarea
                                  rows={2}
                                  value={m.tahapPenutup.kesimpulanDanRefleksi}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapPenutup: {
                                        ...prev.tahapPenutup,
                                        kesimpulanDanRefleksi: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapPenutup.kesimpulanDanRefleksi
                              )}
                            </td>
                            <td
                              rowSpan={2}
                              className="p-2.5 text-center font-bold text-slate-600 bg-slate-50/50 align-top"
                            >
                              {isEditMode ? (
                                <div className="flex flex-col items-center gap-1">
                                  <input
                                    type="number"
                                    min={1}
                                    value={m.tahapPenutup.alokasiWaktuMenit}
                                    onChange={(e) =>
                                      handlePertemuanChange(pIdx, (prev) => ({
                                        ...prev,
                                        tahapPenutup: {
                                          ...prev.tahapPenutup,
                                          alokasiWaktuMenit: Number(e.target.value) || 0,
                                        },
                                      }))
                                    }
                                    className="w-14 px-1.5 py-1 border border-amber-300 bg-white rounded text-center text-xs"
                                  />
                                  <span className="text-[10px]">menit</span>
                                </div>
                              ) : (
                                `${m.tahapPenutup.alokasiWaktuMenit} mnt`
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Penutup: Umpan Balik & Doa
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {isEditMode ? (
                                <textarea
                                  rows={2}
                                  value={m.tahapPenutup.umpanBalikTindakLanjutDoa}
                                  onChange={(e) =>
                                    handlePertemuanChange(pIdx, (prev) => ({
                                      ...prev,
                                      tahapPenutup: {
                                        ...prev.tahapPenutup,
                                        umpanBalikTindakLanjutDoa: e.target.value,
                                      },
                                    }))
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                m.tahapPenutup.umpanBalikTindakLanjutDoa
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ASESMEN PEMBELAJARAN & RUBRIK                    */}
        {/* ========================================================= */}
        {(activeTab === 'lengkap' || activeTab === 'asesmen') && (
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                  5. Asesmen Pembelajaran
                </h3>
                <button
                  onClick={() =>
                    onOpenRegenerateModal(
                      'asesmenPembelajaran',
                      'Bagian 5: Asesmen Pembelajaran',
                      data.asesmenPembelajaran
                    )
                  }
                  className="no-print inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Regenerasi AI</span>
                </button>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-300">
                      <th className="p-2.5 w-1/4 border-r border-slate-300">Jenis Asesmen</th>
                      <th className="p-2.5 w-7/12 border-r border-slate-300">
                        Teknik dan Instrumen
                      </th>
                      <th className="p-2.5 w-1/6 text-center">Waktu Pelaksanaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'asesmenAwal' as const, label: 'Asesmen Awal (Diagnostik)' },
                      { key: 'asesmenProses' as const, label: 'Asesmen Proses (Formatif)' },
                      { key: 'asesmenAkhir' as const, label: 'Asesmen Akhir (Sumatif)' },
                    ].map((row, idx, arr) => (
                      <tr
                        key={row.key}
                        className={idx < arr.length - 1 ? 'border-b border-slate-200' : ''}
                      >
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                          {row.label}
                        </td>
                        <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.asesmenPembelajaran[row.key].teknikDanInstrumen}
                              onChange={(e) =>
                                handleAsesmenField(row.key, 'teknikDanInstrumen', e.target.value)
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.asesmenPembelajaran[row.key].teknikDanInstrumen
                          )}
                        </td>
                        <td className="p-2.5 text-center text-slate-600 font-medium align-top">
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={data.asesmenPembelajaran[row.key].waktuPelaksanaan}
                              onChange={(e) =>
                                handleAsesmenField(row.key, 'waktuPelaksanaan', e.target.value)
                              }
                              className={textareaClass}
                            />
                          ) : (
                            data.asesmenPembelajaran[row.key].waktuPelaksanaan
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rubrik Penilaian 4 Tingkat */}
              {data.kustomisasi.tampilkanRubrikLengkap && (
                <div className="avoid-break mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-800">
                      Rubrik Penilaian Kompetensi:
                    </h4>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={handleAddRubrik}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah Kriteria Rubrik</span>
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-left border-b border-slate-300">
                          <th className="p-2.5 w-1/5 border-r border-slate-300 font-bold">
                            Kriteria / Indikator
                          </th>
                          <th className="p-2 border-r border-slate-300 font-bold text-emerald-800 bg-emerald-50/50">
                            Sangat Baik (4)
                          </th>
                          <th className="p-2 border-r border-slate-300 font-bold text-blue-800 bg-blue-50/50">
                            Baik (3)
                          </th>
                          <th className="p-2 border-r border-slate-300 font-bold text-amber-800 bg-amber-50/50">
                            Cukup (2)
                          </th>
                          <th className="p-2 font-bold text-rose-800 bg-rose-50/50">
                            Perlu Bimbingan (1)
                          </th>
                          {isEditMode && <th className="p-2 w-10 text-center">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {data.asesmenPembelajaran.rubrikPenilaian.map((rubrik, idx) => (
                          <tr key={idx} className="border-b border-slate-200 align-top">
                            <td className="p-2 font-bold text-slate-800 bg-slate-50 border-r border-slate-200">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={rubrik.kriteria}
                                  onChange={(e) =>
                                    handleRubrikChange(idx, 'kriteria', e.target.value)
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                rubrik.kriteria
                              )}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={rubrik.sangatBaik}
                                  onChange={(e) =>
                                    handleRubrikChange(idx, 'sangatBaik', e.target.value)
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                rubrik.sangatBaik
                              )}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={rubrik.baik}
                                  onChange={(e) =>
                                    handleRubrikChange(idx, 'baik', e.target.value)
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                rubrik.baik
                              )}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={rubrik.cukup}
                                  onChange={(e) =>
                                    handleRubrikChange(idx, 'cukup', e.target.value)
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                rubrik.cukup
                              )}
                            </td>
                            <td className="p-2 text-slate-700 leading-relaxed">
                              {isEditMode ? (
                                <textarea
                                  rows={3}
                                  value={rubrik.perluBimbingan}
                                  onChange={(e) =>
                                    handleRubrikChange(idx, 'perluBimbingan', e.target.value)
                                  }
                                  className={textareaClass}
                                />
                              ) : (
                                rubrik.perluBimbingan
                              )}
                            </td>
                            {isEditMode && (
                              <td className="p-2 text-center border-l border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRubrik(idx)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  title="Hapus baris rubrik"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LAMPIRAN (LKPD, BAHAN BACAAN, DIFERENSIASI)       */}
        {/* ========================================================= */}
        {(activeTab === 'lengkap' || activeTab === 'lkpd') && (
          <div className="space-y-6 mt-6 print-page-break">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border-l-4 border-blue-600">
                  6. Lampiran Pembelajaran Operasional
                </h3>
                <button
                  onClick={() =>
                    onOpenRegenerateModal(
                      'lampiran',
                      'Bagian 6: Lampiran (LKPD & Bahan Ajar)',
                      data.lampiran
                    )
                  }
                  className="no-print inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Regenerasi LKPD AI</span>
                </button>
              </div>

              {/* LKPD */}
              {data.kustomisasi.tampilkanLKPD && (
                <div className="border border-slate-300 rounded-xl p-5 bg-slate-50/50 mb-6 avoid-break">
                  <div className="text-center pb-3 border-b border-slate-200 mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded-full">
                      Lembar Kerja Peserta Didik (LKPD)
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={data.lampiran.lkpd.judul}
                        onChange={(e) => handleLkpdChange('judul', e.target.value)}
                        className={`${inputClass} mt-2 text-center font-bold`}
                      />
                    ) : (
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {data.lampiran.lkpd.judul}
                      </h4>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Mata Pelajaran: {data.identitas.mataPelajaran} • {data.identitas.faseKelasSemester}
                    </p>
                  </div>

                  {/* Petunjuk Pengerjaan */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">Petunjuk Pengerjaan:</span>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleLkpdListAdd('petunjukPengerjaan')}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Petunjuk</span>
                        </button>
                      )}
                    </div>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        {data.lampiran.lkpd.petunjukPengerjaan.map((petunjuk, i) => (
                          <div key={i} className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-500 w-5 shrink-0">
                              {i + 1}.
                            </span>
                            <input
                              type="text"
                              value={petunjuk}
                              onChange={(e) =>
                                handleLkpdListChange('petunjukPengerjaan', i, e.target.value)
                              }
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => handleLkpdListRemove('petunjukPengerjaan', i)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
                        {data.lampiran.lkpd.petunjukPengerjaan.map((petunjuk, i) => (
                          <li key={i}>{petunjuk}</li>
                        ))}
                      </ol>
                    )}
                  </div>

                  {/* Dokumen Kasus Transaksi Riil */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Dokumen Kasus / Soal Praktikum Nyata:
                    </span>
                    {isEditMode ? (
                      <textarea
                        rows={7}
                        value={data.lampiran.lkpd.kasusTransaksi}
                        onChange={(e) => handleLkpdChange('kasusTransaksi', e.target.value)}
                        className={`${textareaClass} font-mono`}
                      />
                    ) : (
                      <div className="p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-xs">
                        {data.lampiran.lkpd.kasusTransaksi}
                      </div>
                    )}
                  </div>

                  {/* Format Kolom Pengerjaan LKPD */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        Format Kertas Kerja Siswa:
                      </span>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={handleAddLkpdRow}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Baris</span>
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-400 border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-200 text-slate-800">
                            {data.lampiran.lkpd.tabelPengerjaan?.judulKolom?.map((col, idx) => (
                              <th
                                key={idx}
                                className="p-2 border border-slate-400 font-bold text-center"
                              >
                                {isEditMode ? (
                                  <input
                                    type="text"
                                    value={col}
                                    onChange={(e) =>
                                      handleLkpdTableHeaderChange(idx, e.target.value)
                                    }
                                    className="w-full px-1.5 py-1 border border-amber-300 bg-white rounded text-xs font-bold text-center"
                                  />
                                ) : (
                                  col
                                )}
                              </th>
                            ))}
                            {isEditMode && (
                              <th className="p-2 border border-slate-400 w-10 text-center">
                                Aksi
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            data.lampiran.lkpd.tabelPengerjaan?.barisPanduan || [
                              ['1', '', '', '', ''],
                              ['2', '', '', '', ''],
                              ['3', '', '', '', ''],
                            ]
                          ).map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="p-1.5 border border-slate-400 text-slate-700 h-8"
                                >
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) =>
                                        handleLkpdTableCellChange(rIdx, cIdx, e.target.value)
                                      }
                                      className="w-full px-1.5 py-1 border border-amber-200 bg-amber-50/20 rounded text-xs"
                                    />
                                  ) : (
                                    cell
                                  )}
                                </td>
                              ))}
                              {isEditMode && (
                                <td className="p-1.5 border border-slate-400 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLkpdRow(rIdx)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                    title="Hapus baris"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Soal Analisis Kritis */}
                  {(data.lampiran.lkpd.soalAnalisis?.length > 0 || isEditMode) && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">
                          Pertanyaan Analisis & Penalaran Kritis:
                        </span>
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleLkpdListAdd('soalAnalisis')}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Soal</span>
                          </button>
                        )}
                      </div>
                      {isEditMode ? (
                        <div className="space-y-1.5">
                          {(data.lampiran.lkpd.soalAnalisis || []).map((soal, i) => (
                            <div key={i} className="flex items-start space-x-1.5">
                              <span className="text-xs font-bold text-slate-500 pt-1.5 w-5 shrink-0">
                                {i + 1}.
                              </span>
                              <textarea
                                rows={2}
                                value={soal}
                                onChange={(e) =>
                                  handleLkpdListChange('soalAnalisis', i, e.target.value)
                                }
                                className={textareaClass}
                              />
                              <button
                                type="button"
                                onClick={() => handleLkpdListRemove('soalAnalisis', i)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded mt-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
                          {data.lampiran.lkpd.soalAnalisis.map((soal, i) => (
                            <li key={i}>{soal}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bahan Bacaan */}
              {data.kustomisasi.tampilkanBahanBacaan && (
                <div className="mb-6 avoid-break">
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5">
                    Bahan Bacaan & Ringkasan Konsep Materi:
                  </h4>
                  {isEditMode ? (
                    <textarea
                      rows={6}
                      value={data.lampiran.bahanBacaanMateri}
                      onChange={(e) =>
                        handleFieldChange('lampiran', 'bahanBacaanMateri', e.target.value)
                      }
                      className={textareaClass}
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {data.lampiran.bahanBacaanMateri}
                    </div>
                  )}
                </div>
              )}

              {/* Diferensiasi */}
              {data.kustomisasi.tampilkanDiferensiasi && (
                <div className="mb-6 avoid-break">
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5">
                    Rencana Pembelajaran Berdiferensiasi:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="w-1/4 p-2.5 font-bold bg-slate-50 text-slate-700">
                            Diferensiasi Konten
                          </td>
                          <td className="p-2.5 text-slate-800 leading-relaxed">
                            {isEditMode ? (
                              <textarea
                                rows={2}
                                value={data.lampiran.diferensiasi.konten}
                                onChange={(e) =>
                                  handleDiferensiasiChange('konten', e.target.value)
                                }
                                className={textareaClass}
                              />
                            ) : (
                              data.lampiran.diferensiasi.konten
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                            Diferensiasi Proses
                          </td>
                          <td className="p-2.5 text-slate-800 leading-relaxed">
                            {isEditMode ? (
                              <textarea
                                rows={2}
                                value={data.lampiran.diferensiasi.proses}
                                onChange={(e) =>
                                  handleDiferensiasiChange('proses', e.target.value)
                                }
                                className={textareaClass}
                              />
                            ) : (
                              data.lampiran.diferensiasi.proses
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                            Diferensiasi Produk
                          </td>
                          <td className="p-2.5 text-slate-800 leading-relaxed">
                            {isEditMode ? (
                              <textarea
                                rows={2}
                                value={data.lampiran.diferensiasi.produk}
                                onChange={(e) =>
                                  handleDiferensiasiChange('produk', e.target.value)
                                }
                                className={textareaClass}
                              />
                            ) : (
                              data.lampiran.diferensiasi.produk
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LEMBAR PENGESAHAN RESMI                                   */}
        {/* ========================================================= */}
        {data.kustomisasi.tampilkanPengesahan && (
          <div className="mt-10 pt-6 border-t border-slate-300 avoid-break">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-800">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah</p>
                <div className="h-16" />
                {isEditMode ? (
                  <div className="space-y-1.5 max-w-xs">
                    <input
                      type="text"
                      value={data.pengesahan.namaKepalaSekolah}
                      onChange={(e) =>
                        handleFieldChange('pengesahan', 'namaKepalaSekolah', e.target.value)
                      }
                      placeholder="Nama Kepala Sekolah"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={data.pengesahan.nipKepalaSekolah}
                      onChange={(e) =>
                        handleFieldChange('pengesahan', 'nipKepalaSekolah', e.target.value)
                      }
                      placeholder="NIP Kepala Sekolah"
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-bold underline uppercase">
                      {data.pengesahan.namaKepalaSekolah}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      NIP. {data.pengesahan.nipKepalaSekolah}
                    </p>
                  </>
                )}
              </div>

              <div>
                {isEditMode ? (
                  <div className="mb-1 max-w-xs">
                    <input
                      type="text"
                      value={data.pengesahan.tempatTitimangsa}
                      onChange={(e) =>
                        handleFieldChange('pengesahan', 'tempatTitimangsa', e.target.value)
                      }
                      placeholder="Tempat, Tanggal"
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <p>{data.pengesahan.tempatTitimangsa}</p>
                )}
                <p className="font-semibold">Guru Mata Pelajaran</p>
                <div className="h-16" />
                {isEditMode ? (
                  <div className="space-y-1.5 max-w-xs">
                    <input
                      type="text"
                      value={data.pengesahan.namaGuru}
                      onChange={(e) =>
                        handleFieldChange('pengesahan', 'namaGuru', e.target.value)
                      }
                      placeholder="Nama Guru"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={data.pengesahan.nipGuru}
                      onChange={(e) =>
                        handleFieldChange('pengesahan', 'nipGuru', e.target.value)
                      }
                      placeholder="NIP Guru"
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-bold underline uppercase">{data.pengesahan.namaGuru}</p>
                    <p className="text-[11px] text-slate-600">NIP. {data.pengesahan.nipGuru}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
