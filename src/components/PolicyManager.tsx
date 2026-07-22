import React, { useState } from 'react';
import { Sliders, AppWindow, Clock, Check, Plus, Save, Sparkles } from 'lucide-react';
import type { Policy, Child, Device } from '../types/zentry';
import { zentryRealStore } from '../services/firebase';

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
      <div className="p-6 rounded-2xl bg-white/80 border border-slate-200 text-center text-slate-500 font-medium">
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
    if (pkg === 'com.zentryos.launcher' || pkg === 'com.android.settings') return;
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
      const updated = await zentryRealStore.updatePolicy({
        allowedApps,
        dailyLimitMinutes: dailyMinutes,
      });
      setMessage(`Política v${updated.version} actualizada en Firestore real (zentryos) para ${child.alias}!`);
    } catch (err: any) {
      setMessage(`Error al actualizar política en Firestore: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-white/80 border border-slate-200/90 backdrop-blur-xl space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Gestión de Políticas y Allowlist ({child.alias})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Política: <strong className="text-indigo-800 font-bold">{policy.name}</strong> • Versión actual: <span className="text-purple-700 font-bold">v{policy.version}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleSavePolicy}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar y Aplicar Política'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Daily Time Budget */}
      <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Presupuesto de Tiempo Diario (Minutos)
          </label>
          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-200">
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
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
          <span>30 min (Estricto)</span>
          <span>120 min (Recomendado MINEDU)</span>
          <span>360 min (Máximo)</span>
        </div>
      </div>

      {/* Allowed Applications (Allowlist) */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <AppWindow className="w-4 h-4 text-cyan-600" />
          Lista Blanca de Aplicaciones Autorizadas (setApplicationHidden)
        </h4>

        <p className="text-xs text-slate-500 font-medium">
          ZentryOS en Device Owner oculta todo el bloatware y juegos no autorizados. Solo las apps seleccionadas a continuación permanecerán visibles y ejecutables.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_APPS.map((app) => {
            const isAllowed = allowedApps.includes(app.pkg);
            return (
              <div
                key={app.pkg}
                onClick={() => toggleApp(app.pkg)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isAllowed
                    ? 'bg-indigo-50/70 border-indigo-300 text-slate-900 shadow-2xs font-bold'
                    : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300 font-medium'
                } ${app.required ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{app.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {app.category}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    isAllowed
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
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
            className="flex-1 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-600 font-mono"
          />
          <button
            onClick={handleAddCustomApp}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
