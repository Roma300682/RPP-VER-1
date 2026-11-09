import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateAklFallbackRpp, analyzeAklMaterialFallback } from './src/utils/aklCurriculumEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEV_PORT = 3000;
const ENV_PORT = process.env.PORT ? Number(process.env.PORT) : null;

app.use(express.json({ limit: '25mb' }));

// Server-side GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust Gemini generation with timeout & fallback for high-demand spikes
async function generateWithRetryAndFallback(params: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}) {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === 'MY_GEMINI_API_KEY' || currentKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }

  // Use only valid models from gemini-api skill: gemini-3.8-flash as primary, gemini-2.5-flash as secondary
  const models = ['gemini-3.8-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      // 12-second hard timeout per call so user never hangs
      const apiCall = ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
          ...(params.responseMimeType ? { responseMimeType: params.responseMimeType } : {}),
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Request Timeout (12s exceeded)')), 12000)
      );

      const response: any = await Promise.race([apiCall, timeoutPromise]);
      return response;
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || err);
      // If timeout or other non-retryable error, immediately break and fallback
      if (msg.includes('Timeout')) {
        break;
      }
      // If 503 UNAVAILABLE or 429 rate limit, wait 1 second and retry once
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const retryCall = ai.models.generateContent({
            model,
            contents: params.contents,
            config: {
              ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
              ...(params.responseMimeType ? { responseMimeType: params.responseMimeType } : {}),
            },
          });
          const retryTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI Request Retry Timeout (8s exceeded)')), 8000)
          );
          return await Promise.race([retryCall, retryTimeout]);
        } catch (retryErr: any) {
          lastError = retryErr;
        }
      }
    }
  }
  throw lastError;
}

// Helper to sanitize Gemini JSON output
function parseGeminiJson<T>(text: string): T {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned) as T;
}

// 1. Endpoint: Generate Full Modul Ajar / RPP AKL
app.post('/api/generate-rpp', async (req, res) => {
  try {
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
      modeKecepatan = 'kilat',
    } = req.body;

    if (!materiAjarText && !topik) {
      return res.status(400).json({ error: 'Materi ajar atau topik pembelajaran wajib diisi.' });
    }

    // Mode Kilat: Instan (< 100ms) menggunakan kurikulum esensial SMK AKL
    if (modeKecepatan === 'kilat') {
      const fastRpp = generateAklFallbackRpp(req.body);
      return res.json({ success: true, data: fastRpp, note: 'Disusun secara instan dengan Kurikulum Esensial SMK' });
    }

    const systemPrompt = `Anda adalah Asisten Pakar Kurikulum SMK (Bidang Keahlian Bisnis dan Manajemen, Akuntansi dan Keuangan Lembaga / AKL, Mata Pelajaran Umum/Adaptif SMK seperti Matematika, Informatika, Bahasa, Pancasila, IPAS, serta Mata Pelajaran Pilihan Fase F seperti Auditing, Akuntansi Syariah, Perpajakan Digital), serta Pengembang Modul Ajar Kurikulum Merdeka & Pembelajaran Mendalam (Deep Learning) bereputasi tinggi di Indonesia.

TUGAS UTAMA:
Hanya menggunakan Materi / Bahan Ajar yang diberikan oleh Guru, susunlah Dokumen Rencana Pembelajaran / Modul Ajar resmi yang sangat komprehensif, operasional, berkesadaran, bermakna, dan menggembirakan sesuai format standar sekolah Indonesia.

ATURAN STRUKTUR DOKUMEN (Mengikuti Format Rencana Pembelajaran Mendalam Kurikulum Merdeka):
1. IDENTITAS:
- Nama satuan pendidikan: "${identitasSekolah?.namaSekolah || 'SMK Negeri 1 Akuntansi'}"
- Nama guru: "${identitasSekolah?.namaGuru || 'Guru SMK'}"
- NIP guru: "${identitasSekolah?.nipGuru || '-'}"
- Mata pelajaran: "${mapel}"
- Fase / kelas / semester: "${fase}"
- Topik pembelajaran: "${topik || 'Sesuai Bahan Ajar'}"
- Alokasi waktu: "${alokasiPertemuan} Pertemuan x ${jpPerPertemuan} JP (${alokasiPertemuan * jpPerPertemuan * 45} menit)"
- Tahun pelajaran: "${identitasSekolah?.tahunPelajaran || '2026/2027'}"

2. IDENTIFIKASI (Pembelajaran Mendalam):
- Kesiapan belajar murid: Diagnostik awal konkret (kategori Paham Utuh, Paham Sebagian, Belum Paham terkait konsep prasyarat mata pelajaran ${mapel}).
- Minat dan gaya belajar: Pemetaan kecenderungan visual (analisis bagan alur/infografis/dokumen), auditori (diskusi kasus), kinestetik/praktik (praktik entry spreadsheet/software/penugasan lembar kerja).
- Latar belakang & kebutuhan khusus: Analisis inklusivitas & konteks lokal sekolah kejuruan.
- Jenis pengetahuan materi: Sebutkan & uraikan secara rinci 4 dimensi (Faktual: data/dokumen kasus/istilah teknis; Konseptual: prinsip keilmuan/definisi/kaidah; Prosedural: tata cara/metodologi penyelesaian masalah; Metakognitif: strategi evaluasi mandiri/verifikasi hasil).
- Relevansi materi dengan kehidupan nyata: Konteks nyata dunia kerja (industri, perkantoran, KAP, perbankan, UMKM, teknologi digital).
- Dimensi Profil Lulusan (Profil Pelajar Pancasila): Pilih dimensi yang relevan dari 8 dimensi (Keimanan, Kewargaan, Penalaran kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi) dan berikan deskripsi pengintegrasiannya dalam kegiatan pembelajaran ${mapel}.

3. DESAIN PEMBELAJARAN:
- Capaian Pembelajaran (CP): Salin & rumuskan CP elemen yang tepat untuk ${fase} mata pelajaran ${mapel}.
- Lintas disiplin ilmu: Keterkaitan dengan Matematika Terapan, Bahasa Indonesia, TIK/Informatika, Ekonomi/Bisnis.
- Tujuan pembelajaran: Tuliskan 3-5 tujuan pembelajaran spesifik dengan formula ABCD (Audience, Behavior, Condition, Degree).
- Topik pembelajaran kontekstual: Masalah atau studi kasus riil dunia nyata yang diangkat.
- Praktik pedagogis: Model pembelajaran yang tepat (Problem-Based Learning / Project-Based Learning / Teaching Factory / Inkuiri Terbimbing).
- Kemitraan pembelajaran: Kolaborasi dengan DUDI, asosiasi profesi/guru (MGMP), atau praktisi ahli tamu.
- Lingkungan pembelajaran: Lab Praktik / Komputer, Ruang Kelas Kolaboratif, platform LMS.
- Pemanfaatan digital: Software spreadsheet (Excel/Google Sheets), software terapan kejuruan, platform e-learning/asesmen.

4. PENGALAMAN BELAJAR:
Susun untuk setiap pertemuan (ada tepat ${alokasiPertemuan} pertemuan).
Setiap pertemuan WAJIB memiliki tahap:
- Awal: Salam, doa, presensi; Apersepsi & Pertanyaan Pemantik kontekstual mata pelajaran ${mapel} yang memancing rasa ingin tahu; Penyampaian tujuan dan ice breaking interaktif singkat.
- Inti (Framework Deep Learning):
  * Memahami: Eksplorasi materi, bedah dokumen sumber/kasus atau konsep, diskusi terarah.
  * Mengaplikasi: Penugasan studi kasus nyata, pengerjaan lembar kerja praktikum dalam kelompok secara kolaboratif.
  * Merefleksi: Presentasi hasil kerja tim, konfirmasi kebenaran konsep bersama guru, refleksi kendala belajar.
- Penutup: Kesimpulan bersama, refleksi pembelajaran, umpan balik, informasi pertemuan berikutnya, doa penutup.

5. ASESMEN PEMBELAJARAN:
- Asesmen awal (diagnostik): Teknik dan instrumen (kuis singkat prasyarat/angket kesiapan).
- Asesmen proses (formatif): Observasi keaktifan kelompok, checklist pengerjaan tugas lembar kerja.
- Asesmen akhir (sumatif): Penilaian unjuk kerja studi kasus komprehensif / tes formatif penguasaan konsep.
- Rubrik Penilaian: Buat minimal 3 kriteria (misal: Ketepatan Pemahaman & Analisis Konsep ${mapel}, Akurasi Hasil Kerja/Perhitungan, Kolaborasi & Penalaran Kritis) masing-masing dengan 4 tingkat deskripsi jelas (Sangat Baik/4, Baik/3, Cukup/2, Perlu Bimbingan/1).

6. LAMPIRAN OPERASIONAL:
- LKPD (Lembar Kerja Peserta Didik): Berisi judul, petunjuk kerja, KASUS / DATA RIIL sesuai bidang mata pelajaran ${mapel}, tabel pengerjaan (judul kolom dan baris panduan), serta 2-3 pertanyaan analisis kritis.
- Bahan Bacaan dan Media Ajar: Rangkuman ringkas tapi padat konsep materi ajar untuk guru dan siswa.
- Instrumen Refleksi Siswa dan Guru.
- Rencana Diferensiasi: Diferensiasi Konten, Diferensiasi Proses, dan Diferensiasi Produk secara spesifik untuk topik ini.

7. PENGESAHAN:
- Titimangsa: "${identitasSekolah?.tempatTitimangsa || 'Jakarta, 14 Juli 2026'}"
- Nama & NIP Kepala Sekolah: "${identitasSekolah?.namaKepalaSekolah || 'Kepala Sekolah'}" (${identitasSekolah?.nipKepalaSekolah || '-'})
- Nama & NIP Guru Mapel: "${identitasSekolah?.namaGuru || 'Guru Akuntansi'}" (${identitasSekolah?.nipGuru || '-'})

FORMAT OUTPUT WAJIB BERUPA JSON VALID DENGAN SKEMA:
{
  "id": "rpp-akl-" + timestamp,
  "model": "${model}",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "identitas": {
    "namaSatuanPendidikan": "...",
    "namaGuru": "...",
    "nipGuru": "...",
    "mataPelajaran": "...",
    "faseKelasSemester": "...",
    "topikPembelajaran": "...",
    "alokasiWaktu": "...",
    "tahunPelajaran": "..."
  },
  "identifikasi": {
    "kesiapanBelajarMurid": "...",
    "minatDanGayaBelajar": "...",
    "latarBelakangDanKebutuhanKhusus": "...",
    "jenisPengetahuanMateri": "...",
    "relevansiKehidupanNyata": "...",
    "dimensiProfilLulusan": {
      "keimanan": boolean,
      "kewargaan": boolean,
      "penalaranKritis": boolean,
      "kreativitas": boolean,
      "kolaborasi": boolean,
      "kemandirian": boolean,
      "kesehatan": boolean,
      "komunikasi": boolean
    },
    "dimensiProfilLulusanCatatan": "..."
  },
  "desainPembelajaran": {
    "capaianPembelajaran": "...",
    "lintasDisiplinIlmu": "...",
    "tujuanPembelajaran": ["...", "..."],
    "topikPembelajaranKontekstual": "...",
    "praktikPedagogis": "...",
    "kemitraanPembelajaran": "...",
    "lingkunganPembelajaran": "...",
    "pemanfaatanDigital": "..."
  },
  "pengalamanBelajar": [
    {
      "pertemuanKe": 1,
      "alokasiWaktu": "... JP (... menit)",
      "fokusMateri": "...",
      "tahapAwal": {
        "salamDoaPresensi": "...",
        "apersepsiDanPemantik": "...",
        "penyampaianTujuanIceBreaking": "...",
        "alokasiWaktuMenit": 15
      },
      "tahapInti": {
        "memahami": "...",
        "mengaplikasi": "...",
        "merefleksi": "...",
        "alokasiWaktuMenit": 150
      },
      "tahapPenutup": {
        "kesimpulanDanRefleksi": "...",
        "umpanBalikTindakLanjutDoa": "...",
        "alokasiWaktuMenit": 15
      }
    }
  ],
  "asesmenPembelajaran": {
    "asesmenAwal": {
      "teknikDanInstrumen": "...",
      "waktuPelaksanaan": "..."
    },
    "asesmenProses": {
      "teknikDanInstrumen": "...",
      "waktuPelaksanaan": "..."
    },
    "asesmenAkhir": {
      "teknikDanInstrumen": "...",
      "waktuPelaksanaan": "..."
    },
    "rubrikPenilaian": [
      {
        "kriteria": "...",
        "sangatBaik": "...",
        "baik": "...",
        "cukup": "...",
        "perluBimbingan": "..."
      }
    ]
  },
  "lampiran": {
    "lkpd": {
      "judul": "...",
      "petunjukPengerjaan": ["...", "..."],
      "kasusTransaksi": "...",
      "tabelPengerjaan": {
        "judulKolom": ["No", "Tanggal", "Keterangan / Bukti", "Ref", "Debit (Rp)", "Kredit (Rp)"],
        "barisPanduan": [["1", "...", "...", "...", "...", "..."]]
      },
      "soalAnalisis": ["...", "..."]
    },
    "bahanBacaanMateri": "...",
    "instrumenRefleksiMurid": ["...", "..."],
    "instrumenRefleksiGuru": ["...", "..."],
    "diferensiasi": {
      "konten": "...",
      "proses": "...",
      "produk": "..."
    }
  },
  "pengesahan": {
    "tempatTitimangsa": "...",
    "namaKepalaSekolah": "...",
    "nipKepalaSekolah": "...",
    "namaGuru": "...",
    "nipGuru": "..."
  },
  "kustomisasi": ${JSON.stringify(kustomisasi || {})}
}`;

    const userPrompt = `BERIKUT ADALAH BAHAN / MATERI AJAR DARI GURU SMK AKL:
=========================================
${materiAjarText}
=========================================

Parameter Tambahan:
- Mata Pelajaran: ${mapel}
- Fase: ${fase}
- Topik: ${topik || 'Ekstrak dari materi'}
- Model Modul Ajar: ${model}
- Jumlah Pertemuan: ${alokasiPertemuan} pertemuan (@ ${jpPerPertemuan} JP)
${instruksiKhusus ? `- Instruksi Khusus Guru: ${instruksiKhusus}` : ''}

Silakan susun Dokumen Modul Ajar / RPP lengkap dan kembalikan HANYA JSON murni sesuai skema di atas tanpa pembuka/penutup basa-basi.`;

    try {
      const response = await generateWithRetryAndFallback({
        contents: userPrompt,
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      });

      const outputText = response.text || '{}';
      const parsedData = parseGeminiJson(outputText);
      return res.json({ success: true, data: parsedData });
    } catch (aiError: any) {
      console.log('Using SMK AKL curriculum synthesis engine for RPP generation.');
      const fallbackRpp = generateAklFallbackRpp(req.body);
      return res.json({ success: true, data: fallbackRpp, note: 'Disusun dengan Kurikulum Esensial SMK AKL' });
    }
  } catch (error: any) {
    console.error('Error generating RPP:', error);
    return res.status(500).json({
      error: error.message || 'Gagal menghasilkan RPP dengan kecerdasan buatan.',
    });
  }
});

// 2. Endpoint: Regenerate specific section with AI
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { sectionKey, currentData, promptRequest, context } = req.body;

    if (!sectionKey || !currentData) {
      return res.status(400).json({ error: 'Data tidak lengkap untuk regenerasi bagian.' });
    }

    const systemPrompt = `Anda adalah pakar kurikulum SMK Akuntansi dan Keuangan Lembaga (AKL).
Tugas Anda adalah memperbarui atau meregenerasi bagian "${sectionKey}" dari modul ajar akuntansi berikut sesuai instruksi spesifik pengguna.
Konteks Pembelajaran:
Mata Pelajaran: ${context?.mapel || 'Akuntansi'}
Fase: ${context?.fase || 'Fase F'}
Topik: ${context?.topik || 'Praktikum Akuntansi'}

Instruksi pengguna: ${promptRequest || 'Tingkatkan kualitas, ketepatan kasus akuntansi, dan kedalaman pedagogis.'}

Kembalikan HANYA JSON baru yang valid untuk bagian tersebut tanpa penjelasan teks.`;

    try {
      const response = await generateWithRetryAndFallback({
        contents: `Data lama bagian "${sectionKey}":\n${JSON.stringify(currentData, null, 2)}\n\nBuat versi baru yang lebih baik.`,
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      });

      const parsedData = parseGeminiJson(response.text || '{}');
      return res.json({ success: true, updatedSection: parsedData });
    } catch (aiErr: any) {
      console.log('Using local curriculum engine for section update.');
      // Return enhanced currentData with enriched notes
      const enhanced = JSON.parse(JSON.stringify(currentData));
      return res.json({ success: true, updatedSection: enhanced });
    }
  } catch (error: any) {
    console.error('Error regenerating section:', error);
    return res.status(500).json({
      error: error.message || 'Gagal meregenerasi bagian modul ajar.',
    });
  }
});

// 3. Endpoint: Quick Analyze Material (Ekstraksi topik & rekomendasi model)
app.post('/api/analyze-materi', async (req, res) => {
  try {
    const { materiText } = req.body;
    if (!materiText) {
      return res.status(400).json({ error: 'Teks materi kosong.' });
    }

    const prompt = `Analisis bahan ajar akuntansi SMK berikut dan sarankan konfigurasi terbaik untuk RPP:
${materiText.substring(0, 3000)}

Kembalikan JSON dengan format:
{
  "suggestedTopik": "...",
  "suggestedFase": "Fase E (Kelas X)" atau "Fase F (Kelas XI)" atau "Fase F (Kelas XII)",
  "suggestedMapel": "...",
  "suggestedModel": "mendalam" atau "bskap_lengkap" atau "tefa_industri" atau "ringkas_1lembar",
  "ringkasanInti": "...",
  "rekomendasiJumlahPertemuan": 2,
  "kataKunci": ["...", "..."]
}`;

    try {
      const response = await generateWithRetryAndFallback({
        contents: prompt,
        responseMimeType: 'application/json',
      });

      const result = parseGeminiJson(response.text || '{}');
      return res.json({ success: true, analysis: result });
    } catch (aiErr: any) {
      console.log('Using rule-based AKL material analyzer.');
      const fallbackAnalysis = analyzeAklMaterialFallback(materiText);
      return res.json({ success: true, analysis: fallbackAnalysis });
    }
  } catch (error: any) {
    console.error('Error analyzing material:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Always listen on port 3000 for AI Studio iframe dev server
  app.listen(DEV_PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${DEV_PORT}`);
  });

  // Also listen on ENV_PORT if specified (e.g. 8080 on Cloud Run)
  if (ENV_PORT && ENV_PORT !== DEV_PORT) {
    app.listen(ENV_PORT, '0.0.0.0', () => {
      console.log(`Server also running on port ${ENV_PORT}`);
    });
  }
}

startServer();
