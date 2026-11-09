import { ModulAjarData } from '../types/rpp';

export function exportRppToWord(rpp: ModulAjarData) {
  const { identitas, identifikasi, desainPembelajaran, pengalamanBelajar, asesmenPembelajaran, lampiran, pengesahan, kustomisasi } = rpp;

  // Build meetings HTML
  const meetingsHtml = pengalamanBelajar
    .map(
      (m) => `
    <h3 style="font-size: 13pt; margin-top: 18px; margin-bottom: 6px; color: #1e3a8a;">
      Pertemuan ke-${m.pertemuanKe} (Durasi: ${m.alokasiWaktu}) - Fokus: ${m.fokusMateri}
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" border="1">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="padding: 6px 10px; width: 22%; text-align: left;">Tahap</th>
          <th style="padding: 6px 10px; width: 68%; text-align: left;">Kegiatan Pembelajaran (Berkesadaran, Bermakna, Menggembirakan)</th>
          <th style="padding: 6px 10px; width: 10%; text-align: center;">Waktu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Awal: Salam, Doa, Presensi</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapAwal.salamDoaPresensi}</td>
          <td style="padding: 6px 10px; text-align: center; vertical-align: top;" rowspan="3">${m.tahapAwal.alokasiWaktuMenit} mnt</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Awal: Apersepsi & Pertanyaan Pemantik</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapAwal.apersepsiDanPemantik}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Awal: Tujuan & Ice Breaking</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapAwal.penyampaianTujuanIceBreaking}</td>
        </tr>
        <tr style="background-color: #fafafa;">
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Inti: Memahami (Eksplorasi Konsep)</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapInti.memahami}</td>
          <td style="padding: 6px 10px; text-align: center; vertical-align: top;" rowspan="3">${m.tahapInti.alokasiWaktuMenit} mnt</td>
        </tr>
        <tr style="background-color: #fafafa;">
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Inti: Mengaplikasi (Studi Kasus/Praktik AKL)</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapInti.mengaplikasi}</td>
        </tr>
        <tr style="background-color: #fafafa;">
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Inti: Merefleksi (Konfirmasi & Evaluasi)</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapInti.merefleksi}</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Penutup: Kesimpulan & Refleksi</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapPenutup.kesimpulanDanRefleksi}</td>
          <td style="padding: 6px 10px; text-align: center; vertical-align: top;" rowspan="2">${m.tahapPenutup.alokasiWaktuMenit} mnt</td>
        </tr>
        <tr>
          <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">Penutup: Umpan Balik & Doa</td>
          <td style="padding: 6px 10px; vertical-align: top;">${m.tahapPenutup.umpanBalikTindakLanjutDoa}</td>
        </tr>
      </tbody>
    </table>
  `
    )
    .join('');

  // Rubric HTML
  const rubrikHtml = asesmenPembelajaran.rubrikPenilaian
    .map(
      (r) => `
    <tr>
      <td style="padding: 6px 10px; font-weight: bold; vertical-align: top;">${r.kriteria}</td>
      <td style="padding: 6px 10px; vertical-align: top;">${r.sangatBaik}</td>
      <td style="padding: 6px 10px; vertical-align: top;">${r.baik}</td>
      <td style="padding: 6px 10px; vertical-align: top;">${r.cukup}</td>
      <td style="padding: 6px 10px; vertical-align: top;">${r.perluBimbingan}</td>
    </tr>
  `
    )
    .join('');

  // LKPD table HTML
  const lkpdHeaders = lampiran.lkpd.tabelPengerjaan?.judulKolom || ['No', 'Keterangan', 'Ref', 'Debit (Rp)', 'Kredit (Rp)'];
  const lkpdThHtml = lkpdHeaders.map((h) => `<th style="padding: 6px 8px; border: 1px solid #333; background: #e2e8f0; font-size: 10pt;">${h}</th>`).join('');
  const lkpdRowsHtml = (lampiran.lkpd.tabelPengerjaan?.barisPanduan || [
    ['1', '', '', '', ''],
    ['2', '', '', '', ''],
    ['3', '', '', '', ''],
  ])
    .map(
      (row) => `
    <tr>
      ${row.map((c) => `<td style="padding: 8px 6px; border: 1px solid #333; font-size: 10pt; height: 26px;">${c}</td>`).join('')}
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Modul Ajar SMK AKL - ${identitas.topikPembelajaran}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm 2cm 2cm 2cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.35;
          color: #111827;
        }
        h1, h2, h3, h4 {
          font-family: 'Calibri', 'Arial', sans-serif;
          color: #0f172a;
        }
        .header-title {
          text-align: center;
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .sub-title {
          text-align: center;
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1e3a8a;
        }
        .section-header {
          font-size: 12pt;
          font-weight: bold;
          background-color: #e2e8f0;
          padding: 6px 10px;
          margin-top: 20px;
          margin-bottom: 8px;
          border-left: 4px solid #1e40af;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #94a3b8;
          padding: 6px 10px;
          font-size: 10.5pt;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          text-align: left;
        }
        .checkbox-item {
          display: inline-block;
          margin-right: 14px;
          font-size: 10pt;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
        <div style="font-size: 14pt; font-weight: bold;">${identitas.namaSatuanPendidikan.toUpperCase()}</div>
        <div style="font-size: 11pt; color: #475569;">PROGRAM KEAHLIAN AKUNTANSI DAN KEUANGAN LEMBAGA (AKL)</div>
        <div style="font-size: 10pt; color: #64748b;">Tahun Pelajaran ${identitas.tahunPelajaran}</div>
      </div>

      <div class="header-title">RENCANA PELAKSANAAN PEMBELAJARAN (MODUL AJAR)</div>
      <div class="sub-title">PEMBELAJARAN MENDALAM (KURIKULUM MERDEKA)</div>

      <!-- 1. IDENTITAS -->
      <div class="section-header">1. Identitas Pembelajaran</div>
      <table>
        <tr><td style="width: 32%; font-weight: bold;">Nama Satuan Pendidikan</td><td>${identitas.namaSatuanPendidikan}</td></tr>
        <tr><td style="font-weight: bold;">Nama Guru Mata Pelajaran</td><td>${identitas.namaGuru} ${identitas.nipGuru ? `(NIP: ${identitas.nipGuru})` : ''}</td></tr>
        <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>${identitas.mataPelajaran}</td></tr>
        <tr><td style="font-weight: bold;">Fase / Kelas / Semester</td><td>${identitas.faseKelasSemester}</td></tr>
        <tr><td style="font-weight: bold;">Topik Pembelajaran</td><td>${identitas.topikPembelajaran}</td></tr>
        <tr><td style="font-weight: bold;">Alokasi Waktu</td><td>${identitas.alokasiWaktu}</td></tr>
        <tr><td style="font-weight: bold;">Tahun Pelajaran</td><td>${identitas.tahunPelajaran}</td></tr>
      </table>

      ${
        kustomisasi.tampilkanIdentifikasi
          ? `
      <!-- 2. IDENTIFIKASI -->
      <div class="section-header">2. Identifikasi Pembelajaran Mendalam</div>
      <table>
        <tr><td style="width: 32%; font-weight: bold;">Kesiapan Belajar Murid</td><td>${identifikasi.kesiapanBelajarMurid}</td></tr>
        <tr><td style="font-weight: bold;">Minat dan Gaya Belajar</td><td>${identifikasi.minatDanGayaBelajar}</td></tr>
        <tr><td style="font-weight: bold;">Latar Belakang & Kebutuhan Khusus</td><td>${identifikasi.latarBelakangDanKebutuhanKhusus}</td></tr>
        <tr><td style="font-weight: bold;">Jenis Pengetahuan Materi</td><td>${identifikasi.jenisPengetahuanMateri}</td></tr>
        <tr><td style="font-weight: bold;">Relevansi Kehidupan Nyata / Dunia Kerja AKL</td><td>${identifikasi.relevansiKehidupanNyata}</td></tr>
      </table>

      ${
        kustomisasi.tampilkanProfilLulusan
          ? `
      <div style="margin: 8px 0; font-weight: bold; font-size: 10.5pt;">Dimensi Profil Lulusan / Profil Pelajar Pancasila:</div>
      <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #cbd5e1; margin-bottom: 12px;">
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.keimanan ? '☑' : '☐'} Keimanan dan ketakwaan kepada Tuhan YME</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.kewargaan ? '☑' : '☐'} Kewargaan</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.penalaranKritis ? '☑' : '☐'} Penalaran Kritis</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.kreativitas ? '☑' : '☐'} Kreativitas</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.kolaborasi ? '☑' : '☐'} Kolaborasi</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.kemandirian ? '☑' : '☐'} Kemandirian</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.kesehatan ? '☑' : '☐'} Kesehatan</span>
        <span class="checkbox-item">${identifikasi.dimensiProfilLulusan.komunikasi ? '☑' : '☐'} Komunikasi</span>
        ${identifikasi.dimensiProfilLulusanCatatan ? `<p style="margin-top: 6px; font-size: 10pt; color: #334155;"><strong>Catatan Implementasi:</strong> ${identifikasi.dimensiProfilLulusanCatatan}</p>` : ''}
      </div>
      `
          : ''
      }
      `
          : ''
      }

      <!-- 3. DESAIN PEMBELAJARAN -->
      <div class="section-header">3. Desain Pembelajaran</div>
      <table>
        <tr><td style="width: 32%; font-weight: bold;">Capaian Pembelajaran (CP)</td><td>${desainPembelajaran.capaianPembelajaran}</td></tr>
        ${kustomisasi.tampilkanLintasDisiplin ? `<tr><td style="font-weight: bold;">Lintas Disiplin Ilmu</td><td>${desainPembelajaran.lintasDisiplinIlmu}</td></tr>` : ''}
        <tr><td style="font-weight: bold;">Tujuan Pembelajaran</td><td>
          <ol style="margin: 0; padding-left: 20px;">
            ${desainPembelajaran.tujuanPembelajaran.map((tp) => `<li>${tp}</li>`).join('')}
          </ol>
        </td></tr>
        <tr><td style="font-weight: bold;">Topik Pembelajaran Kontekstual</td><td>${desainPembelajaran.topikPembelajaranKontekstual}</td></tr>
        <tr><td style="font-weight: bold;">Praktik Pedagogis</td><td>${desainPembelajaran.praktikPedagogis}</td></tr>
        ${kustomisasi.tampilkanKemitraanDudi ? `<tr><td style="font-weight: bold;">Kemitraan Pembelajaran (DUDI/KAP)</td><td>${desainPembelajaran.kemitraanPembelajaran}</td></tr>` : ''}
        <tr><td style="font-weight: bold;">Lingkungan Pembelajaran</td><td>${desainPembelajaran.lingkunganPembelajaran}</td></tr>
        ${kustomisasi.tampilkanPemanfaatanDigital ? `<tr><td style="font-weight: bold;">Pemanfaatan Digital (Software AKL)</td><td>${desainPembelajaran.pemanfaatanDigital}</td></tr>` : ''}
      </table>

      <!-- 4. PENGALAMAN BELAJAR -->
      <div class="section-header">4. Pengalaman Belajar (Skenario Pertemuan)</div>
      ${meetingsHtml}

      <!-- 5. ASESMEN PEMBELAJARAN -->
      <div class="section-header">5. Asesmen Pembelajaran</div>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Jenis Asesmen</th>
            <th style="width: 55%;">Teknik dan Instrumen</th>
            <th style="width: 20%;">Waktu Pelaksanaan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: bold;">Asesmen Awal (Diagnostik)</td>
            <td>${asesmenPembelajaran.asesmenAwal.teknikDanInstrumen}</td>
            <td>${asesmenPembelajaran.asesmenAwal.waktuPelaksanaan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Asesmen Proses (Formatif)</td>
            <td>${asesmenPembelajaran.asesmenProses.teknikDanInstrumen}</td>
            <td>${asesmenPembelajaran.asesmenProses.waktuPelaksanaan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Asesmen Akhir (Sumatif)</td>
            <td>${asesmenPembelajaran.asesmenAkhir.teknikDanInstrumen}</td>
            <td>${asesmenPembelajaran.asesmenAkhir.waktuPelaksanaan}</td>
          </tr>
        </tbody>
      </table>

      ${
        kustomisasi.tampilkanRubrikLengkap
          ? `
      <h4 style="font-size: 11pt; margin-top: 14px; margin-bottom: 6px;">Rubrik Penilaian Kompetensi Akuntansi:</h4>
      <table>
        <thead>
          <tr>
            <th style="width: 24%;">Kriteria / Indikator</th>
            <th style="width: 19%;">Sangat Baik (4)</th>
            <th style="width: 19%;">Baik (3)</th>
            <th style="width: 19%;">Cukup (2)</th>
            <th style="width: 19%;">Perlu Bimbingan (1)</th>
          </tr>
        </thead>
        <tbody>
          ${rubrikHtml}
        </tbody>
      </table>
      `
          : ''
      }

      <!-- 6. LAMPIRAN -->
      <div class="page-break"></div>
      <div class="section-header">6. Lampiran Pembelajaran</div>
      
      ${
        kustomisasi.tampilkanLKPD
          ? `
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 16px;">
        <h3 style="font-size: 12pt; font-weight: bold; text-align: center; margin-top: 0; color: #1e3a8a;">
          LEMBAR KERJA PESERTA DIDIK (LKPD)
        </h3>
        <p style="text-align: center; font-weight: bold; font-size: 11pt; margin-bottom: 12px;">${lampiran.lkpd.judul}</p>
        
        <p><strong>Petunjuk Pengerjaan:</strong></p>
        <ol style="margin-top: 0; padding-left: 20px;">
          ${lampiran.lkpd.petunjukPengerjaan.map((p) => `<li>${p}</li>`).join('')}
        </ol>

        <p><strong>Kasus Transaksi / Dokumen Sumber:</strong></p>
        <div style="background: #ffffff; border: 1px dashed #94a3b8; padding: 10px; margin-bottom: 12px; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 10pt;">
${lampiran.lkpd.kasusTransaksi}
        </div>

        <p><strong>Format Lembar Kerja / Kolom Pengerjaan:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;" border="1">
          <thead>
            <tr>${lkpdThHtml}</tr>
          </thead>
          <tbody>
            ${lkpdRowsHtml}
          </tbody>
        </table>

        ${
          lampiran.lkpd.soalAnalisis?.length
            ? `
        <p><strong>Soal Analisis Kritis & Evaluasi:</strong></p>
        <ol style="margin-top: 0; padding-left: 20px;">
          ${lampiran.lkpd.soalAnalisis.map((s) => `<li>${s}</li>`).join('')}
        </ol>
        `
            : ''
        }
      </div>
      `
          : ''
      }

      ${
        kustomisasi.tampilkanBahanBacaan
          ? `
      <h4 style="font-size: 11pt; margin-top: 14px; margin-bottom: 4px;">Bahan Bacaan & Media Ajar Ringkas:</h4>
      <div style="background-color: #ffffff; border: 1px solid #cbd5e1; padding: 10px; font-size: 10pt; line-height: 1.4; white-space: pre-wrap; margin-bottom: 15px;">
${lampiran.bahanBacaanMateri}
      </div>
      `
          : ''
      }

      ${
        kustomisasi.tampilkanDiferensiasi
          ? `
      <h4 style="font-size: 11pt; margin-top: 14px; margin-bottom: 4px;">Rencana Pembelajaran Berdiferensiasi:</h4>
      <table>
        <tr><td style="width: 25%; font-weight: bold;">Diferensiasi Konten</td><td>${lampiran.diferensiasi.konten}</td></tr>
        <tr><td style="font-weight: bold;">Diferensiasi Proses</td><td>${lampiran.diferensiasi.proses}</td></tr>
        <tr><td style="font-weight: bold;">Diferensiasi Produk</td><td>${lampiran.diferensiasi.produk}</td></tr>
      </table>
      `
          : ''
      }

      <!-- PENGESAHAN -->
      ${
        kustomisasi.tampilkanPengesahan
          ? `
      <div style="margin-top: 30px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 50%; border: none; text-align: left; vertical-align: top;">
              Mengetahui,<br>
              Kepala Sekolah<br><br><br><br>
              <strong><u>${pengesahan.namaKepalaSekolah}</u></strong><br>
              NIP. ${pengesahan.nipKepalaSekolah}
            </td>
            <td style="width: 50%; border: none; text-align: left; vertical-align: top;">
              ${pengesahan.tempatTitimangsa}<br>
              Guru Mata Pelajaran<br><br><br><br>
              <strong><u>${pengesahan.namaGuru}</u></strong><br>
              NIP. ${pengesahan.nipGuru}
            </td>
          </tr>
        </table>
      </div>
      `
          : ''
      }
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `RPP_AKL_${identitas.topikPembelajaran.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_${identitas.faseKelasSemester.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
