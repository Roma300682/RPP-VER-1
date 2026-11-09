import React from 'react';
import { X, HelpCircle, BookOpen, CheckCircle2, Award, Building2, Lightbulb } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Panduan Penyusunan Modul Ajar SMK AKL
              </h2>
              <p className="text-xs text-slate-500">
                Format Kurikulum Merdeka & Pendekatan Pembelajaran Mendalam (Deep Learning)
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Prinsip Pembelajaran Mendalam (Deep Learning)</span>
            </div>
            <p className="mb-2">
              Format ini dirancang khusus untuk memandu guru SMK menyusun pembelajaran kejuruan yang:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Berkesadaran (Mindful):</strong> Murid sadar akan tujuan belajar, memahami mengapa mereka perlu menguasai prosedur pembukuan tertentu.
              </li>
              <li>
                <strong>Bermakna (Meaningful):</strong> Materi selalu dikaitkan dengan kasus transaksi riil di dunia kerja, KAP, perbankan, dan UMKM.
              </li>
              <li>
                <strong>Menggembirakan (Joyful):</strong> Pembelajaran diisi simulasi interaktif, tantangan kelompok, dan penggunaan aplikasi digital modern.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>8 Dimensi Profil Lulusan yang Ditargetkan</span>
            </h3>
            <p className="mb-2 text-slate-600">
              Sesuai format resmi Pembelajaran Mendalam, guru dapat menargetkan dimensi karakter berikut:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {[
                '1. Keimanan & Ketakwaan',
                '2. Kewargaan',
                '3. Penalaran Kritis',
                '4. Kreativitas',
                '5. Kolaborasi',
                '6. Kemandirian',
                '7. Kesehatan',
                '8. Komunikasi',
              ].map((dim, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                  {dim}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Struktur Mata Pelajaran SMK */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Kelompok Mata Pelajaran yang Didukung</span>
            </h3>
            <div className="space-y-2">
              <div className="p-3 border border-slate-200 rounded-xl bg-blue-50/30">
                <span className="font-bold text-blue-900 block mb-1">💼 1. Kejuruan AKL (Fase E & F)</span>
                <p className="text-slate-600">
                  Dasar Program Keahlian AKL (Fase E), Akuntansi Keuangan, Praktikum Akuntansi Perusahaan Jasa/Dagang/Manufaktur, Akuntansi Lembaga/Instansi Pemerintah, Komputer Akuntansi (MYOB/Accurate), Administrasi Pajak, dan PKK TeFa (Fase F).
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-emerald-50/30">
                <span className="font-bold text-emerald-900 block mb-1">📚 2. Umum / Adaptif (Semua Jenjang SMK)</span>
                <p className="text-slate-600">
                  Matematika Kejuruan, Bahasa Indonesia, Bahasa Inggris Bisnis, Informatika & Analisis Data, Projek IPAS, Pendidikan Pancasila & Integritas Anti-Korupsi, Sejarah, PJOK, Seni Budaya, dan Muatan Lokal.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-purple-50/30">
                <span className="font-bold text-purple-900 block mb-1">⭐ 3. Mata Pelajaran Pilihan (Fase F SMK)</span>
                <p className="text-slate-600">
                  Auditing Dasar & Pemeriksaan Akuntansi, Akuntansi Syariah & Lembaga Keuangan Mikro, Manajemen Perpajakan Digital & e-Faktur, Analisis Laporan Keuangan & Pasar Modal, Bank Mini Sekolah, Spreadsheet Lanjutan, dan Data Analytics Bisnis (+ Fitur Kustom Input Bebas).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Panduan Menjalankan & Memanggil Aplikasi */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Cara Menjalankan / Mengakses Aplikasi (Running App)</span>
            </h3>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>1. Akses Langsung di Browser / Cloud:</strong>
                <br />
                Aplikasi ini berjalan sebagai Web App interaktif pada port 3000 dan URL Cloud Run. Anda dapat langsung membuka alamat URL aplikasi pada peramban web (Google Chrome, Edge, Safari, Firefox) baik melalui PC, Laptop, maupun Tablet guru.
              </p>
              <p>
                <strong>2. Menjalankan di Komputer Lokal / Server Sekolah:</strong>
                <br />
                Jika Anda ingin menjalankan secara lokal di laptop atau komputer laboratorium sekolah:
              </p>
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] space-y-1">
                <p className="text-slate-400"># 1. Jalankan server pengembang (port 3000):</p>
                <p className="text-emerald-400">npm run dev</p>
                <p className="text-slate-400"># 2. Atau kompilasi untuk produksi:</p>
                <p className="text-emerald-400">npm run build && npm start</p>
              </div>
              <p>
                <strong>3. Dua Mode Pemrosesan Cepat:</strong>
                <br />
                • <strong>⚡ Mode Kilat (&lt; 1 Detik):</strong> Menggunakan engine kurikulum esensial SMK tanpa antrean server AI. Cocok saat guru membutuhkan dokumen cetak cepat.
                <br />
                • <strong>🤖 Mode AI Cerdas (5–10 Detik):</strong> Memanfaatkan model Gemini untuk meracik variasi kasus dan skenario pembelajaran baru.
              </p>
            </div>
          </div>

          {/* Section 5: Fitur Kustomisasi Sekolah */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Fitur Kustomisasi Dokumen Sekolah</span>
            </h3>
            <p className="text-slate-600">
              Setiap sekolah dapat menyesuaikan identitas kop surat, logo, nama kepala sekolah, NIP, serta mengaktifkan/menonaktifkan komponen seperti Rubrik Lengkap, Lampiran LKPD Kasus Transaksi, atau Rencana Diferensiasi agar selaras dengan KOSP (Kurikulum Operasional Satuan Pendidikan) di sekolah masing-masing. Hasil dokumen dapat diunduh langsung dalam format <strong>Microsoft Word (.doc)</strong> dan <strong>Cetak / PDF Resmi</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
