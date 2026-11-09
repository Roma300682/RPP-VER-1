import React from 'react';
import { BookOpen, Sparkles, FolderArchive, HelpCircle, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenDrafts: () => void;
  onOpenHelp: () => void;
  onNew: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrafts, onOpenHelp, onNew, savedCount }) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNew}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">GenRPP AKL</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  SMK Akuntansi
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Generator RPP Kurikulum Merdeka & Pembelajaran Mendalam
              </p>
            </div>
          </div>

          {/* Quick Badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenDrafts}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Lihat RPP yang tersimpan"
            >
              <FolderArchive className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Draf Tersimpan</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenHelp}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Panduan Format dan Kurikulum"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Panduan Format</span>
            </button>

            <button
              onClick={onNew}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat RPP Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
