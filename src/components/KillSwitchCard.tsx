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
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
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
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 border backdrop-blur-2xl shadow-2xl ${
        isLocked
          ? 'bg-gradient-to-br from-rose-950/70 via-slate-950/90 to-red-950/50 border-rose-500/40 shadow-rose-950/40'
          : 'bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950/90 border-indigo-500/30 shadow-indigo-950/30'
      }`}
    >
      {/* Background glow effects */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isLocked ? 'bg-rose-600/20' : 'bg-cyan-500/15'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* State Information */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isLocked
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              {isLocked ? 'ESTADO: BLOQUEADO (LockTask Activo)' : 'ESTADO: LIBRE REGULADO'}
            </span>

            {latency !== null && (
              <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Latencia C&C: <strong className="text-amber-300">{latency}ms</strong>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Kill-Switch Remoto ({child.alias})
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {isLocked ? (
              <>
                El dispositivo <strong className="text-white">{device.model}</strong> está deshabilitado. La pantalla nativa muestra el bloqueo de ZentryOS con motivo:{' '}
                <span className="text-rose-300 italic font-semibold">"{device.activePolicy.lockReason || lockReason}"</span>.
              </>
            ) : (
              <>
                Envía una orden instantánea vía Firebase Firestore. El dispositivo responderá aplicando <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">ZentryPolicyManager.startLockTask()</code> en tiempo real.
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
                className="flex-1 bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 px-4 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <div className="flex items-center gap-1 text-[11px] text-slate-400 px-1">
                <Clock className="w-3 h-3 text-purple-400" />
                Sincronización en &lt; 200ms
              </div>
            </div>
          )}

          {feedback && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-2xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Big Action Button */}
        <div className="w-full lg:w-auto flex flex-col items-center gap-3">
          <button
            onClick={handleToggleLock}
            disabled={loading}
            className={`w-full sm:w-auto min-w-[220px] px-8 py-5 rounded-3xl font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl cursor-pointer ${
              isLocked
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/35'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Transmitiendo orden...</span>
              </>
            ) : isLocked ? (
              <>
                <Unlock className="w-6 h-6" />
                <span>DESBLOQUEAR AHORA</span>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" />
                <span>BLOQUEAR AL INSTANTE</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-400 font-medium">
            Canal C&C Firestore • No-repudio por Parent UID
          </span>
        </div>
      </div>
    </div>
  );
};
