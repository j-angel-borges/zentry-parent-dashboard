import React from 'react';
import { Smartphone, Globe, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallerBanner: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-50/90 via-indigo-50/90 to-cyan-50/90 border border-purple-200/90 backdrop-blur-xl space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
              Venta Directa PWA • Instalación Web Sin Tiendas
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            ¿Cómo instalar la Web App en tu teléfono (iOS o Android)?
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed font-medium">
            Como modelo de venta directa, puedes instalar este Dashboard de control en tu Smartphone en segundos sin pasar por App Store o Google Play.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
        {/* iOS Setup */}
        <div className="p-4 rounded-xl bg-white/90 border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-extrabold text-cyan-800">
            <Smartphone className="w-4 h-4 text-cyan-600" />
            <span>En iPhone / iPad (iOS):</span>
          </div>
          <ol className="space-y-1.5 text-slate-700 pl-4 list-decimal font-medium">
            <li>Abre esta web en Safari.</li>
            <li>
              Toca el botón <strong className="text-slate-900 font-extrabold">Compartir</strong> (<Share2 className="w-3 h-3 inline text-cyan-600" /> en el navegador).
            </li>
            <li>
              Selecciona <strong className="text-slate-900 font-extrabold">"Añadir a la pantalla de inicio"</strong> (<PlusSquare className="w-3 h-3 inline text-cyan-600" />).
            </li>
          </ol>
        </div>

        {/* Android Setup */}
        <div className="p-4 rounded-xl bg-white/90 border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-extrabold text-purple-800">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>En Android (Chrome / Brave):</span>
          </div>
          <ol className="space-y-1.5 text-slate-700 pl-4 list-decimal font-medium">
            <li>Abre esta web en Google Chrome.</li>
            <li>Toca los tres puntos de menú o el banner de instalación.</li>
            <li>
              Selecciona <strong className="text-slate-900 font-extrabold">"Instalar aplicación"</strong> o "Añadir a pantalla principal".
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
