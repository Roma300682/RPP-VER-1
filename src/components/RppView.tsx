import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  Edit3,
  Sparkles,
  ArrowLeft,
  Save,
  Layers,
  FileCheck2,
  Calendar,
  BookOpen,
  Award,
  ClipboardList,
  Building,
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

  // Editable local state
  const [data, setData] = useState<ModulAjarData>(rpp);

  const handleFieldChange = (section: keyof ModulAjarData, field: string, value: any) => {
    setData((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value,
        },
      };
      onUpdateRpp(updated);
      return updated;
    });
  };

  const handleCopyText = () => {
    const markdown = `
# RENCANA PELAKSANAAN PEMBELAJARAN (MODUL AJAR)
# PEMBELAJARAN MENDALAM (KURIKULUM MERDEKA)
Satuan Pendidikan: ${data.identitas.namaSatuanPendidikan}
Mata Pelajaran: ${data.identitas.mataPelajaran}
Fase/Kelas: ${data.identitas.faseKelasSemester}
Topik: ${data.identitas.topikPembelajaran}
Alokasi Waktu: ${data.identitas.alokasiWaktu}
Tahun Pelajaran: ${data.identitas.tahunPelajaran}

## 1. IDENTIFIKASI PEMBELAJARAN
- Kesiapan Belajar: ${data.identifikasi.kesiapanBelajarMurid}
- Gaya Belajar: ${data.identifikasi.minatDanGayaBelajar}
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
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Tersusun
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
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isEditMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Selesai Edit' : 'Mode Edit Teks'}</span>
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
            { id: 'lkpd', label: 'LKPD Kasus Transaksi AKL', icon: ClipboardList },
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
      </div>

      {/* Main Document Body */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 sm:p-10 print-card print:p-0">
        {/* Kop Surat Sekolah */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
            {data.identitas.namaSatuanPendidikan}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-800">
            PROGRAM KEAHLIAN AKUNTANSI DAN KEUANGAN LEMBAGA (AKL)
          </p>
          <p className="text-xs text-slate-600">
            Tahun Pelajaran {data.identitas.tahunPelajaran} • Kurikulum Merdeka
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
        {/* TAB 1: DOKUMEN LENGKAP ATAU VIEW UMUM                    */}
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
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          data.identitas.namaSatuanPendidikan
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Nama Guru Mata Pelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {data.identitas.namaGuru} {data.identitas.nipGuru ? `(NIP: ${data.identitas.nipGuru})` : ''}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Mata Pelajaran</td>
                      <td className="p-2.5 text-slate-800 font-semibold">{data.identitas.mataPelajaran}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Fase / Kelas / Semester</td>
                      <td className="p-2.5 text-slate-800">{data.identitas.faseKelasSemester}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Topik Pembelajaran</td>
                      <td className="p-2.5 text-slate-800 font-bold text-blue-900">
                        {data.identitas.topikPembelajaran}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Alokasi Waktu</td>
                      <td className="p-2.5 text-slate-800">{data.identitas.alokasiWaktu}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">Tahun Pelajaran</td>
                      <td className="p-2.5 text-slate-800">{data.identitas.tahunPelajaran}</td>
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
                              rows={2}
                              value={data.identifikasi.kesiapanBelajarMurid}
                              onChange={(e) =>
                                handleFieldChange(
                                  'identifikasi',
                                  'kesiapanBelajarMurid',
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
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
                              className="w-full p-1 border rounded"
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
                          {data.identifikasi.latarBelakangDanKebutuhanKhusus}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Jenis Pengetahuan Materi
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {data.identifikasi.jenisPengetahuanMateri}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Relevansi Materi dengan Kehidupan Nyata / Dunia Kerja AKL
                        </td>
                        <td className="p-2.5 text-slate-800 leading-relaxed">
                          {data.identifikasi.relevansiKehidupanNyata}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Profil Lulusan */}
                {data.kustomisasi.tampilkanProfilLulusan && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <span className="font-bold text-slate-800 block mb-2">
                      Dimensi Profil Lulusan yang Ditargetkan:
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
                          <div
                            key={dim.key}
                            className={`flex items-center space-x-1.5 p-1.5 rounded-lg border ${
                              isChecked
                                ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-xs">{isChecked ? '☑' : '☐'}</span>
                            <span className="text-[11px]">{dim.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    {data.identifikasi.dimensiProfilLulusanCatatan && (
                      <p className="mt-2 text-[11px] text-slate-600 italic">
                        <strong>Integrasi Aktivitas:</strong>{' '}
                        {data.identifikasi.dimensiProfilLulusanCatatan}
                      </p>
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
                            className="w-full p-1 border rounded"
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
                          {data.desainPembelajaran.lintasDisiplinIlmu}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Tujuan Pembelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        <ol className="list-decimal pl-4 space-y-1">
                          {data.desainPembelajaran.tujuanPembelajaran.map((tp, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {tp}
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Topik Pembelajaran Kontekstual
                      </td>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {data.desainPembelajaran.topikPembelajaranKontekstual}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Praktik Pedagogis (Model)
                      </td>
                      <td className="p-2.5 text-slate-800 font-semibold text-blue-900">
                        {data.desainPembelajaran.praktikPedagogis}
                      </td>
                    </tr>
                    {data.kustomisasi.tampilkanKemitraanDudi && (
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Kemitraan Pembelajaran (DUDI / Industri)
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {data.desainPembelajaran.kemitraanPembelajaran}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                        Lingkungan Pembelajaran
                      </td>
                      <td className="p-2.5 text-slate-800">
                        {data.desainPembelajaran.lingkunganPembelajaran}
                      </td>
                    </tr>
                    {data.kustomisasi.tampilkanPemanfaatanDigital && (
                      <tr>
                        <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                          Pemanfaatan Digital (Software Akuntansi)
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {data.desainPembelajaran.pemanfaatanDigital}
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
                {data.pengalamanBelajar.map((m) => (
                  <div key={m.pertemuanKe} className="avoid-break">
                    <div className="bg-blue-50/70 border border-blue-200 px-3 py-2 rounded-t-xl flex justify-between items-center">
                      <span className="font-bold text-xs text-blue-900">
                        Pertemuan ke-{m.pertemuanKe} ({m.alokasiWaktu})
                      </span>
                      <span className="text-[11px] font-medium text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        Fokus: {m.fokusMateri}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-300 border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-300">
                            <th className="p-2.5 w-1/4 border-r border-slate-300">Tahap Pembelajaran</th>
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
                              {m.tahapAwal.salamDoaPresensi}
                            </td>
                            <td
                              rowSpan={3}
                              className="p-2.5 text-center font-bold text-slate-600 bg-slate-50/50 align-top"
                            >
                              {m.tahapAwal.alokasiWaktuMenit} mnt
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Awal: Apersepsi & Pertanyaan Pemantik
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top font-medium text-indigo-900">
                              {m.tahapAwal.apersepsiDanPemantik}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Awal: Penyampaian Tujuan & Ice Breaking
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {m.tahapAwal.penyampaianTujuanIceBreaking}
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
                              {m.tahapInti.memahami}
                            </td>
                            <td
                              rowSpan={3}
                              className="p-2.5 text-center font-bold text-slate-700 bg-blue-50/50 align-top"
                            >
                              {m.tahapInti.alokasiWaktuMenit} mnt
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200 bg-blue-50/30">
                            <td className="p-2.5 font-bold text-blue-900 border-r border-slate-200 align-top">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] mb-1">
                                Praktik AKL
                              </span>
                              <br />
                              Inti: Mengaplikasi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top leading-relaxed font-serif">
                              {m.tahapInti.mengaplikasi}
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
                              {m.tahapInti.merefleksi}
                            </td>
                          </tr>

                          {/* Penutup */}
                          <tr className="border-b border-slate-200">
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Penutup: Kesimpulan & Refleksi
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {m.tahapPenutup.kesimpulanDanRefleksi}
                            </td>
                            <td
                              rowSpan={2}
                              className="p-2.5 text-center font-bold text-slate-600 bg-slate-50/50 align-top"
                            >
                              {m.tahapPenutup.alokasiWaktuMenit} mnt
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200 align-top">
                              Penutup: Umpan Balik & Doa
                            </td>
                            <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                              {m.tahapPenutup.umpanBalikTindakLanjutDoa}
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
                      <th className="p-2.5 w-7/12 border-r border-slate-300">Teknik dan Instrumen</th>
                      <th className="p-2.5 w-1/6 text-center">Waktu Pelaksanaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200">
                        Asesmen Awal (Diagnostik)
                      </td>
                      <td className="p-2.5 text-slate-800 border-r border-slate-200">
                        {data.asesmenPembelajaran.asesmenAwal.teknikDanInstrumen}
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-medium">
                        {data.asesmenPembelajaran.asesmenAwal.waktuPelaksanaan}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200">
                        Asesmen Proses (Formatif)
                      </td>
                      <td className="p-2.5 text-slate-800 border-r border-slate-200">
                        {data.asesmenPembelajaran.asesmenProses.teknikDanInstrumen}
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-medium">
                        {data.asesmenPembelajaran.asesmenProses.waktuPelaksanaan}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold bg-slate-50 text-slate-700 border-r border-slate-200">
                        Asesmen Akhir (Sumatif)
                      </td>
                      <td className="p-2.5 text-slate-800 border-r border-slate-200">
                        {data.asesmenPembelajaran.asesmenAkhir.teknikDanInstrumen}
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-medium">
                        {data.asesmenPembelajaran.asesmenAkhir.waktuPelaksanaan}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rubrik Penilaian 4 Tingkat */}
              {data.kustomisasi.tampilkanRubrikLengkap && (
                <div className="avoid-break mt-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    Rubrik Penilaian Kompetensi Akuntansi:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-left border-b border-slate-300">
                          <th className="p-2.5 w-1/4 border-r border-slate-300 font-bold">
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
                        </tr>
                      </thead>
                      <tbody>
                        {data.asesmenPembelajaran.rubrikPenilaian.map((rubrik, idx) => (
                          <tr key={idx} className="border-b border-slate-200 align-top">
                            <td className="p-2.5 font-bold text-slate-800 bg-slate-50 border-r border-slate-200">
                              {rubrik.kriteria}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {rubrik.sangatBaik}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {rubrik.baik}
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 leading-relaxed">
                              {rubrik.cukup}
                            </td>
                            <td className="p-2 text-slate-700 leading-relaxed">
                              {rubrik.perluBimbingan}
                            </td>
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
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                      {data.lampiran.lkpd.judul}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Mata Pelajaran: {data.identitas.mataPelajaran} • Program Keahlian AKL
                    </p>
                  </div>

                  {/* Petunjuk Pengerjaan */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Petunjuk Pengerjaan:
                    </span>
                    <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
                      {data.lampiran.lkpd.petunjukPengerjaan.map((petunjuk, i) => (
                        <li key={i}>{petunjuk}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Dokumen Kasus Transaksi Riil */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Dokumen Bukti Transaksi Akuntansi (Kasus Nyata):
                    </span>
                    <div className="p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-xs">
                      {data.lampiran.lkpd.kasusTransaksi}
                    </div>
                  </div>

                  {/* Format Kolom Pengerjaan LKPD */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Format Kertas Kerja Siswa:
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border border-slate-400 border-collapse bg-white">
                        <thead>
                          <tr className="bg-slate-200 text-slate-800">
                            {data.lampiran.lkpd.tabelPengerjaan?.judulKolom?.map((col, idx) => (
                              <th
                                key={idx}
                                className="p-2 border border-slate-400 font-bold text-center"
                              >
                                {col}
                              </th>
                            ))}
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
                                  className="p-2 border border-slate-400 text-slate-700 h-8"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Soal Analisis Kritis */}
                  {data.lampiran.lkpd.soalAnalisis?.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        Pertanyaan Analisis & Penalaran Kritis:
                      </span>
                      <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
                        {data.lampiran.lkpd.soalAnalisis.map((soal, i) => (
                          <li key={i}>{soal}</li>
                        ))}
                      </ol>
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
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {data.lampiran.bahanBacaanMateri}
                  </div>
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
                            {data.lampiran.diferensiasi.konten}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                            Diferensiasi Proses
                          </td>
                          <td className="p-2.5 text-slate-800 leading-relaxed">
                            {data.lampiran.diferensiasi.proses}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50 text-slate-700">
                            Diferensiasi Produk
                          </td>
                          <td className="p-2.5 text-slate-800 leading-relaxed">
                            {data.lampiran.diferensiasi.produk}
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
            <div className="grid grid-cols-2 gap-8 text-xs text-slate-800">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pengesahan.namaKepalaSekolah}</p>
                <p className="text-[11px] text-slate-600">NIP. {data.pengesahan.nipKepalaSekolah}</p>
              </div>

              <div>
                <p>{data.pengesahan.tempatTitimangsa}</p>
                <p className="font-semibold">Guru Mata Pelajaran</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">{data.pengesahan.namaGuru}</p>
                <p className="text-[11px] text-slate-600">NIP. {data.pengesahan.nipGuru}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
