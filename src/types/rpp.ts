export type FaseAKL = 'Fase E (Kelas X)' | 'Fase F (Kelas XI)' | 'Fase F (Kelas XII)';

export type KelompokMapel = 'kejuruan' | 'umum_adaptif' | 'pilihan';

export type MapelAKL = string;

export type ModelModulAjar =
  | 'mendalam' // Pembelajaran Mendalam (Deep Learning - 8 Dimensi Profil Lulusan) sesuai template lampiran
  | 'bskap_lengkap' // Modul Ajar Standar BSKAP Kurikulum Merdeka
  | 'tefa_industri' // Model Teaching Factory & Kemitraan DUDI / KAP
  | 'ringkas_1lembar'; // Format Ringkas 1-2 Lembar Supervisi

export interface ProfilLulusanSelection {
  keimanan: boolean;
  kewargaan: boolean;
  penalaranKritis: boolean;
  kreativitas: boolean;
  kolaborasi: boolean;
  kemandirian: boolean;
  kesehatan: boolean;
  komunikasi: boolean;
}

export interface IdentitasSekolah {
  namaSekolah: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  tempatTitimangsa: string;
  logoUrl?: string;
  kopSuratText?: string;
}

export interface KustomisasiFitur {
  tampilkanIdentifikasi: boolean;
  tampilkanProfilLulusan: boolean;
  tampilkanKemitraanDudi: boolean;
  tampilkanLintasDisiplin: boolean;
  tampilkanPemanfaatanDigital: boolean;
  tampilkanRubrikLengkap: boolean;
  tampilkanLKPD: boolean;
  tampilkanBahanBacaan: boolean;
  tampilkanDiferensiasi: boolean;
  tampilkanPengesahan: boolean;
}

export interface PertemuanBelajar {
  pertemuanKe: number;
  alokasiWaktu: string; // misal "4 JP (4 x 45 menit)"
  fokusMateri: string;
  tahapAwal: {
    salamDoaPresensi: string;
    apersepsiDanPemantik: string; // memuat pertanyaan pemantik kontekstual dunia akuntansi
    penyampaianTujuanIceBreaking: string;
    alokasiWaktuMenit: number;
  };
  tahapInti: {
    memahami: string; // membangun konsep, eksplorasi dokumen transaksi/teori
    mengaplikasi: string; // studi kasus riil, entri jurnal, simulasi transaksi
    merefleksi: string; // penilaian proses, analisis kendala pencatatan
    alokasiWaktuMenit: number;
  };
  tahapPenutup: {
    kesimpulanDanRefleksi: string;
    umpanBalikTindakLanjutDoa: string;
    alokasiWaktuMenit: number;
  };
}

export interface RubrikIndikator {
  kriteria: string;
  sangatBaik: string; // Skala 4
  baik: string; // Skala 3
  cukup: string; // Skala 2
  perluBimbingan: string; // Skala 1
}

export interface LKPDData {
  judul: string;
  petunjukPengerjaan: string[];
  kasusTransaksi: string; // Kasus bukti transaksi nyata (faktur, kuitansi, memo)
  tabelPengerjaan: {
    judulKolom: string[];
    barisPanduan: string[][];
  };
  soalAnalisis: string[];
}

export interface DiferensiasiData {
  konten: string; // visual, auditory, studi kasus bertingkat
  proses: string; // scaffolding, bimbingan kelompok tutor sebaya
  produk: string; // format laporan, spreadsheet vs manual
}

export interface ModulAjarData {
  id: string;
  model: ModelModulAjar;
  createdAt: string;
  updatedAt: string;
  
  // 1. Identitas
  identitas: {
    namaSatuanPendidikan: string;
    namaGuru: string;
    nipGuru: string;
    mataPelajaran: string;
    faseKelasSemester: string;
    topikPembelajaran: string;
    alokasiWaktu: string;
    tahunPelajaran: string;
  };

  // 2. Identifikasi
  identifikasi: {
    kesiapanBelajarMurid: string;
    minatDanGayaBelajar: string;
    latarBelakangDanKebutuhanKhusus: string;
    jenisPengetahuanMateri: string; // faktual, konseptual, prosedural, metakognitif
    relevansiKehidupanNyata: string; // relevansi dunia industri/usaha/KAP/perbankan
    dimensiProfilLulusan: ProfilLulusanSelection;
    dimensiProfilLulusanCatatan?: string;
  };

  // 3. Desain Pembelajaran
  desainPembelajaran: {
    capaianPembelajaran: string;
    lintasDisiplinIlmu: string;
    tujuanPembelajaran: string[];
    topikPembelajaranKontekstual: string;
    praktikPedagogis: string; // PjBL, PBL, Inkuiri, TeFa
    kemitraanPembelajaran: string; // DUDI, KAP, Perbankan, BUMDes
    lingkunganPembelajaran: string; // Lab Komputer Akuntansi, Bank Mini, Kelas
    pemanfaatanDigital: string; // Spreadsheet, Accurate, MYOB, Quizizz, dsb
  };

  // 4. Pengalaman Belajar
  pengalamanBelajar: PertemuanBelajar[];

  // 5. Asesmen Pembelajaran
  asesmenPembelajaran: {
    asesmenAwal: {
      teknikDanInstrumen: string;
      waktuPelaksanaan: string;
    };
    asesmenProses: {
      teknikDanInstrumen: string;
      waktuPelaksanaan: string;
    };
    asesmenAkhir: {
      teknikDanInstrumen: string;
      waktuPelaksanaan: string;
    };
    rubrikPenilaian: RubrikIndikator[];
  };

  // 6. Lampiran
  lampiran: {
    lkpd: LKPDData;
    bahanBacaanMateri: string;
    instrumenRefleksiMurid: string[];
    instrumenRefleksiGuru: string[];
    diferensiasi: DiferensiasiData;
  };

  // Pengesahan
  pengesahan: {
    tempatTitimangsa: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    namaGuru: string;
    nipGuru: string;
  };

  // Kustomisasi Flag
  kustomisasi: KustomisasiFitur;
}

export interface GenerateRPPRequest {
  materiAjarText: string;
  topik: string;
  fase: FaseAKL;
  mapel: MapelAKL;
  model: ModelModulAjar;
  alokasiPertemuan: number;
  jpPerPertemuan: number;
  identitasSekolah: IdentitasSekolah;
  kustomisasi: KustomisasiFitur;
  instruksiKhusus?: string;
  modeKecepatan?: 'kilat' | 'ai_penuh';
}
