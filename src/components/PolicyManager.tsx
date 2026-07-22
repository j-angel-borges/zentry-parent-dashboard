import React, { useState } from 'react';
import { Sliders, AppWindow, Clock, Check, Plus, Save, Sparkles } from 'lucide-react';
import type { Policy, Child, Device } from '../types/zentry';
import { zentryStore } from '../services/zentryStore';

interface PolicyManagerProps {
  policy: Policy | null;
  child: Child;
  device: Device | null;
}

const PRESET_APPS = [
  { name: 'Zentry Kiosk Launcher', pkg: 'com.zentryos.launcher', category: 'Core OS', required: true },
  { name: 'Google Slides', pkg: 'com.google.android.apps.slides', category: 'Workspace', required: false },
  { name: 'Google Docs', pkg: 'com.google.android.apps.docs', category: 'Workspace', required: false },
  { name: 'Google Sheets', pkg: 'com.google.android.apps.sheets', category: 'Workspace', required: false },
  { name: 'Calculadora IA Socrática', pkg: 'com.google.android.calculator', category: 'Educación', required: false },
  { name: 'Ajustes de Sistema', pkg: 'com.android.settings', category: 'Sistema', required: true },
  { name: 'Google Play Store', pkg: 'com.android.vending', category: 'Tienda', required: false },
  { name: 'YouTube Educativo', pkg: 'com.google.android.apps.youtube', category: 'Ocio Regulado', required: false },
];

export const PolicyManager: React.FC<PolicyManagerProps> = ({ policy, child }) => {
  if (!policy) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
        No se encontró política activa para {child.alias}.
      </div>
    );
  }

  const [allowedApps, setAllowedApps] = useState<string[]>([...policy.allowedApps]);
  const [dailyMinutes, setDailyMinutes] = useState<number>(policy.dailyLimitMinutes);
  const [newPkg, setNewPkg] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleApp = (pkg: string) => {
    if (pkg === 'com.zentryos.launcher' || pkg === 'com.android.settings') return; // mandatory
    if (allowedApps.includes(pkg)) {
      setAllowedApps(allowedApps.filter((a) => a !== pkg));
    } else {
      setAllowedApps([...allowedApps, pkg]);
    }
  };

  const handleAddCustomApp = () => {
    if (!newPkg.trim()) return;
    if (!allowedApps.includes(newPkg.trim())) {
      setAllowedApps([...allowedApps, newPkg.trim()]);
    }
    setNewPkg('');
  };

  const handleSavePolicy = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await zentryStore.updatePolicy({
        allowedApps,
        dailyLimitMinutes: dailyMinutes,
      });
      setMessage(`Política v${updated.version} guardada y transmitida a ${child.alias}!`);
    } catch (err: any) {
      setMessage(`Error al actualizar política: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Gestión de Políticas y Allowlist ({child.alias})
            </h3>
            <p className="text-xs text-slate-400">
              Política: <strong className="text-indigo-300">{policy.name}</strong> • Versión actual: <span className="text-cyan-300">v{policy.version}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleSavePolicy}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar y Aplicar Política'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-semibold text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Daily Time Budget */}
      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Presupuesto de Tiempo Diario (Minutos)
          </label>
          <span className="text-sm font-extrabold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
            {dailyMinutes} minutos ({Math.floor(dailyMinutes / 60)}h {dailyMinutes % 60}m)
          </span>
        </div>

        <input
          type="range"
          min="30"
          max="360"
          step="15"
          value={dailyMinutes}
          onChange={(e) => setDailyMinutes(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>30 min (Estricto)</span>
          <span>120 min (Recomendado MINEDU)</span>
          <span>360 min (Máximo)</span>
        </div>
      </div>

      {/* Allowed Applications (Allowlist) */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <AppWindow className="w-4 h-4 text-cyan-400" />
          Lista Blanca de Aplicaciones Autorizadas (setApplicationHidden)
        </h4>

        <p className="text-xs text-slate-400">
          ZentryOS en Device Owner oculta todo el bloatware y juegos no autorizados. Solo las apps seleccionadas a continuación permanecerán visibles y ejecutables.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_APPS.map((app) => {
            const isAllowed = allowedApps.includes(app.pkg);
            return (
              <div
                key={app.pkg}
                onClick={() => toggleApp(app.pkg)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isAllowed
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-white shadow-md shadow-indigo-950/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                } ${app.required ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{app.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {app.category}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    isAllowed
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isAllowed && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom package name */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newPkg}
            onChange={(e) => setNewPkg(e.target.value)}
            placeholder="Añadir paquete personalizado (ej: com.duolingo)"
            className="flex-1 bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 px-4 py-2 rounded-2xl text-xs focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={handleAddCustomApp}
            className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
