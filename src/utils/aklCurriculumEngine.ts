import { ModulAjarData, GenerateRPPRequest } from '../types/rpp';

export function generateAklFallbackRpp(params: GenerateRPPRequest): ModulAjarData {
  const {
    materiAjarText,
    topik,
    fase,
    mapel,
    model,
    alokasiPertemuan = 2,
    jpPerPertemuan = 4,
    identitasSekolah,
    kustomisasi,
    instruksiKhusus,
  } = params;

  const namaSekolah = identitasSekolah?.namaSekolah || 'SMK Negeri 1 Akuntansi & Bisnis Mandiri';
  const namaGuru = identitasSekolah?.namaGuru || 'Robi Saiful Romadona, S.Pd., Gr.';
  const nipGuru = identitasSekolah?.nipGuru || '19890514 201503 1 002';
  const namaKepalaSekolah = identitasSekolah?.namaKepalaSekolah || 'Drs. H. Mulyadi, M.M.';
  const nipKepalaSekolah = identitasSekolah?.nipKepalaSekolah || '19730211 199802 1 001';
  const tahunPelajaran = identitasSekolah?.tahunPelajaran || '2026/2027';
  const tempatTitimangsa = identitasSekolah?.tempatTitimangsa || 'Jakarta, 14 Juli 2026';

  // Determine subject domain for rich tailored synthesis
  const mapelLower = (mapel || '').toLowerCase();
  const topikLower = (topik || '').toLowerCase();
  const isMatematika = mapelLower.includes('matematika');
  const isInformatika = mapelLower.includes('informatika');
  const isPancasila = mapelLower.includes('pancasila');
  const isBahasa = mapelLower.includes('bahasa');
  const isIpas = mapelLower.includes('ipas') || mapelLower.includes('alam');
  const isAudit = mapelLower.includes('audit');
  const isSyariah = mapelLower.includes('syariah');
  const isPajak = mapelLower.includes('pajak');
  const isUmum = isMatematika || isInformatika || isPancasila || isBahasa || isIpas;

  // Total JP & minutes
  const totalJp = alokasiPertemuan * jpPerPertemuan;
  const totalMenit = totalJp * 45;
  const alokasiText = `${alokasiPertemuan} Pertemuan x ${jpPerPertemuan} JP (${totalMenit} Menit)`;

  // Generate meetings
  const pertemuanList = Array.from({ length: alokasiPertemuan }, (_, i) => {
    const pertemuanKe = i + 1;
    const durasiMenit = jpPerPertemuan * 45;
    const waktuAwal = 15;
    const waktuPenutup = 15;
    const waktuInti = durasiMenit - waktuAwal - waktuPenutup;

    let apersepsi = `Mengaitkan materi ${topik} dengan kasus kontekstual di dunia nyata: "Bagaimana penerapan ${topik} membantu pengambilan keputusan atau pemecahan masalah nyata dalam profesi dan kehidupan sehari-hari?"`;
    let memahami = `Peserta didik menyimak paparan materi kontekstual mengenai ${topik}, menelaah dokumen sumber/studi kasus nyata, dan berdiskusi aktif dalam kelompok untuk mengeksplorasi prinsip-prinsip utama.`;
    let mengaplikasi = `Peserta didik secara kolaboratif mengerjakan lembar kerja praktikum pada kasus ${topik}, melakukan pengolahan data/analisis terstruktur, dan merumuskan solusi pemecahan masalah dengan teliti.`;
    let merefleksi = `Perwakilan kelompok mempresentasikan hasil pengerjaan studi kasus ${topik}, mengonfirmasi kebenaran langkah kerja bersama guru, dan merefleksikan kendala konseptual yang ditemukan.`;

    if (isMatematika) {
      apersepsi = pertemuanKe === 1
        ? `Mengaitkan konsep matematika keuangan dengan kehidupan nyata: "Mengapa perhitungan bunga majemuk atau anuitas sangat krusial saat seseorang mengajukan kredit modal usaha atau menyimpan dana di bank?"`
        : `Meninjau pemodelan aljabar pertemuan sebelumnya: "Bagaimana menyusun tabel pelunasan anuitas agar porsi pokok dan bunga terpetakan secara transparan?"`;
      memahami = 'Peserta didik menelaah formula matematis, mengidentifikasi variabel pokok pinjaman, tingkat suku bunga, dan periode waktu melalui lembar kasus finansial terstruktur.';
      mengaplikasi = `Peserta didik secara kelompok menghitung simulasi angsuran, menyusun tabel anuitas pada kasus ${topik}, dan memverifikasi ketepatan nilai akhir saldo pinjaman.`;
      merefleksi = 'Peserta didik membandingkan efisiensi metode perhitungan manual dengan formula spreadsheet dan mendiskusikan implikasi finansial bagi nasabah.';
    } else if (isInformatika) {
      apersepsi = `Menampilkan visualisasi data transaksi bisnis: "Bagaimana analis data keuangan mengolah puluhan ribu baris transaksi dalam sekejap tanpa kesalahan entri?"`;
      memahami = 'Peserta didik mengeksplorasi fungsi logika (IF, AND, OR), formula lookup (VLOOKUP, XLOOKUP), dan struktur tabel database data transaksi.';
      mengaplikasi = `Peserta didik mempraktikkan langsung pemodelan spreadsheet pada laptop/komputer, mengolah dataset transaksi ${topik}, dan membuat dashboard ringkasan dinamis (Pivot Table).`;
      merefleksi = 'Peserta didik mengevaluasi efektivitas formula yang digunakan, mendiskusikan penanganan error (#N/A, #VALUE!), dan merefleksikan pentingnya validasi data.';
    } else if (isPancasila) {
      apersepsi = `Menghubungkan nilai moral kebangsaan dengan integritas profesi: "Bagaimana nilai kejujuran dan sila ke-5 Keadilan Sosial membentengi calon profesional dari godaan manipulasi laporan (fraud)?"`;
      memahami = 'Peserta didik mengkaji artikel studi kasus whistleblowing dan regulasi pencegahan tindak pidana korupsi serta etika moral profesi.';
      mengaplikasi = `Peserta didik dalam kelompok menganalisis dilema moral bisnis pada kasus ${topik}, merumuskan alternatif solusi yang selaras dengan nilai Pancasila, dan membuat poster kampanye integritas.`;
      merefleksi = 'Peserta didik menginternalisasi komitmen pribadi untuk senantiasa menjunjung tinggi transparansi, akuntabilitas, dan kejujuran di lingkungan sekolah dan dunia kerja.';
    } else if (isAudit) {
      apersepsi = `Memperkenalkan skeptisisme profesional: "Jika saldo kas di buku besar tertulis Rp 50.000.000 namun fisik uang tunai di brankas hanya Rp 48.500.000, langkah audit apa yang harus segera dilakukan?"`;
      memahami = 'Peserta didik menelaah standar pemeriksaan kas (cash opname), prosedur vouching bukti pengeluaran, dan asersi keberadaan (existence) serta kelengkapan (completeness).';
      mengaplikasi = `Peserta didik melakukan simulasi perhitungan fisik uang tunai (cash count), mencocokkan dokumen pendukung (vouching), dan menyusun Berita Acara Pemeriksaan Kas pada studi kasus ${topik}.`;
      merefleksi = 'Peserta didik mendiskusikan temuan selisih kas, mengidentifikasi faktor penyebab (human error vs kecurangan), dan merumuskan rekomendasi pengendalian internal.';
    } else if (isSyariah) {
      apersepsi = `Menghubungkan prinsip muamalah syariah: "Apa perbedaan mendasar antara keuntungan margin pada akad jual beli Murabahah dengan bunga pinjaman konvensional?"`;
      memahami = 'Peserta didik mengkaji rukun dan syarat akad murabahah, fatwa DSN-MUI, dan standar pencatatan PSAK 102 terkait pengakuan margin keuntungan tangguhan.';
      mengaplikasi = `Peserta didik menyusun jurnal pengadaan barang pesanan, pengakuan piutang murabahah, dan pencatatan angsuran pembayaran nasabah pada studi kasus ${topik}.`;
      merefleksi = 'Peserta didik merefleksikan nilai keadilan, transparansi penetapan margin, dan mitigasi risiko gagal bayar dalam transaksi perbankan syariah.';
    } else {
      // Default Akuntansi Kejuruan
      apersepsi = pertemuanKe === 1
        ? `Mengaitkan materi dengan pengalaman nyata siswa: "Bagaimana sebuah entitas bisnis memastikan setiap transaksi ${topik} tercatat dengan akurat tanpa ada selisih di akhir periode?"`
        : `Meninjau kembali siklus pembukuan pertemuan sebelumnya: "Apa dampak terhadap laporan keuangan jika bukti transaksi pada ${topik} salah diklasifikasikan?"`;
      memahami = 'Peserta didik menyimak paparan materi kontekstual, menelaah dokumen sumber transaksi nyata (faktur/voucher/nota), dan berdiskusi kritis dalam kelompok kecil untuk mengidentifikasi karakteristik akun yang terpengaruh.';
      mengaplikasi = pertemuanKe === 1
        ? `Peserta didik secara kolaboratif mengerjakan lembar kerja kasus transaksi ${topik}, melakukan analisis bukti transaksi, dan mencatatnya ke dalam format lembar kerja akuntansi / spreadsheet dengan teliti.`
        : `Peserta didik melakukan simulasi siklus akuntansi lanjutan pada kasus ${topik}, mengentri transaksi ke dalam aplikasi akuntansi, dan memverifikasi keseimbangan saldo neraca.`;
      merefleksi = 'Perwakilan kelompok mempresentasikan hasil pencatatan jurnal, membandingkan temuan dengan kelompok lain, dan merefleksikan bersama guru apabila ditemukan kendala teknis pencatatan atau selisih saldo.';
    }

    return {
      pertemuanKe,
      alokasiWaktu: `${jpPerPertemuan} JP (${durasiMenit} Menit)`,
      fokusMateri:
        pertemuanKe === 1
          ? `Konsep Dasar, Analisis Teori/Kasus Sumber & Penerapan Terstruktur ${topik}`
          : `Praktik Lanjutan, Studi Kasus Komprehensif & Evaluasi Hasil Kerja ${topik}`,
      tahapAwal: {
        salamDoaPresensi:
          'Guru membuka pembelajaran dengan salam hangat, memimpin doa bersama demi keberkahan proses belajar, serta mengecek kehadiran dan kesiapan fisik peserta didik.',
        apersepsiDanPemantik: apersepsi,
        penyampaianTujuanIceBreaking:
          `Menyampaikan tujuan pembelajaran dan indikator keberhasilan, dilanjutkan ice breaking interaktif terintegrasi mata pelajaran ${mapel} untuk menumbuhkan suasana ceria dan konsentrasi.`,
        alokasiWaktuMenit: waktuAwal,
      },
      tahapInti: {
        memahami,
        mengaplikasi,
        merefleksi,
        alokasiWaktuMenit: waktuInti,
      },
      tahapPenutup: {
        kesimpulanDanRefleksi:
          'Peserta didik bersama guru merumuskan kesimpulan inti terkait materi yang telah dipelajari, mengungkapkan apa yang dirasa paling bermakna serta kendala yang berhasil dipecahkan.',
        umpanBalikTindakLanjutDoa:
          'Guru memberikan apresiasi atas partisipasi aktif peserta didik, menginfokan penugasan portofolio mandiri untuk pertemuan selanjutnya, dan menutup sesi dengan doa bersama.',
        alokasiWaktuMenit: waktuPenutup,
      },
    };
  });

  // Dynamic Capaian Pembelajaran tailored to subject
  let cpRumusan = '';
  if (isMatematika) {
    cpRumusan = fase.includes('Fase E')
      ? 'Pada akhir Fase E, peserta didik mampu menerapkan konsep bilangan eksponen, barisan dan deret, sistem persamaan linear, serta pemodelan matematika untuk menyelesaikan masalah kontekstual bisnis dan kehidupan sehari-hari.'
      : 'Pada akhir Fase F, peserta didik mampu memodelkan pinjaman dan investasi dengan bunga tunggal dan bunga majemuk, menyusun rencana pelunasan sistem anuitas, menganalisis data statistika bisnis, serta menerapkan penalaran kritis dalam pengambilan keputusan kuantitatif.';
  } else if (isInformatika) {
    cpRumusan = fase.includes('Fase E')
      ? 'Pada akhir Fase E, peserta didik mampu menerapkan berpikir komputasional, mengintegrasikan aplikasi perkantoran untuk pengolahan data, mengoperasikan formula spreadsheet, memahami etika digital, serta mengelola data transaksi secara sistematis.'
      : 'Pada akhir Fase F, peserta didik mampu mengelola dan menganalisis dataset kompleks, merancang pemodelan data finansial, mengotomasi proses pengolahan laporan dengan formula tingkat lanjut, serta mengamankan data informasi digital entitas.';
  } else if (isPancasila) {
    cpRumusan = 'Pada akhir pembelajaran, peserta didik mampu menginternalisasi nilai-nilai luhur Pancasila dalam kehidupan bermasyarakat dan bernegara, menerapkan budaya integritas dan anti-korupsi, memahami hak dan kewajiban warga negara, serta menjunjung tinggi etika profesi dan keadilan sosial.';
  } else if (isAudit) {
    cpRumusan = 'Pada akhir Fase F (Mata Pelajaran Pilihan), peserta didik mampu memahami konsep dasar audit dan asurans, standar profesional akuntan publik, prosedur pengumpulan bukti audit, teknik cash opname dan vouching dokumen, serta penyusunan kertas kerja audit sederhana.';
  } else if (isSyariah) {
    cpRumusan = 'Pada akhir Fase F (Mata Pelajaran Pilihan), peserta didik mampu memahami filosofi ekonomi syariah, mengidentifikasi rukun dan syarat akad muamalah (murabahah, mudharabah, musyarakah), serta mencatat transaksi entitas syariah sesuai PSAK Syariah dan fatwa DSN-MUI.';
  } else if (fase.includes('Fase E')) {
    cpRumusan = 'Pada akhir Fase E, peserta didik mampu memahami proses bisnis bidang akuntansi dan keuangan lembaga, menerapkan prinsip dasar akuntansi, mengidentifikasi dokumen transaksi, serta menyusun persamaan dasar akuntansi secara mandiri dan bertanggung jawab.';
  } else {
    cpRumusan = `Pada akhir Fase F, peserta didik mampu menguasai kompetensi mata pelajaran ${mapel}, memproses dokumen transaksi secara teliti, melakukan analisis dan pencatatan terstruktur sesuai standar operasional, serta menyajikan laporan hasil evaluasi secara terstruktur.`;
  }

  // Dynamic LKPD Content
  let lkpdKasus = '';
  let lkpdJudulKolom: string[] = [];
  let lkpdBarisPanduan: string[][] = [];
  let lkpdSoalAnalisis: string[] = [];

  if (isMatematika) {
    lkpdKasus = `STUDI KASUS MATEMATIKA KEUANGAN (SMK BISNIS & MANAJEMEN):
Kasus Permohonan Kredit Modal Kerja UMKM:
Koperasi Simpan Pinjam "Berkah Sejahtera" menyetujui pinjaman modal usaha untuk Toko Roti Mandiri sebesar Rp 24.000.000 dengan jangka waktu pelunasan 12 bulan (1 tahun) dan suku bunga pinjaman anuitas 1% per bulan flat/efektif.
1. Hitung besar anuitas bulanan (A) yang wajib disetorkan pengusaha.
2. Tentukan rincian porsi pembayaran bunga (bn) dan angsuran pokok (an) pada bulan ke-1 sampai bulan ke-3.
3. Hitung saldo sisa pokok pinjaman setelah angsuran bulan ke-3 dibayarkan.`;
    lkpdJudulKolom = ['Bulan Ke-', 'Saldo Awal Pinjaman (Rp)', 'Anuitas / Angsuran (Rp)', 'Porsi Bunga 1% (Rp)', 'Porsi Pokok (Rp)', 'Saldo Akhir Pinjaman (Rp)'];
    lkpdBarisPanduan = [
      ['1', '24.000.000', '2.132.328', '240.000', '1.892.328', '22.107.672'],
      ['2', '22.107.672', '2.132.328', '221.077', '1.911.251', '20.196.421'],
      ['3', '20.196.421', '2.132.328', '201.964', '1.930.364', '18.266.057'],
      ['...', '...', '...', '...', '...', '...'],
    ];
    lkpdSoalAnalisis = [
      'Jelaskan mengapa pada sistem pelunasan anuitas porsi angsuran pokok semakin membesar setiap bulan sementara porsi bunga semakin mengecil!',
      'Bila debitur ingin melunasi seluruh sisa pinjaman pada bulan ke-6, bagaimana perhitungan denda pinalti dan sisa pokok yang adil menurut prinsip matematika keuangan?',
    ];
  } else if (isInformatika) {
    lkpdKasus = `STUDI KASUS PENGOLAHAN DATA TRANSAKSI SPREADSHEET:
Perusahaan Distributor "Mega Niaga" memiliki database transaksi harian sebanyak 150 transaksi penjualan produk ritel.
Tugas Analisis Data:
1. Hubungkan tabel transaksi dengan Master Tabel Produk menggunakan formula =XLOOKUP(...) atau =VLOOKUP(...) untuk menampilkan Nama Barang dan Harga Satuan secara otomatis.
2. Hitung Nilai Penjualan Kotor = Kuantitas * Harga Satuan.
3. Gunakan fungsi =IF(...) untuk memberikan diskon 5% bagi pembeli dengan total transaksi di atas Rp 2.000.000.
4. Buat rangkuman total omzet per wilayah menggunakan formula =SUMIFS(...) dan visualisasikan dalam bentuk Column Chart.`;
    lkpdJudulKolom = ['ID Transaksi', 'Kode Barang', 'Nama Produk (Lookup)', 'Jumlah (Qty)', 'Harga Satuan (Rp)', 'Total Bersih (Rp)'];
    lkpdBarisPanduan = [
      ['TRX-001', 'BRG-101', 'Kertas HVS A4 80gr', '25 rim', '52.000', '1.300.000'],
      ['TRX-002', 'BRG-104', 'Tinta Printer Eco', '10 botol', '120.000', '1.200.000'],
      ['TRX-003', 'BRG-102', 'Map Odner Bantex', '40 unit', '65.000', '2.470.000 (Diskon 5%)'],
      ['...', '...', '...', '...', '...', '...'],
    ];
    lkpdSoalAnalisis = [
      'Apa keunggulan fungsi XLOOKUP dibanding VLOOKUP tradisional saat tabel master memiliki kolom pencarian di sebelah kanan nilai yang diambil?',
      'Bagaimana cara melindungi formula pada sel lembar kerja (Lock Cells & Protect Sheet) agar data formula tidak terhapus secara tidak sengaja oleh operator lain?',
    ];
  } else if (isAudit) {
    lkpdKasus = `STUDI KASUS PEMERIKSAAN KAS FISIK (CASH OPNAME) KANTOR AKUNTAN PUBLIK:
Auditor Junior KAP "Hidayat & Rekan" melakukan audit kas fisik mendadak pada PT Bintang Niaga pada tanggal 31 Juli 2026 pukul 16.30 WIB.
Data Temuan Pemeriksaan:
- Saldo buku kas kecil per 31 Juli 2026: Rp 5.000.000.
- Fisik Uang Tunai di Brankas: Uang kertas Rp 100.000 (30 lembar), Rp 50.000 (22 lembar), Rp 20.000 (15 lembar), uang logam Rp 1.000 (50 keping).
- Bukti Pengeluaran Kas (Kuitansi/Bon) yang belum direimburse:
  * Bon BBM kendaraan operasional: Rp 350.000 (sah, ada tanda tangan manager).
  * Bon konsumsi rapat: Rp 200.000 (sah, ada struk resto).
  * IOU kasbon staf (pinjaman pribadi tanpa otorisasi pimpinan): Rp 250.000.`;
    lkpdJudulKolom = ['Kategori Pemeriksaan', 'Rincian Pecahan / Nomor Bukti', 'Kuantitas', 'Nominal Per Unit (Rp)', 'Total Fisik / Nilai (Rp)'];
    lkpdBarisPanduan = [
      ['Uang Kertas Fisik', 'Pecahan Rp 100.000', '30 Lembar', '100.000', '3.000.000'],
      ['Uang Kertas Fisik', 'Pecahan Rp 50.000', '22 Lembar', '50.000', '1.100.000'],
      ['Uang Kertas Fisik', 'Pecahan Rp 20.000', '15 Lembar', '20.000', '300.000'],
      ['Uang Logam Fisik', 'Pecahan Rp 1.000', '50 Keping', '1.000', '50.000'],
      ['Voucher Sah (Bon)', 'BBM & Konsumsi Rapat', '2 Bukti', 'Beragam', '550.000'],
      ['Total Kas Fisik & Bon', 'Jumlah Kas Riil Ditemukan', '-', '-', '5.000.000 (Cocok)'],
    ];
    lkpdSoalAnalisis = [
      'Bagaimana auditor menyikapi temuan kasbon pribadi staf sebesar Rp 250.000 yang diambil dari dana kas kecil tanpa otorisasi tertulis direktur keuangan?',
      'Susun draft Berita Acara Pemeriksaan Kas (Cash Count Sheet) lengkap dengan tanda tangan pemegang kas dan auditor pemeriksa!',
    ];
  } else {
    // Default Akuntansi Kejuruan
    lkpdKasus = `KASUS TRANSAKSI NYATA SMK AKUNTANSI:
Entitas: PT MITRA CEMERLANG AKL (Perusahaan Jasa & Dagang)
Bulan Transaksi: Juli 2026

Bukti 01: Tgl 02 Juli 2026 (Bukti Kas Keluar No. BKK-01)
Dibayarkan kepada Percetakan Prima tunai sebesar Rp 850.000 untuk pengadaan formulir faktur dan kwitansi kantor (Beban Perlengkapan Kantor).

Bukti 02: Tgl 05 Juli 2026 (Faktur Pembelian No. FP-102)
Diterima barang dagang dari CV Sejahtera Abadi senilai Rp 12.500.000 dengan termin pembayaran 2/10, n/30, PPN Masukan 11% sebesar Rp 1.375.000.

Bukti 03: Tgl 09 Juli 2026 (Bukti Kas Masuk No. BKM-04)
Diterima pelunasan piutang usaha dari Toko Barokah atas faktur penjualan minggu lalu sebesar Rp 6.000.000 tunai tanpa potongan.

Bukti 04: Tgl 15 Juli 2026 (Memo Pengeluaran Kas No. BM-03)
Pengisian kembali dana kas kecil sebesar Rp 1.450.000 untuk penggantian biaya konsumsi rapat Rp 600.000 dan biaya kurir kilat Rp 850.000.`;
    lkpdJudulKolom = ['No', 'Tanggal', 'Keterangan Akun & Bukti Transaksi', 'Ref', 'Debit (Rp)', 'Kredit (Rp)'];
    lkpdBarisPanduan = [
      ['1', '02/07/2026', 'Beban Perlengkapan Kantor (BKK-01)', '511', '850.000', '-'],
      ['', '', '   Kas di Bank', '111', '-', '850.000'],
      ['2', '05/07/2026', 'Pembelian Barang Dagang (FP-102)', '510', '12.500.000', '-'],
      ['', '', 'PPN Masukan (Input VAT)', '116', '1.375.000', '-'],
      ['', '', '   Utang Usaha (CV Sejahtera Abadi)', '211', '-', '13.875.000'],
      ['3', '09/07/2026', 'Kas di Bank (BKM-04)', '111', '6.000.000', '-'],
      ['', '', '   Piutang Usaha (Toko Barokah)', '112', '-', '6.000.000'],
      ['4', '15/07/2026', 'Beban Operasional Rapat & Kurir (BM-03)', '512', '1.450.000', '-'],
      ['', '', '   Kas di Bank', '111', '-', '1.450.000'],
    ];
    lkpdSoalAnalisis = [
      `Jelaskan bagaimana bukti transaksi pada kasus ${topik} di atas diklasifikasikan dan dianalisis pengaruhnya terhadap posisi keuangan entitas!`,
      'Bila ditemukan ketidaksesuaian nomor bukti atau tidak ada tanda tangan otorisasi, tindakan verifikasi internal apa yang wajib dilakukan?',
    ];
  }

  return {
    id: `rpp-akl-${Date.now()}`,
    model,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    identitas: {
      namaSatuanPendidikan: namaSekolah,
      namaGuru: namaGuru,
      nipGuru: nipGuru,
      mataPelajaran: mapel,
      faseKelasSemester: fase,
      topikPembelajaran: topik,
      alokasiWaktu: alokasiText,
      tahunPelajaran: tahunPelajaran,
    },

    identifikasi: {
      kesiapanBelajarMurid:
        isUmum
          ? `Hasil asesmen diagnostik awal mata pelajaran ${mapel}: 30% murid telah menguasai konsep prasyarat (Paham Utuh); 55% memahami dasar namun memerlukan penguatan kontekstual (Paham Sebagian); dan 15% membutuhkan bimbingan intensif serta scaffolding (Perlu Bimbingan).`
          : 'Hasil asesmen awal menunjukkan: 35% murid telah menguasai konsep dasar debit-kredit dan analisis bukti transaksi (Paham Utuh); 50% memahami konsep namun masih membutuhkan penguatan dalam klasifikasi akun akrual (Paham Sebagian); dan 15% memerlukan pendampingan intensif dalam mengidentifikasi saldo normal akun (Perlu Bimbingan).',
      minatDanGayaBelajar:
        'Kecenderungan gaya belajar kelas kejuruan: 45% visual (terbantu dengan bagan alur, tabel data, dan materi multimedia berwarna), 20% auditori (diskusi kelompok bedah kasus), dan 35% kinestetik (praktik langsung studi kasus pengerjaan lembar kerja dan simulasi komputer).',
      latarBelakangDanKebutuhanKhusus:
        'Murid berasal dari latar belakang sosial-ekonomi beragam dengan motivasi tinggi untuk siap kerja di industri; pembelajaran dirancang inklusif dengan scaffolding dan tutor sebaya tanpa hambatan fisik.',
      jenisPengetahuanMateri:
        `Faktual (dokumen kasus, data numerik, istilah teknis ${mapel}); Konseptual (prinsip keilmuan, definisi, hubungan sebab-akibat); Prosedural (langkah-langkah metodologis pemecahan masalah dan pencatatan); Metakognitif (strategi evaluasi mandiri, verifikasi keakuratan, dan deteksi kekeliruan).`,
      relevansiKehidupanNyata:
        `Materi ${topik} pada mata pelajaran ${mapel} merupakan kompetensi aplikatif yang diterapkan dalam dunia kerja nyata, perbankan, industri manufaktur/jasa, kantor profesional, dan kewirausahaan modern.`,
      dimensiProfilLulusan: {
        keimanan: true,
        kewargaan: true,
        penalaranKritis: true,
        kreativitas: true,
        kolaborasi: true,
        kemandirian: true,
        kesehatan: false,
        komunikasi: true,
      },
      dimensiProfilLulusanCatatan:
        'Penalaran kritis dikembangkan saat menganalisis data dan memecahkan masalah; Kolaborasi dan Komunikasi dilatih saat berdiskusi tim; Kemandirian terwujud dalam penyelesaian tugas individu secara bertanggung jawab.',
    },

    desainPembelajaran: {
      capaianPembelajaran: cpRumusan,
      lintasDisiplinIlmu:
        isMatematika
          ? 'Akuntansi & Keuangan Lembaga (pemodelan angsuran pinjaman); Informatika (penggunaan formula fungsi finansial Excel); Ekonomi Bisnis.'
          : isInformatika
          ? 'Matematika (logika aljabar boolean); Akuntansi (pengolahan database transaksi & siklus buku besar); Komunikasi Bisnis.'
          : 'Matematika Keuangan (perhitungan bunga, diskon termin, penyusutan); Informatika / TIK (pengoperasian spreadsheet formula finansial & database); Bahasa Indonesia (korespondensi bisnis dan etika pelaporan).',
      tujuanPembelajaran: [
        `Melalui penelaahan materi ajar, peserta didik mampu menguraikan konsep dasar pada ${topik} dengan teliti dan tepat.`,
        `Melalui diskusi kolaboratif dan penugasan kelompok, peserta didik mampu menganalisis permasalahan kontekstual pada ${topik} secara kritis dan logis.`,
        `Melalui simulasi studi kasus, peserta didik mampu menyelesaikan lembar kerja praktikum pada topik ${topik} sesuai standar operasional yang berlaku dengan akurat.`,
        `Peserta didik mampu mempresentasikan dan mempertahankan hasil kerja kelompok serta merefleksikan proses belajar dengan penuh rasa percaya diri.`,
      ],
      topikPembelajaranKontekstual:
        `Studi Kasus Pembelajaran Kontekstual ${topik} pada Mata Pelajaran ${mapel} di Lingkungan Sekolah Kejuruan dan Dunia Kerja.`,
      praktikPedagogis:
        model === 'tefa_industri'
          ? 'Teaching Factory (TeFa) berbasis Standard Operating Procedure (SOP) Industri / Dunia Kerja'
          : model === 'ringkas_1lembar'
          ? 'Problem-Based Learning (PBL) Ringkas & Aplikatif'
          : 'Problem-Based Learning (PBL) dengan Pendekatan Pembelajaran Mendalam (Deep Learning)',
      kemitraanPembelajaran:
        'Dunia Usaha & Dunia Industri (DUDI) mitra sekolah, Asosiasi Guru Mata Pelajaran (MGMP), serta praktisi ahli industri tamu.',
      lingkunganPembelajaran:
        'Laboratorium Komputer / Praktik Kejuruan, Ruang Kelas Kolaboratif dengan formasi kelompok, dan platform LMS sekolah.',
      pemanfaatanDigital:
        'Aplikasi Spreadsheet (Excel / Google Sheets), Perangkat Lunak Terapan Kejuruan, LMS Sekolah, dan platform asesmen interaktif.',
    },

    pengalamanBelajar: pertemuanList,

    asesmenPembelajaran: {
      asesmenAwal: {
        teknikDanInstrumen:
          `Tes Diagnostik Kognitif Awal melalui 5 butir soal pemahaman konsep dasar ${mapel} & angket kesiapan belajar mandiri.`,
        waktuPelaksanaan: 'Awal pertemuan ke-1 sebelum pemaparan konsep inti.',
      },
      asesmenProses: {
        teknikDanInstrumen:
          'Observasi keterlibatan diskusi kelompok (Lembar Pengamatan Sikap Kolaborasi & Kritis) serta checklist pengerjaan berkala lembar kerja kasus.',
        waktuPelaksanaan: 'Saat proses pengerjaan studi kasus di tahap inti kegiatan.',
      },
      asesmenAkhir: {
        teknikDanInstrumen:
          `Penilaian Kinerja / Unjuk Kerja penyelesaian penugasan studi kasus ${topik} dan tes formatif pemahaman konsep.`,
        waktuPelaksanaan: 'Akhir pertemuan atau pada sesi penutup pembelajaran.',
      },
      rubrikPenilaian: [
        {
          kriteria: `Ketepatan Pemahaman & Analisis Konsep ${mapel}`,
          sangatBaik:
            'Mampu menganalisis seluruh data permasalahan kasus secara 100% tepat, logis, sistematis, dan sesuai kaidah keilmuan.',
          baik:
            'Mampu menganalisis sebagian besar data dengan tepat, hanya terdapat sedikit kekeliruan minor pada penentuan langkah spesifik.',
          cukup:
            'Cukup mampu menganalisis konsep permasalahan, namun masih membutuhkan konfirmasi dan bimbingan guru pada penentuan solusi.',
          perluBimbingan:
            'Belum mampu menganalisis konsep dan data permasalahan tanpa pendampingan intensif dari guru.',
        },
        {
          kriteria: 'Akurasi Perhitungan / Pengerjaan Lembar Kerja',
          sangatBaik:
            'Seluruh hasil kerja dan perhitungan akurat, format rapi, penyelesaian tepat waktu, dan memenuhi seluruh kriteria operasional.',
          baik:
            'Format pengerjaan rapi dan hasil kerja sebagian besar akurat dengan sedikit koreksi kecil pada penyajian.',
          cukup:
            'Terdapat beberapa kesalahan perhitungan atau format pengerjaan yang belum sempurna, namun berhasil diperbaiki setelah diberi petunjuk.',
          perluBimbingan:
            'Banyak terjadi kekeliruan pengerjaan dan format tugas tidak mengikuti petunjuk instruksi kerja yang diberikan.',
        },
        {
          kriteria: 'Kolaborasi, Komunikasi & Penalaran Kritis',
          sangatBaik:
            'Sangat aktif berdiskusi, memberikan argumen kritis logis, menghargai pandangan rekan tim, dan membagi peran kerja tim dengan harmonis.',
          baik:
            'Aktif bekerja sama dalam tim dan menyelesaikan pembagian tugas tepat waktu dengan komunikasi yang baik.',
          cukup:
            'Cukup terlibat dalam kerja kelompok namun sesekali masih pasif dan menunggu instruksi dari rekan setim.',
          perluBimbingan:
            'Kurang menunjukkan partisipasi aktif dalam kerja kelompok dan belum menunjukkan inisiatif berpikir kritis.',
        },
      ],
    },

    lampiran: {
      lkpd: {
        judul: `Lembar Kerja Peserta Didik (LKPD): Praktikum & Analisis ${topik}`,
        petunjukPengerjaan: [
          'Berdoalah sebelum memulai pengerjaan lembar kerja.',
          'Bentuk kelompok kerja yang terdiri dari 3–4 peserta didik.',
          `Cermati secara mendalam seluruh data dan informasi yang disajikan pada kasus ${topik} di bawah.`,
          'Diskusikan bersama rekan sekelompok untuk menentukan langkah penyelesaian pemecahan masalah yang sistematis.',
          'Tuliskan hasil kerja secara rapi ke dalam tabel/format kertas kerja yang telah disediakan.',
          'Lakukan verifikasi ulang sebelum mempresentasikan hasil kerja di depan kelas.',
        ],
        kasusTransaksi: lkpdKasus,
        tabelPengerjaan: {
          judulKolom: lkpdJudulKolom,
          barisPanduan: lkpdBarisPanduan,
        },
        soalAnalisis: lkpdSoalAnalisis,
      },
      bahanBacaanMateri:
        `RANGKUMAN MATERI PEMBELAJARAN:
Mata Pelajaran: ${mapel} (${fase})
Topik: ${topik}

1. Landasan Konseptual:
${materiAjarText.slice(0, 800)}...

2. Prinsip Esensial & Prosedur Penerapan:
- Memahami tujuan dan fungsi utama dari konsep yang dipelajari dalam konteks kehidupan nyata dan dunia kerja.
- Mengidentifikasi dokumen, data, dan variabel penting yang menjadi masukan (input) dalam proses pemecahan masalah.
- Menerapkan langkah-langkah terstruktur sesuai prosedur operasional standar secara teliti, objektif, dan terverifikasi.
- Mengevaluasi hasil akhir untuk memastikan akurasi, efisiensi, dan kesesuaian dengan standar mutu yang diharapkan.`,
      instrumenRefleksiMurid: [
        `Bagian mana dari pembelajaran ${topik} yang paling saya kuasai hari ini?`,
        'Kendala apa yang saya temui saat bekerja sama memecahkan masalah dalam kelompok?',
        `Bagaimana saya dapat menerapkan pemahaman materi ${mapel} ini dalam kehidupan sehari-hari atau profesi masa depan?`,
      ],
      instrumenRefleksiGuru: [
        'Apakah seluruh peserta didik terlibat aktif dan mencapai pemahaman tuntas terhadap indikator capaian?',
        'Strategi pembelajaran apa yang paling berhasil memancing rasa ingin tahu dan penalaran kritis murid?',
        'Penyesuaian apa yang perlu dilakukan untuk menyempurnakan pertemuan pembelajaran berikutnya?',
      ],
      diferensiasi: {
        konten:
          'Menyediakan media materi multimodal: modul teks terstruktur, infografis bagan alur berwarna untuk murid visual, dan rekaman audio/video penjelas untuk murid auditori.',
        proses:
          'Memberikan bantuan bimbingan bertingkat (scaffolding): kelompok mandiri diberikan studi kasus pemecahan masalah tingkat tinggi (HOTS), sementara kelompok yang berkembang didampingi dengan lembar panduan petunjuk teknis langkah demi langkah.',
        produk:
          'Peserta didik diberikan keleluasaan menyajikan laporan hasil pengerjaan tugas baik dalam bentuk lembar kerja manual, format spreadsheet/digital, maupun slide presentasi visual kelompok.',
      },
    },

    pengesahan: {
      tempatTitimangsa,
      namaKepalaSekolah,
      nipKepalaSekolah,
      namaGuru,
      nipGuru,
    },

    kustomisasi: kustomisasi || {
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
    },
  };
}

export function analyzeAklMaterialFallback(materiText: string) {
  const textLower = (materiText || '').toLowerCase();

  let suggestedTopik = 'Pencatatan Transaksi Keuangan dan Siklus Akuntansi';
  let suggestedFase: any = 'Fase F (Kelas XI)';
  let suggestedMapel: any = 'Akuntansi Keuangan';
  let suggestedModel: any = 'mendalam';

  if (textLower.includes('kas kecil') || textLower.includes('petty cash') || textLower.includes('imprest')) {
    suggestedTopik = 'Pengelolaan Kas Kecil (Metode Imprest & Fluktuasi)';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Akuntansi Keuangan';
  } else if (textLower.includes('audit') || textLower.includes('cash opname') || textLower.includes('vouching')) {
    suggestedTopik = 'Pemeriksaan Kas (Cash Opname) & Vouching Dokumen';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Auditing Dasar & Pemeriksaan Akuntansi';
  } else if (textLower.includes('syariah') || textLower.includes('murabahah') || textLower.includes('mudharabah')) {
    suggestedTopik = 'Pencatatan Akad Jual Beli Murabahah Syariah';
    suggestedFase = 'Fase F (Kelas XII)';
    suggestedMapel = 'Akuntansi Syariah & Lembaga Keuangan Mikro';
  } else if (textLower.includes('anuitas') || textLower.includes('bunga majemuk') || textLower.includes('bunga tunggal') || textLower.includes('matematika')) {
    suggestedTopik = 'Bunga Majemuk dan Sistem Anuitas Pinjaman';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Matematika (Kejuruan/Umum)';
  } else if (textLower.includes('vlookup') || textLower.includes('xlookup') || textLower.includes('pivot') || textLower.includes('informatika')) {
    suggestedTopik = 'Pengolahan dan Visualisasi Data Transaksi Spreadsheet';
    suggestedFase = 'Fase E (Kelas X)';
    suggestedMapel = 'Informatika';
  } else if (textLower.includes('pancasila') || textLower.includes('anti-korupsi') || textLower.includes('integritas')) {
    suggestedTopik = 'Penerapan Nilai Kejujuran dan Integritas Anti-Korupsi';
    suggestedFase = 'Fase E (Kelas X)';
    suggestedMapel = 'Pendidikan Pancasila';
  } else if (textLower.includes('penyesuaian') || textLower.includes('ikhtisar laba') || textLower.includes('hpp')) {
    suggestedTopik = 'Jurnal Penyesuaian Perusahaan Dagang & Manufaktur';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Praktikum Akuntansi Perusahaan Jasa, Dagang dan Manufaktur';
  } else if (textLower.includes('persamaan dasar') || textLower.includes('etika profesi') || textLower.includes('fase e') || textLower.includes('kelas x')) {
    suggestedTopik = 'Persamaan Dasar Akuntansi dan Analisis Transaksi';
    suggestedFase = 'Fase E (Kelas X)';
    suggestedMapel = 'Dasar-dasar Program Keahlian Akuntansi dan Keuangan Lembaga';
  } else if (textLower.includes('pajak') || textLower.includes('pph') || textLower.includes('ppn') || textLower.includes('ter')) {
    suggestedTopik = 'Perhitungan dan Pemotongan Pajak Penghasilan (PPh 21/22/23)';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Administrasi Pajak';
  } else if (textLower.includes('accurate') || textLower.includes('myob') || textLower.includes('komputer akuntansi')) {
    suggestedTopik = 'Pengoperasian Aplikasi Komputer Akuntansi';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Komputer Akuntansi (MYOB / Accurate / Spreadsheet)';
  } else if (textLower.includes('desa') || textLower.includes('skpd') || textLower.includes('lembaga') || textLower.includes('pemerintah')) {
    suggestedTopik = 'Akuntansi Keuangan Lembaga dan Instansi Pemerintah';
    suggestedFase = 'Fase F (Kelas XI)';
    suggestedMapel = 'Praktikum Akuntansi Lembaga / Instansi Pemerintah';
  }

  return {
    suggestedTopik,
    suggestedFase,
    suggestedMapel,
    suggestedModel,
    ringkasanInti: 'Materi memuat kompetensi esensial akuntansi kejuruan SMK.',
    rekomendasiJumlahPertemuan: 2,
    kataKunci: ['Jurnal', 'Debit-Kredit', 'Bukti Transaksi', 'Buku Besar', 'Akuntansi Keuangan'],
  };
}
