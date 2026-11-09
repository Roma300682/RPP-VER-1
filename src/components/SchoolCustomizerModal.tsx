import React, { useState } from 'react';
import { X, Building2, Sliders, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { IdentitasSekolah, KustomisasiFitur } from '../types/rpp';
import { DEFAULT_IDENTITAS_SEKOLAH, DEFAULT_KUSTOMISASI } from '../data/aklPresets';

interface SchoolCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  identitas: IdentitasSekolah;
  kustomisasi: KustomisasiFitur;
  onSave: (identitas: IdentitasSekolah, kustomisasi: KustomisasiFitur) => void;
}

export const SchoolCustomizerModal: React.FC<SchoolCustomizerModalProps> = ({
  isOpen,
  onClose,
  identitas,
  kustomisasi,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'identitas' | 'komponen'>('identitas');
  const [formIdentitas, setFormIdentitas] = useState<IdentitasSekolah>({ ...identitas });
  const [formKustom, setFormKustom] = useState<KustomisasiFitur>({ ...kustomisasi });

  if (!isOpen) return null;

  const handleReset = () => {
    setFormIdentitas({ ...DEFAULT_IDENTITAS_SEKOLAH });
    setFormKustom({ ...DEFAULT_KUSTOMISASI });
  };

  const handleSave = () => {
    onSave(formIdentitas, formKustom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Kustomisasi Format & Identitas Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Sesuaikan kop surat, pejabat pengesahan, dan komponen modul ajar
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white">
          <button
            onClick={() => setActiveTab('identitas')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'identitas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Identitas Sekolah & Pengesahan</span>
          </button>
          <button
            onClick={() => setActiveTab('komponen')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'komponen'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kustomisasi Komponen RPP</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'identitas' ? (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Satuan Pendidikan (SMK)
                </label>
                <input
                  type="text"
                  value={formIdentitas.namaSekolah}
                  onChange={(e) => setFormIdentitas({ ...formIdentitas, namaSekolah: e.target.value })}
                  placeholder="Contoh: SMK Negeri 1 Jakarta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Kop Surat Sekolah (Digunakan saat Ekspor Word & Cetak)
                </label>
                <textarea
                  rows={3}
                  value={formIdentitas.kopSuratText || ''}
                  onChange={(e) => setFormIdentitas({ ...formIdentitas, kopSuratText: e.target.value })}
                  placeholder="PEMERINTAH DAERAH..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Guru Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.namaGuru}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, namaGuru: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP / NUPTK Guru
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.nipGuru}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, nipGuru: e.target.value })}
                    placeholder="19890514 201503 1 002"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.namaKepalaSekolah}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, namaKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.nipKepalaSekolah}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, nipKepalaSekolah: e.target.value })}
                    placeholder="19730211 199802 1 001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.tahunPelajaran}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, tahunPelajaran: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tempat & Tanggal Pengesahan
                  </label>
                  <input
                    type="text"
                    value={formIdentitas.tempatTitimangsa}
                    onChange={(e) => setFormIdentitas({ ...formIdentitas, tempatTitimangsa: e.target.value })}
                    placeholder="Jakarta, 14 Juli 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Aktifkan atau nonaktifkan bagian dokumen RPP sesuai format resmi kurikulum operasional satuan pendidikan (KOSP) sekolah Anda:
              </p>

              {[
                {
                  id: 'tampilkanIdentifikasi',
                  label: 'Bagian 2: Identifikasi Pembelajaran Mendalam',
                  desc: 'Kesiapan belajar murid, gaya belajar, jenis pengetahuan faktual/konseptual/prosedural.',
                },
                {
                  id: 'tampilkanProfilLulusan',
                  label: 'Dimensi Profil Lulusan (8 Dimensi)',
                  desc: 'Penalaran kritis, kolaborasi, kemandirian, komunikasi, dsb.',
                },
                {
                  id: 'tampilkanKemitraanDudi',
                  label: 'Kemitraan Pembelajaran (DUDI / KAP / Bank)',
                  desc: 'Keterlibatan dunia kerja akuntansi dan praktisi mengajar.',
                },
                {
                  id: 'tampilkanLintasDisiplin',
                  label: 'Lintas Disiplin Ilmu',
                  desc: 'Kaitan materi dengan Matematika Keuangan, Informatika/TIK, dan Ekonomi.',
                },
                {
                  id: 'tampilkanPemanfaatanDigital',
                  label: 'Pemanfaatan Alat Digital Akuntansi',
                  desc: 'Aplikasi Spreadsheet (Excel), MYOB, Accurate, atau Zahir Accounting.',
                },
                {
                  id: 'tampilkanRubrikLengkap',
                  label: 'Rubrik Penilaian 4 Tingkat',
                  desc: 'Tabel deskripsi skala 4 (Sangat Baik) hingga 1 (Perlu Bimbingan).',
                },
                {
                  id: 'tampilkanLKPD',
                  label: 'Lampiran LKPD (Studi Kasus Transaksi Riil)',
                  desc: 'Lembar kerja siswa dengan format bukti dokumen transaksi akuntansi.',
                },
                {
                  id: 'tampilkanBahanBacaan',
                  label: 'Lampiran Bahan Bacaan & Rangkuman Materi',
                  desc: 'Rangkuman teori dan prosedur untuk pegangan guru dan murid.',
                },
                {
                  id: 'tampilkanDiferensiasi',
                  label: 'Rencana Pembelajaran Berdiferensiasi',
                  desc: 'Strategi diferensiasi konten, proses, dan produk.',
                },
                {
                  id: 'tampilkanPengesahan',
                  label: 'Kolom Tanda Tangan & Pengesahan',
                  desc: 'Tanda tangan Kepala Sekolah dan Guru Mata Pelajaran berserta NIP.',
                },
              ].map((item) => {
                const key = item.id as keyof KustomisasiFitur;
                const isChecked = formKustom[key];
                return (
                  <label
                    key={item.id}
                    className="flex items-start p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setFormKustom({ ...formKustom, [key]: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 text-xs">
                      <span className="font-bold text-slate-800 block">{item.label}</span>
                      <span className="text-slate-500">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Atur Ulang Default</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Kustomisasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
