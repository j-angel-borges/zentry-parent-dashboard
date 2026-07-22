import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Download, Check } from 'lucide-react';
import type { Child, Family } from '../types/zentry';

interface HeaderProps {
  family: Family;
  childrenList: Child[];
  selectedChild: Child;
  onSelectChild: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  family,
  childrenList,
  selectedChild,
  onSelectChild,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'Para instalar en iOS o Android:\n\n1. Toca el botón "Compartir" o "Menú" de tu navegador.\n2. Selecciona "Añadir a la pantalla de inicio".'
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-purple-900/30 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Mission Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
                  Zentry<span className="text-purple-400 font-light">OS</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Padres PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                GCP Firestore C&C Conectado • {family.displayName}
              </p>
            </div>
          </div>

          {/* Mobile Child Switcher Trigger */}
          <button
            onClick={handleInstallClick}
            className="md:hidden flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>

        {/* Child Selector & PWA Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
            <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              Menor:
            </span>
            {childrenList.map((child) => {
              const isSelected = child.id === selectedChild.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <img
                    src={child.avatarUrl}
                    alt={child.alias}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span>{child.alias}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    ({child.gradeMinedu})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Install PWA Button */}
          <button
            onClick={handleInstallClick}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
              isInstalled
                ? 'bg-slate-900 border border-emerald-500/30 text-emerald-400 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-purple-900/30 active:scale-95'
            }`}
          >
            {isInstalled ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Web App Instalada</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Instalar Web App (iOS/Android)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
