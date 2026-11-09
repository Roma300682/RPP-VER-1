import { FaseAKL, MapelAKL, IdentitasSekolah, KustomisasiFitur, KelompokMapel } from '../types/rpp';

export interface AKLPresetMaterial {
  id: string;
  judul: string;
  mapel: MapelAKL;
  fase: FaseAKL;
  kelompok: KelompokMapel;
  topik: string;
  deskripsiSingkat: string;
  bahanAjar: string;
}

export const DEFAULT_IDENTITAS_SEKOLAH: IdentitasSekolah = {
  namaSekolah: 'SMK Negeri 1 Akuntansi & Bisnis Mandiri',
  namaGuru: 'Robi Saiful Romadona, S.Pd., Gr.',
  nipGuru: '19890514 201503 1 002',
  namaKepalaSekolah: 'Drs. H. Mulyadi, M.M.',
  nipKepalaSekolah: '19730211 199802 1 001',
  tahunPelajaran: '2026/2027',
  tempatTitimangsa: 'Jakarta, 14 Juli 2026',
  kopSuratText: 'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA\nDINAS PENDIDIKAN\nSEKOLAH MENENGAH KEJURUAN NEGERI 1 AKUNTANSI\nJl. Pendidikan Kejuruan No. 45, Jakarta Selatan | Telp: (021) 7890123',
};

export const DEFAULT_KUSTOMISASI: KustomisasiFitur = {
  tampilkanIdentifikasi: true,
  tampilkanProfilLulusan: true,
  tampilkanKemitraanDudi: true,
  tampilkanLintasDisiplin: true,
  tampilkanPemanfaatanDigital: true,
  tampilkanRubrikLengkap: true,
  tampilkanLKPD: true,
  tampilkanBahanBacaan: true,
  tampilkanDiferensiasi: true,
  tampilkanPengesahan: true,
};

export const MAPEL_KEJURUAN_OPTIONS: { [key in FaseAKL]: string[] } = {
  'Fase E (Kelas X)': [
    'Dasar-dasar Program Keahlian Akuntansi dan Keuangan Lembaga',
  ],
  'Fase F (Kelas XI)': [
    'Akuntansi Keuangan',
    'Praktikum Akuntansi Perusahaan Jasa, Dagang dan Manufaktur',
    'Praktikum Akuntansi Lembaga / Instansi Pemerintah',
    'Komputer Akuntansi (MYOB / Accurate / Spreadsheet)',
    'Administrasi Pajak',
    'Projek Kreatif dan Kewirausahaan (PKK) Akuntansi / TeFa',
  ],
  'Fase F (Kelas XII)': [
    'Praktikum Akuntansi Perusahaan Jasa, Dagang dan Manufaktur',
    'Akuntansi Keuangan',
    'Komputer Akuntansi (MYOB / Accurate / Spreadsheet)',
    'Administrasi Pajak',
    'Projek Kreatif dan Kewirausahaan (PKK) Akuntansi / TeFa',
    'Praktikum Akuntansi Lembaga / Instansi Pemerintah',
  ],
};

export const MAPEL_UMUM_ADAPTIF: string[] = [
  'Matematika (Kejuruan/Umum)',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Informatika',
  'Projek IPAS (Ilmu Pengetahuan Alam dan Sosial)',
  'Pendidikan Pancasila',
  'Pendidikan Agama dan Budi Pekerti',
  'Sejarah',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Seni Budaya',
  'Muatan Lokal (Bahasa Daerah)',
];

export const MAPEL_PILIHAN_SMK: string[] = [
  'Akuntansi Syariah & Lembaga Keuangan Mikro',
  'Auditing Dasar & Pemeriksaan Akuntansi',
  'Manajemen Perpajakan Digital & e-Faktur',
  'Analisis Laporan Keuangan & Investasi Pasar Modal',
  'Perbankan Syariah & Bank Mini Sekolah',
  'Aplikasi Spreadsheet Lanjutan & Pemodelan Finansial',
  'Data Analytics untuk Bisnis & Akuntansi',
  'Komunikasi Bisnis & Digital Marketing',
  'Bahasa Asing Pilihan (Bahasa Jepang / Mandarin / Arab Bisnis)',
];

// Backward-compatible alias
export const MAPEL_OPTIONS = MAPEL_KEJURUAN_OPTIONS;

export const PRESET_MATERIALS: AKLPresetMaterial[] = [
  // 1. Kejuruan: Kas Kecil
  {
    id: 'kas-kecil',
    judul: 'Pengelolaan Kas Kecil (Metode Imprest & Fluktuasi)',
    mapel: 'Akuntansi Keuangan',
    fase: 'Fase F (Kelas XI)',
    kelompok: 'kejuruan',
    topik: 'Pengelolaan dan Pencatatan Dana Kas Kecil Perusahaan Dagang',
    deskripsiSingkat: 'Pencatatan pembentukan, pengeluaran, dan pengisian kembali dana kas kecil dengan metode imprest (dana tetap) dan fluktuasi.',
    bahanAjar: `MATERI AJAR: PENGELOLAAN DANA KAS KECIL (PETTY CASH FUND)
Kompetensi: Mengelola dan membukukan mutasi dana kas kecil menggunakan metode dana tetap (imprest fund system) dan metode dana tidak tetap (fluctuation fund system).

A. PENGERTIAN DAN TUJUAN KAS KECIL
Kas kecil adalah sejumlah dana tunai yang dibentuk khusus untuk membiayai pengeluaran operasional perusahaan yang bernilai relatif kecil dan tidak efektif jika dibayar menggunakan cek (misal pembelian materai, ATK, konsumsi rapat, ongkos taksi/kurir).

B. PROSEDUR PENGELOLAAN KAS KECIL
1. Pembentukan Dana Kas Kecil: Bendahara umum mengeluarkan cek sebesar estimasi pengeluaran kas kecil (misal Rp 2.000.000).
2. Pemakaian Dana: Setiap pengeluaran disertai Bukti Pengeluaran Kas Kecil (BPKK) dan nota/kuitansi fisik.
3. Pengisian Kembali: Dilakukan saat saldo fisik menipis dengan mengajukan Surat Permintaan Pengisian Kembali Kas Kecil (SPP-KK) disertai bukti asli pengeluaran.

C. METODE PENCATATAN KAS KECIL
1. METODE DANA TETAP (IMPREST FUND SYSTEM):
- Pembentukan: Kas Kecil (D) vs Kas di Bank (K).
- Saat Pengeluaran kas kecil: TIDAK DIJURNAL, kasir kas kecil hanya mengumpulkan bukti transaksi fisik.
- Saat Pengisian Kembali: Akun beban yang telah dikeluarkan didebit (Beban ATK (D), Beban Transportasi (D)) vs Kas di Bank (K). Saldo akun kas kecil di buku besar selalu bernilai tetap.
- Akhir periode: Jika terdapat pengeluaran yang belum diisi kembali, wajib dibuat Jurnal Penyesuaian: Beban-beban (D) vs Kas Kecil (K).

2. METODE DANA FLUKTUASI (FLUCTUATION SYSTEM):
- Pembentukan: Kas Kecil (D) vs Kas di Bank (K).
- Saat Pengeluaran: LANGSUNG DIJURNAL: Beban... (D) vs Kas Kecil (K).
- Saat Pengisian Kembali: Kas Kecil (D) vs Kas di Bank (K). Saldo buku besar kas kecil selalu fluktuatif.`,
  },

  // 2. Kejuruan: Jurnal Penyesuaian
  {
    id: 'jurnal-penyesuaian-dagang',
    judul: 'Jurnal Penyesuaian Perusahaan Dagang (Ikhtisar L/R & HPP)',
    mapel: 'Praktikum Akuntansi Perusahaan Jasa, Dagang dan Manufaktur',
    fase: 'Fase F (Kelas XI)',
    kelompok: 'kejuruan',
    topik: 'Penyusunan Jurnal Penyesuaian Akun Persediaan Barang Dagang & Beban Akrual',
    deskripsiSingkat: 'Penyesuaian persediaan barang dagang metode Ikhtisar Laba/Rugi vs HPP serta perlengkapan dan penyusutan.',
    bahanAjar: `MATERI AJAR: JURNAL PENYESUAIAN PERUSAHAAN DAGANG
Elemen: Akuntansi Perusahaan Dagang
Capaian Pembelajaran: Peserta didik mampu menganalisis transaksi penyesuaian dan mencatatnya ke dalam jurnal penyesuaian pada siklus akuntansi perusahaan dagang.

A. URGENSI JURNAL PENYESUAIAN
Jurnal penyesuaian disusun pada akhir periode akuntansi untuk memutakhirkan saldo akun buku besar agar mencerminkan kondisi riil harta, kewajiban, pendapatan, dan beban berdasarkan prinsip akrual basis (accrual basis).

B. PENYESUAIAN PERSEDIAAN BARANG DAGANG (PBD)
1. PENDEKATAN IKHTISAR LABA/RUGI:
- Menghapus persediaan awal: Ikhtisar L/R (D) vs Persediaan Barang Dagang (K)
- Mencatat persediaan akhir: Persediaan Barang Dagang (D) vs Ikhtisar L/R (K)
2. PENDEKATAN HARGA POKOK PENJUALAN (HPP):
Komponen pembentuk HPP: Persediaan Awal, Pembelian, Beban Angkut Pembelian, Retur Pembelian, Potongan Pembelian, dan Persediaan Akhir.`,
  },

  // 3. Kejuruan: Persamaan Dasar Akuntansi (Fase E)
  {
    id: 'persamaan-dasar-akuntansi',
    judul: 'Persamaan Dasar Akuntansi & Analisis Bukti Transaksi',
    mapel: 'Dasar-dasar Program Keahlian Akuntansi dan Keuangan Lembaga',
    fase: 'Fase E (Kelas X)',
    kelompok: 'kejuruan',
    topik: 'Analisis Bukti Transaksi dan Pencatatan Persamaan Dasar Akuntansi (H = U + M)',
    deskripsiSingkat: 'Konsep dasar akuntansi, analisis debit-kredit, dokumen sumber, dan tabel persamaan dasar akuntansi.',
    bahanAjar: `MATERI AJAR: ANALISIS TRANSAKSI & PERSAMAAN DASAR AKUNTANSI
Fase: E (Kelas X SMK AKL)
Elemen: Prinsip Dasar Akuntansi dan Perbankan Dasar

A. KONSEP PERSAMAAN DASAR AKUNTANSI
Rumus Baku:
ASET (HARTA) = LIABILITAS (KEWAJIBAN/UTANG) + EKUITAS (MODAL)
Aset = Liabilitas + Modal Awal + Pendapatan - Beban - Prive

B. PENGARUH TRANSAKSI TERHADAP POSISI KEUANGAN
1. Investasi modal tunai: Kas (+) dan Modal (+).
2. Pembelian perlengkapan tunai: Kas (-) dan Perlengkapan (+).
3. Pembelian peralatan kredit: Peralatan (+) dan Utang Usaha (+).
4. Penerimaan pendapatan jasa: Kas (+) dan Pendapatan/Modal (+).
5. Pembayaran beban operasional: Kas (-) dan Modal (-).`,
  },

  // 4. Mata Pelajaran Pilihan: Auditing Dasar
  {
    id: 'auditing-dasar',
    judul: 'Auditing Dasar: Pemeriksaan Kas (Cash Opname) & Vouching Dokumen',
    mapel: 'Auditing Dasar & Pemeriksaan Akuntansi',
    fase: 'Fase F (Kelas XI)',
    kelompok: 'pilihan',
    topik: 'Prosedur Pemeriksaan Fisik Kas (Cash Opname) dan Vouching Dokumen Transaksi Keuangan',
    deskripsiSingkat: 'Mata pelajaran pilihan kejuruan akuntansi: Prosedur audit fisik kas, berita acara cash count, dan pengujian keabsahan bukti pengeluaran kas.',
    bahanAjar: `MATERI AJAR: AUDITING DASAR & ASURANS
Mata Pelajaran: Pilihan Konsentrasi Keahlian (Auditing Dasar)
Fase: F SMK AKL

A. PENGERTIAN DAN TUJUAN AUDIT KAS
Pemeriksaan kas (audit of cash) bertujuan untuk memverifikasi asersi keberadaan (existence), kelengkapan (completeness), dan pisah batas (cutoff) atas saldo kas dan setara kas yang disajikan entitas.

B. PROSEDUR CASH OPNAME (PERHITUNGAN FISIK KAS)
1. Perhitungan fisik dilakukan secara mendadak (surprise audit) bersama pemegang kas kecil (petty cashier) dan disaksikan oleh supervisor.
2. Seluruh uang tunai (kertas dan logam) dihitung dan dikelompokkan berdasarkan pecahan nominal.
3. Seluruh bon/nota pengeluaran sementara (IOU voucher) diperiksa tanggal dan otorisasi pejabat yang berwenang.
4. Hasil perhitungan dicatat dalam Berita Acara Perhitungan Kas Fisik (Cash Count Sheet) dan ditandatangani bersama.
5. Bila terdapat selisih kas (selisih lebih/cash overage atau selisih kurang/cash shortage), auditor menelusuri dokumen transaksi terkait untuk jurnal koreksi penyesuaian.`,
  },

  // 5. Mata Pelajaran Pilihan: Akuntansi Syariah
  {
    id: 'akuntansi-syariah',
    judul: 'Akuntansi Syariah: Akad Murabahah pada Lembaga Keuangan',
    mapel: 'Akuntansi Syariah & Lembaga Keuangan Mikro',
    fase: 'Fase F (Kelas XII)',
    kelompok: 'pilihan',
    topik: 'Pencatatan Transaksi Jual Beli Akad Murabahah Sesuai PSAK 102',
    deskripsiSingkat: 'Mata pelajaran pilihan: Prinsip jual beli murabahah, pengakuan keuntungan tangguhan, dan pencatatan angsuran piutang murabahah.',
    bahanAjar: `MATERI AJAR: AKUNTANSI SYARIAH
Mata Pelajaran: Pilihan Konsentrasi Keahlian
Fase: F SMK AKL

A. DEFINISI DAN KETENTUAN AKAD MURABAHAH
Murabahah adalah akad jual beli barang dengan menyatakan harga perolehan dan keuntungan (margin) yang disepakati oleh penjual dan pembeli.
Landasan: Fatwa DSN-MUI dan PSAK 102 Akuntansi Murabahah.

B. PRINSIP PENGAKUAN DAN PENGUKURAN
1. Pengadaan Barang Murabahah:
   Persediaan Murabahah (D) vs Kas/Utang (K) [sebesar harga perolehan].
2. Penjualan kepada Nasabah (secara kredit/angsuran):
   Piutang Murabahah (D) [sebesar harga jual = pokok + margin]
     Persediaan Murabahah (K) [harga perolehan pokok]
     Pendapatan Margin Murabahah Tangguhan (K) [margin laba]
3. Saat Pembayaran Angsuran oleh Nasabah:
   Kas/Rekening Nasabah (D) vs Piutang Murabahah (K)
   Pendapatan Margin Murabahah Tangguhan (D) vs Pendapatan Margin Murabahah (K).`,
  },

  // 6. Mata Pelajaran Umum / Adaptif: Matematika Kejuruan
  {
    id: 'matematika-bunga-keuangan',
    judul: 'Matematika: Bunga Tunggal, Bunga Majemuk & Anuitas Perbankan',
    mapel: 'Matematika (Kejuruan/Umum)',
    fase: 'Fase F (Kelas XI)',
    kelompok: 'umum_adaptif',
    topik: 'Penerapan Konsep Bunga Tunggal, Bunga Majemuk, dan Sistem Anuitas Pinjaman',
    deskripsiSingkat: 'Mata pelajaran umum/adaptif: Perhitungan suku bunga simpanan dan tabel pelunasan anuitas angsuran kredit bank.',
    bahanAjar: `MATERI AJAR: MATEMATIKA KEUANGAN (MAPEL ADAPTIF / UMUM)
Elemen: Bilangan dan Aljabar Keuangan
Fase: F SMK

A. BUNGA TUNGGAL (SIMPLE INTEREST)
Bunga yang dihitung berdasarkan modal awal saja:
Rumus: I = M x i x t
Nilai Akhir: Mn = M(1 + i x t)

B. BUNGA MAJEMUK (COMPOUND INTEREST)
Bunga yang dihitung dari saldo akhir setiap periode (bunga berbunga):
Rumus: Mn = M(1 + i)^n

C. ANUITAS PINJAMAN (ANNUITY)
Anuitas adalah sejumlah pembayaran yang sama besarnya yang dibayarkan pada setiap interval waktu tertentu:
Anuitas (A) = Angsuran Pokok (an) + Bunga (bn)
Tabel Rencana Pelunasan Anuitas memuat: Periode, Saldo Pinjaman Awal, Anuitas (Bunga + Angsuran), dan Saldo Pinjaman Akhir.`,
  },

  // 7. Mata Pelajaran Umum / Adaptif: Informatika
  {
    id: 'informatika-analisis-data',
    judul: 'Informatika: Analisis Data Finansial & Pemodelan Spreadsheet',
    mapel: 'Informatika',
    fase: 'Fase E (Kelas X)',
    kelompok: 'umum_adaptif',
    topik: 'Pengolahan dan Visualisasi Data Transaksi Menggunakan Fungsi Logika dan Lookup',
    deskripsiSingkat: 'Mata pelajaran umum/adaptif: Formula VLOOKUP, XLOOKUP, IF nested, dan Pivot Table untuk pemodelan data bisnis.',
    bahanAjar: `MATERI AJAR: INFORMATIKA SMK (ANALISIS DATA)
Elemen: Analisis Data (AD)
Fase: E (Kelas X SMK)

A. PENGELOLAAN DATA TRANSAKSI
Data transaksi keuangan mentah dalam volume besar memerlukan pemrosesan otomatis agar dapat disajikan sebagai informasi pendukung keputusan manajerial.

B. FUNGSI LOGIKA DAN PENCARIAN
1. Fungsi IF Bertingkat (Nested IF): Untuk menentukan kategori diskon atau batas kredit pelanggan berdasarkan kriteria tertentu.
2. VLOOKUP & XLOOKUP: Menghubungkan tabel transaksi dengan tabel master harga barang atau daftar pelanggan.
3. SUMIFS & COUNTIFS: Menghitung total omzet berdasarkan kriteria cabang atau rentang tanggal tertentu.
4. Pivot Table: Membuat rangkuman dinamis mutasi kas dan penjualan dalam hitungan detik.`,
  },

  // 8. Mata Pelajaran Umum / Adaptif: Pendidikan Pancasila
  {
    id: 'pancasila-integritas-keuangan',
    judul: 'Pendidikan Pancasila: Integritas & Budaya Anti-Korupsi',
    mapel: 'Pendidikan Pancasila',
    fase: 'Fase E (Kelas X)',
    kelompok: 'umum_adaptif',
    topik: 'Penerapan Nilai Kejujuran, Transparansi, dan Akuntabilitas dalam Pengelolaan Keuangan',
    deskripsiSingkat: 'Mata pelajaran umum: Implementasi nilai Sila ke-5 Keadilan Sosial dan etika profesi anti-fraud bagi calon akuntan.',
    bahanAjar: `MATERI AJAR: PENDIDIKAN PANCASILA
Elemen: Pancasila dan Undang-Undang Dasar NRI Tahun 1945
Fase: E SMK

A. PANCASILA SEBAGAI MEJA STATIS DAN LEITSTAR DINAMIS
Nilai-nilai luhur Pancasila menjadi kompas moral bagi setiap warga negara, khususnya calon praktisi akuntansi dan pengelola keuangan publik.

B. INTEGRITAS DAN BUDAYA ANTI-KORUPSI
1. Nilai Kejujuran (Sila Ke-1 & Ke-2): Menyajikan bukti transaksi apa adanya tanpa manipulasi angka (window dressing).
2. Tanggung Jawab & Akuntabilitas (Sila Ke-5): Setiap rupiah dana publik atau perusahaan harus dapat dipertanggungjawabkan secara transparan.
3. Peran Auditor dan Akuntan Muda dalam Pencegahan Fraud: Menjaga objektivitas, independensi mental, dan berani menolak perintah yang bertentangan dengan hukum dan etika moral.`,
  },
];
