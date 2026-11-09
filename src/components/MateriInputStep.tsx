import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Sliders,
  Upload,
  Layers,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import {
  FaseAKL,
  MapelAKL,
  ModelModulAjar,
  IdentitasSekolah,
  KustomisasiFitur,
  GenerateRPPRequest,
  KelompokMapel,
} from '../types/rpp';
import {
  MAPEL_KEJURUAN_OPTIONS,
  MAPEL_UMUM_ADAPTIF,
  MAPEL_PILIHAN_SMK,
  MAPEL_OPTIONS,
  PRESET_MATERIALS,
  AKLPresetMaterial,
} from '../data/aklPresets';

interface MateriInputStepProps {
  onGenerate: (request: GenerateRPPRequest) => void;
  isLoading: boolean;
  identitasSekolah: IdentitasSekolah;
  kustomisasi: KustomisasiFitur;
  onOpenCustomizer: () => void;
}

export const MateriInputStep: React.FC<MateriInputStepProps> = ({
  onGenerate,
  isLoading,
  identitasSekolah,
  kustomisasi,
  onOpenCustomizer,
}) => {
  const [kelompokMapel, setKelompokMapel] = useState<KelompokMapel>('kejuruan');
  const [fase, setFase] = useState<FaseAKL>('Fase F (Kelas XI)');
  const [mapel, setMapel] = useState<MapelAKL>('Akuntansi Keuangan');
  const [isCustomMapel, setIsCustomMapel] = useState(false);
  const [customMapelInput, setCustomMapelInput] = useState('');
  const [topik, setTopik] = useState('Pengelolaan Kas Kecil (Metode Imprest & Fluktuasi)');
  const [materiText, setMateriText] = useState(PRESET_MATERIALS[0].bahanAjar);
  const [model, setModel] = useState<ModelModulAjar>('mendalam');
  const [alokasiPertemuan, setAlokasiPertemuan] = useState<number>(2);
  const [jpPerPertemuan, setJpPerPertemuan] = useState<number>(4);
  const [instruksiKhusus, setInstruksiKhusus] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_MATERIALS[0].id);
  const [presetFilter, setPresetFilter] = useState<'semua' | KelompokMapel>('semua');
  const [modeKecepatan, setModeKecepatan] = useState<'kilat' | 'ai_penuh'>('kilat');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Dynamic progress ticker while loading
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    'Menganalisis materi & mengekstrak konsep pembelajaran...',
    'Menyusun skenario Pembelajaran Mendalam (Memahami, Mengaplikasi, Merefleksi)...',
    'Menyiapkan kasus kontekstual & format kertas kerja LKPD...',
    'Menyusun rubrik asesmen 4 skala & rencana diferensiasi...',
    'Memfinalisasi dokumen modul ajar resmi...',
  ];

  const handleFaseChange = (newFase: FaseAKL) => {
    setFase(newFase);
    if (kelompokMapel === 'kejuruan') {
      const available = MAPEL_KEJURUAN_OPTIONS[newFase];
      if (available && available.length > 0 && !available.includes(mapel)) {
        setMapel(available[0]);
      }
    }
  };

  const handleKelompokChange = (kelompok: KelompokMapel) => {
    setKelompokMapel(kelompok);
    setIsCustomMapel(false);
    if (kelompok === 'kejuruan') {
      const available = MAPEL_KEJURUAN_OPTIONS[fase] || [];
      if (available.length > 0) setMapel(available[0]);
    } else if (kelompok === 'umum_adaptif') {
      setMapel(MAPEL_UMUM_ADAPTIF[0]);
    } else if (kelompok === 'pilihan') {
      // Pilihan typically Fase F
      if (fase === 'Fase E (Kelas X)') setFase('Fase F (Kelas XI)');
      setMapel(MAPEL_PILIHAN_SMK[0]);
    }
  };

  const handleSelectPreset = (preset: AKLPresetMaterial) => {
    setSelectedPresetId(preset.id);
    setKelompokMapel(preset.kelompok);
    setIsCustomMapel(false);
    setFase(preset.fase);
    setMapel(preset.mapel);
    setTopik(preset.topik);
    setMateriText(preset.bahanAjar);
    setAnalysisNote(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setMateriText(content);
        setSelectedPresetId('custom');
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTopik(nameWithoutExt);
      }
    };
    reader.readAsText(file);
  };

  // Quick auto-analyzer using AI
  const handleAnalyzeMateri = async () => {
    if (!materiText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisNote(null);
    try {
      const res = await fetch('/api/analyze-materi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materiText }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        const { suggestedTopik, suggestedFase, suggestedMapel, suggestedModel } = data.analysis;
        if (suggestedTopik) setTopik(suggestedTopik);
        if (suggestedFase) {
          setFase(suggestedFase as FaseAKL);
        }
        if (suggestedMapel) {
          const isUmum = MAPEL_UMUM_ADAPTIF.includes(suggestedMapel);
          const isPilihan = MAPEL_PILIHAN_SMK.includes(suggestedMapel);
          if (isUmum) {
            setKelompokMapel('umum_adaptif');
            setMapel(suggestedMapel);
            setIsCustomMapel(false);
          } else if (isPilihan) {
            setKelompokMapel('pilihan');
            setMapel(suggestedMapel);
            setIsCustomMapel(false);
          } else {
            setKelompokMapel('kejuruan');
            setMapel(suggestedMapel);
            setIsCustomMapel(false);
          }
        }
        if (suggestedModel) {
          setModel(suggestedModel as ModelModulAjar);
        }
        setAnalysisNote(
          `AI menyarankan: Topik "${suggestedTopik}" untuk ${suggestedFase} - ${suggestedMapel}. Model: ${suggestedModel}.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const effectiveMapel = isCustomMapel ? (customMapelInput.trim() || 'Mata Pelajaran Kustom') : mapel;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiText.trim()) {
      setAnalysisNote('Silakan masukkan atau tempelkan materi ajar terlebih dahulu.');
      return;
    }

    onGenerate({
      materiAjarText: materiText,
      topik: topik.trim() || 'Pembelajaran SMK Kurikulum Merdeka',
      fase,
      mapel: effectiveMapel,
      model,
      alokasiPertemuan,
      jpPerPertemuan,
      identitasSekolah,
      kustomisasi,
      instruksiKhusus: instruksiKhusus.trim() || undefined,
      modeKecepatan,
    });
  };

  const filteredPresets =
    presetFilter === 'semua'
      ? PRESET_MATERIALS
      : PRESET_MATERIALS.filter((p) => p.kelompok === presetFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Banner Intro */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <BookOpen className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Kecerdasan Buatan Terkalibrasi Kurikulum Nasional SMK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Generator RPP / Modul Ajar SMK
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
            Cukup tempelkan <strong>Materi atau Bahan Ajar</strong> Anda. AI akan menyusun
            rencana pembelajaran lengkap sesuai pendekatan <em>Pembelajaran Mendalam (Deep Learning)</em>{' '}
            untuk <strong>Kejuruan AKL</strong>, <strong>Mata Pelajaran Umum / Adaptif</strong>, maupun <strong>Mata Pelajaran Pilihan</strong>.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kejuruan AKL (Fase E & F)</span>
            </span>
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Umum / Adaptif & Pilihan</span>
            </span>
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>8 Dimensi Profil Lulusan</span>
            </span>
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>LKPD Kontekstual & Rubrik</span>
            </span>
            <span className="flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor Word & Cetak Resmi</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Input Bahan Ajar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Materi / Bahan Ajar Pembelajaran</span>
              </h2>
              <p className="text-xs text-slate-500 ml-8">
                Tempelkan materi Anda, unggah berkas, atau pilih dari contoh modul siap uji coba di bawah.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Unggah Berkas .txt/.md</span>
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleAnalyzeMateri}
                disabled={isAnalyzing || !materiText.trim()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors disabled:opacity-50"
                title="AI akan membaca isi materi dan menyarankan topik, fase, serta mapel secara tepat"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isAnalyzing ? 'Menganalisis...' : 'Analisis AI'}</span>
              </button>
            </div>
          </div>

          {/* Quick Presets for SMK AKL, Umum/Adaptif, Pilihan */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <label className="text-xs font-bold text-slate-700">
                Pilih Contoh Materi Ajar Praktik SMK (Siap Uji Coba Langsung):
              </label>

              {/* Filter tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPresetFilter('semua')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    presetFilter === 'semua'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({PRESET_MATERIALS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPresetFilter('kejuruan')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    presetFilter === 'kejuruan'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💼 Kejuruan AKL
                </button>
                <button
                  type="button"
                  onClick={() => setPresetFilter('umum_adaptif')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    presetFilter === 'umum_adaptif'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📚 Umum/Adaptif
                </button>
                <button
                  type="button"
                  onClick={() => setPresetFilter('pilihan')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    presetFilter === 'pilihan'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⭐ Pilihan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const badgeColor =
                  preset.kelompok === 'kejuruan'
                    ? 'text-blue-700 bg-blue-50 border-blue-200'
                    : preset.kelompok === 'umum_adaptif'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-purple-700 bg-purple-50 border-purple-200';
                const kelompokLabel =
                  preset.kelompok === 'kejuruan'
                    ? 'Kejuruan'
                    : preset.kelompok === 'umum_adaptif'
                    ? 'Umum/Adaptif'
                    : 'Pilihan';

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${badgeColor}`}
                      >
                        {kelompokLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">{preset.fase.split(' ')[0]}</span>
                    </div>
                    <div className="font-bold text-slate-800 line-clamp-1">{preset.judul}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {preset.mapel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea for Material */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Isi Teks Materi Pembelajaran (Buku Siswa, Diktat Guru, Kasus Praktikum, dsb):
              </label>
              <span className="text-[11px] text-slate-400">
                {materiText.length.toLocaleString('id-ID')} karakter
              </span>
            </div>
            <textarea
              rows={8}
              value={materiText}
              onChange={(e) => {
                setMateriText(e.target.value);
                setSelectedPresetId('custom');
              }}
              placeholder="Tempelkan rangkuman materi akuntansi, jurnal transaksi, prosedur pembukuan, atau materi dari modul ajar Anda di sini..."
              className="w-full px-3.5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs sm:text-sm font-mono leading-relaxed"
              required
            />
          </div>

          {analysisNote && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start space-x-2 text-xs text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <span>{analysisNote}</span>
            </div>
          )}
        </div>

        {/* Step 2: Konfigurasi Pembelajaran Kurikulum Merdeka SMK */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Konfigurasi Kurikulum & Mata Pelajaran SMK</span>
              </h2>
              <p className="text-xs text-slate-500 ml-8">
                Tentukan kelompok mata pelajaran (Kejuruan AKL, Umum / Adaptif, atau Pilihan), fase, dan topik.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kustomisasi Sekolah</span>
            </button>
          </div>

          {/* Kelompok Mata Pelajaran Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Kelompok Mata Pelajaran:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleKelompokChange('kejuruan')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  kelompokMapel === 'kejuruan' && !isCustomMapel
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                  <span>💼</span>
                  <span>Kejuruan AKL</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Konsentrasi Keahlian Akuntansi (Fase E & F)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleKelompokChange('umum_adaptif')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  kelompokMapel === 'umum_adaptif' && !isCustomMapel
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                  <span>📚</span>
                  <span>Umum / Adaptif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Matematika, Informatika, Bahasa, IPAS, dll.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleKelompokChange('pilihan')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  kelompokMapel === 'pilihan' && !isCustomMapel
                    ? 'border-purple-600 bg-purple-50/80 shadow-xs ring-1 ring-purple-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                  <span>⭐</span>
                  <span>Mapel Pilihan</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Audit, Syariah, Analisis Saham, Perpajakan Digital
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomMapel(true)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCustomMapel
                    ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                  <span>✏️</span>
                  <span>Kustom Bebas</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  Ketik nama mata pelajaran apa saja
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Fase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Fase & Jenjang Kelas
              </label>
              <select
                value={fase}
                onChange={(e) => handleFaseChange(e.target.value as FaseAKL)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium text-slate-800 bg-white"
              >
                <option value="Fase E (Kelas X)">Fase E (Kelas X SMK)</option>
                <option value="Fase F (Kelas XI)">Fase F (Kelas XI SMK)</option>
                <option value="Fase F (Kelas XII)">Fase F (Kelas XII SMK)</option>
              </select>
            </div>

            {/* Mata Pelajaran Dropdown or Custom Input */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isCustomMapel
                    ? 'Ketik Nama Mata Pelajaran Kustom'
                    : kelompokMapel === 'kejuruan'
                    ? 'Mata Pelajaran Kejuruan AKL'
                    : kelompokMapel === 'umum_adaptif'
                    ? 'Mata Pelajaran Umum / Adaptif'
                    : 'Mata Pelajaran Pilihan (Fase F SMK)'}
                </label>
                {isCustomMapel ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMapel(false);
                      handleKelompokChange(kelompokMapel);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Kembali ke daftar pilihan baku
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMapel(true);
                      setCustomMapelInput(mapel);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                  >
                    ✏️ Ketik nama lain
                  </button>
                )}
              </div>

              {isCustomMapel ? (
                <input
                  type="text"
                  value={customMapelInput}
                  onChange={(e) => setCustomMapelInput(e.target.value)}
                  placeholder="Contoh: Auditing Forensik, Bahasa Mandarin Bisnis, Aplikasi Pajak Brevet..."
                  className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-slate-800 bg-amber-50/20 font-medium"
                  required
                />
              ) : (
                <select
                  value={mapel}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomMapel(true);
                      setCustomMapelInput('');
                    } else {
                      setMapel(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium text-slate-800 bg-white"
                >
                  {kelompokMapel === 'kejuruan' &&
                    (MAPEL_KEJURUAN_OPTIONS[fase] || []).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}

                  {kelompokMapel === 'umum_adaptif' &&
                    MAPEL_UMUM_ADAPTIF.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}

                  {kelompokMapel === 'pilihan' &&
                    MAPEL_PILIHAN_SMK.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}

                  <option value="__custom__">✏️ + Ketik Mata Pelajaran Lainnya...</option>
                </select>
              )}
            </div>
          </div>

          {/* Topik Pembelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Topik / Elemen Pembelajaran
            </label>
            <input
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Pengelolaan Kas Kecil Metode Imprest / Bunga Majemuk / Analisis Data Transaksi"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800"
              required
            />
          </div>

          {/* Model Modul Ajar (Kustomisasi Model Sesuai Kebutuhan Sekolah) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Model & Format Modul Ajar (Sesuai Kebutuhan Sekolah):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'mendalam',
                  title: 'Pembelajaran Mendalam',
                  sub: 'Deep Learning (Sesuai Template Lampiran)',
                  desc: 'Memahami, Mengaplikasi, Merefleksi dengan 8 Dimensi Profil Lulusan.',
                  badge: 'Rekomendasi',
                },
                {
                  id: 'bskap_lengkap',
                  title: 'Standar BSKAP',
                  sub: 'Modul Ajar Nasional',
                  desc: 'Lengkap dengan Pemahaman Bermakna, Pertanyaan Pemantik, dan Asesmen.',
                  badge: 'Nasional',
                },
                {
                  id: 'tefa_industri',
                  title: 'Teaching Factory (TeFa)',
                  sub: 'Berbasis Industri & KAP',
                  desc: 'Penekanan pada standar operasional kerja akuntansi riil & kemitraan DUDI.',
                  badge: 'Vokasi',
                },
                {
                  id: 'ringkas_1lembar',
                  title: 'Format Ringkas',
                  sub: '1-2 Lembar Efisien',
                  desc: 'Format to the point, padat, dan cepat untuk supervisi pengawas sekolah.',
                  badge: 'Praktis',
                },
              ].map((m) => {
                const isSelected = model === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setModel(m.id as ModelModulAjar)}
                    className={`cursor-pointer p-3.5 rounded-xl border text-xs relative transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{m.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-blue-700 mb-1">{m.sub}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alokasi Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jumlah Pertemuan Tatap Muka
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAlokasiPertemuan(num)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      alokasiPertemuan === num
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {num} Pertemuan
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jam Pelajaran per Pertemuan (JP)
              </label>
              <div className="flex items-center space-x-2">
                {[2, 3, 4, 5, 6].map((jp) => (
                  <button
                    key={jp}
                    type="button"
                    onClick={() => setJpPerPertemuan(jp)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      jpPerPertemuan === jp
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {jp} JP
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total waktu: {alokasiPertemuan} x {jpPerPertemuan} JP ={' '}
                {alokasiPertemuan * jpPerPertemuan * 45} menit
              </p>
            </div>
          </div>

          {/* Instruksi Khusus Opsional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Instruksi Tambahan dari Guru (Opsional)
            </label>
            <input
              type="text"
              value={instruksiKhusus}
              onChange={(e) => setInstruksiKhusus(e.target.value)}
              placeholder="Contoh: Sertakan transaksi bukti memorial dan faktur kredit; gunakan model PjBL kolaboratif dengan aplikasi Spreadsheet..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800"
            />
          </div>

          {/* School Badge Summary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">{identitasSekolah.namaSekolah}</span>
                <span className="mx-1 text-slate-400">•</span>
                <span>Guru: {identitasSekolah.namaGuru}</span>
                <span className="mx-1 text-slate-400">•</span>
                <span>TP: {identitasSekolah.tahunPelajaran}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="text-blue-600 hover:text-blue-800 font-bold underline"
            >
              Ubah Data Sekolah
            </button>
          </div>

          {/* Pilihan Kecepatan Penyusunan */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Kecepatan & Mode Pemrosesan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setModeKecepatan('kilat')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  modeKecepatan === 'kilat'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    modeKecepatan === 'kilat'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      ⚡ Mode Kilat (Instan &lt; 1 Detik)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Langsung menyusun Modul Ajar lengkap berstandar SMK AKL dalam sekejap tanpa menunggu antrean server.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setModeKecepatan('ai_penuh')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  modeKecepatan === 'ai_penuh'
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    modeKecepatan === 'ai_penuh'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      🤖 Mode AI Cerdas (5–10 Detik)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Inferensi mendalam model AI Gemini untuk menghasilkan variasi studi kasus akuntansi baru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA & Progress Area */}
        <div className="flex flex-col items-center justify-center pt-2">
          {isLoading ? (
            <div className="w-full max-w-lg bg-white border border-blue-200 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Sedang Menyusun RPP / Modul Ajar...</span>
                </span>
                <span className="text-blue-700">{Math.min(100, (loadingStep + 1) * 20)}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (loadingStep + 1) * 20)}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 text-center font-medium animate-pulse">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          ) : (
            <>
              <button
                type="submit"
                disabled={isLoading || !materiText.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {modeKecepatan === 'kilat' ? (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>⚡ Susun Modul Ajar Secara Instan (&lt; 1 Detik)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Susun Modul Ajar dengan AI Gemini</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-2.5 text-center">
                {modeKecepatan === 'kilat'
                  ? 'Mode Kilat aktif: Dokumen langsung jadi dalam 1 detik dengan susunan kurikulum SMK AKL lengkap.'
                  : 'Mode AI aktif: Model AI akan memproses teks materi dalam 5–10 detik.'}
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
