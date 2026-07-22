import React, { useState } from 'react';
import { Lock, Unlock, Zap, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import type { Device, Child } from '../types/zentry';
import { zentryStore } from '../services/zentryStore';

interface KillSwitchCardProps {
  device: Device | null;
  child: Child;
}

export const KillSwitchCard: React.FC<KillSwitchCardProps> = ({ device, child }) => {
  const [lockReason, setLockReason] = useState('Hora de cenar en familia');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="p-6 rounded-2xl bg-white/80 border border-slate-200 text-center text-slate-500 font-medium">
        No hay dispositivo activo configurado para {child.alias}.
      </div>
    );
  }

  const isLocked = device.activePolicy.isLocked;
  const latency = zentryStore.getLastLatencyMs();

  const handleToggleLock = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      if (isLocked) {
        await zentryStore.issueCommand('UNLOCK', {});
        setFeedback('Dispositivo desbloqueado al instante vía Firestore C&C');
      } else {
        await zentryStore.issueCommand('LOCK_NOW', { lockReason });
        setFeedback(`Dispositivo bloqueado inmediatamente: "${lockReason}"`);
      }
    } catch (err: any) {
      setFeedback(`Error al emitir comando: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300 border backdrop-blur-2xl shadow-sm ${
        isLocked
          ? 'bg-gradient-to-br from-rose-50/90 via-white/95 to-red-50/80 border-rose-200 shadow-rose-500/10'
          : 'bg-gradient-to-br from-white/90 via-purple-50/50 to-indigo-50/70 border-indigo-200/80 shadow-indigo-500/10'
      }`}
    >
      {/* Soft Light Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isLocked ? 'bg-rose-400/15' : 'bg-purple-400/15'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* State Information */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider border ${
                isLocked
                  ? 'bg-rose-100/90 text-rose-700 border-rose-300'
                  : 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLocked ? 'bg-rose-600 animate-ping' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              {isLocked ? 'ESTADO: BLOQUEADO (LockTask Activo)' : 'ESTADO: LIBRE REGULADO'}
            </span>

            {latency !== null && (
              <span className="text-xs text-slate-600 flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Latencia C&C: <strong className="text-slate-900">{latency}ms</strong>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Kill-Switch Remoto ({child.alias})
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {isLocked ? (
              <>
                El dispositivo <strong className="text-slate-900">{device.model}</strong> está deshabilitado. La pantalla nativa muestra el bloqueo de ZentryOS con motivo:{' '}
                <span className="text-rose-700 italic font-semibold">"{device.activePolicy.lockReason || lockReason}"</span>.
              </>
            ) : (
              <>
                Envía una orden instantánea vía Firebase Firestore. El dispositivo responderá aplicando <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-mono text-xs border border-purple-100">ZentryPolicyManager.startLockTask()</code> en tiempo real.
              </>
            )}
          </p>

          {!isLocked && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <input
                type="text"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="Motivo del bloqueo (ej: Hora de cenar, Tarea finalizada)"
                className="flex-1 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
              />
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium px-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Sincronización en &lt; 200ms
              </div>
            </div>
          )}

          {feedback && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Big Action Button */}
        <div className="w-full lg:w-auto flex flex-col items-center gap-2.5">
          <button
            onClick={handleToggleLock}
            disabled={loading}
            className={`w-full sm:w-auto min-w-[220px] px-8 py-4.5 rounded-xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-200 transform active:scale-95 shadow-md cursor-pointer ${
              isLocked
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-600/20'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Transmitiendo orden...</span>
              </>
            ) : isLocked ? (
              <>
                <Unlock className="w-5 h-5" />
                <span>DESBLOQUEAR AHORA</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>BLOQUEAR AL INSTANTE</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-500 font-semibold">
            Canal C&C Firestore • No-repudio por Parent UID
          </span>
        </div>
      </div>
    </div>
  );
};
