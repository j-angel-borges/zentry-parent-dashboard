import React from 'react';
import { Smartphone, Globe, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallerBanner: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/90 border border-purple-500/30 backdrop-blur-xl space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Venta Directa PWA • Instalación Web Sin Tiendas
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            ¿Cómo instalar la Web App en tu teléfono (iOS o Android)?
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Como modelo de venta directa, puedes instalar este Dashboard de control en tu Smartphone en segundos sin pasar por App Store o Google Play.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
        {/* iOS Setup */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-cyan-300">
            <Smartphone className="w-4 h-4" />
            <span>En iPhone / iPad (iOS):</span>
          </div>
          <ol className="space-y-1.5 text-slate-300 pl-4 list-decimal">
            <li>Abre esta web en Safari.</li>
            <li>
              Toca el botón <strong className="text-white">Compartir</strong> (<Share2 className="w-3 h-3 inline text-cyan-400" /> en el navegador).
            </li>
            <li>
              Selecciona <strong className="text-white">"Añadir a la pantalla de inicio"</strong> (<PlusSquare className="w-3 h-3 inline text-cyan-400" />).
            </li>
          </ol>
        </div>

        {/* Android Setup */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-purple-300">
            <Globe className="w-4 h-4" />
            <span>En Android (Chrome / Brave):</span>
          </div>
          <ol className="space-y-1.5 text-slate-300 pl-4 list-decimal">
            <li>Abre esta web en Google Chrome.</li>
            <li>Toca los tres puntos de menú o el banner de instalación.</li>
            <li>
              Selecciona <strong className="text-white">"Instalar aplicación"</strong> o "Añadir a pantalla principal".
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
