import React from 'react';
import { History, CheckCircle2, Clock } from 'lucide-react';
import type { Command } from '../types/zentry';

interface CommandsAuditLogProps {
  commands: Command[];
}

export const CommandsAuditLog: React.FC<CommandsAuditLogProps> = ({ commands }) => {
  return (
    <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Historial de Comandos C&C (Non-Repudiation Audit Log)
            </h3>
            <p className="text-xs text-slate-400">
              Registrado de forma inmutable en Firestore <code className="text-amber-300 font-mono">devices/&#123;deviceId&#125;/commands</code>
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
          {commands.length} registros
        </span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {commands.map((cmd) => {
          const issuedTime = new Date(cmd.issuedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          let statusBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
          if (cmd.status === 'applied') statusBadgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
          if (cmd.status === 'delivered') statusBadgeClass = 'bg-amber-950/80 text-amber-300 border-amber-500/30';
          if (cmd.status === 'pending') statusBadgeClass = 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30 animate-pulse';

          return (
            <div
              key={cmd.id}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {cmd.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${statusBadgeClass}`}>
                    {cmd.status}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {issuedTime}
                  </span>
                </div>

                {cmd.payload?.lockReason && (
                  <p className="text-slate-300 italic">
                    Motivo: "{cmd.payload.lockReason}"
                  </p>
                )}

                <div className="text-[10px] text-slate-400 font-mono">
                  Emisor: <span className="text-slate-300">{cmd.issuedBy}</span>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono text-slate-400">
                {cmd.appliedAt ? (
                  <span className="text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Aplicado en Android DO
                  </span>
                ) : cmd.deliveredAt ? (
                  <span className="text-amber-400">Recibido por dispositivo</span>
                ) : (
                  <span className="text-indigo-400">En cola Firestore...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
