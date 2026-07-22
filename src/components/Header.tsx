import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Download, Check } from 'lucide-react';
import type { Child, Family } from '../types/zentry';

interface HeaderProps {
  family: Family;
  childrenList: Child[];
  selectedChild: Child;
  onSelectChild: (id: string) => void;
  isLiveConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  family,
  childrenList,
  selectedChild,
  onSelectChild,
  isLiveConnected,
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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-slate-200/80 shadow-xs px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Mission Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-sm shadow-purple-500/20">
              <div className="w-full h-full bg-white rounded-[10.5px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Zentry<span className="text-purple-600 font-light">OS</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                  Padres PWA
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                ></span>
                GCP Firestore LIVE (<strong className="text-slate-800">zentryos</strong>) • {family.displayName}
              </p>
            </div>
          </div>

          {/* Mobile Child Switcher Trigger */}
          <button
            onClick={handleInstallClick}
            className="md:hidden flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>

        {/* Child Selector & PWA Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 p-1 rounded-xl">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
              Menor:
            </span>
            {childrenList.map((child) => {
              const isSelected = child.id === selectedChild.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-purple-700 shadow-sm border border-purple-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <img
                    src={child.avatarUrl}
                    alt={child.alias}
                    className="w-5 h-5 rounded-full object-cover border border-slate-200"
                  />
                  <span>{child.alias}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({child.gradeMinedu})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Install PWA Button */}
          <button
            onClick={handleInstallClick}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isInstalled
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-default'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/20 active:scale-95'
            }`}
          >
            {isInstalled ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
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
