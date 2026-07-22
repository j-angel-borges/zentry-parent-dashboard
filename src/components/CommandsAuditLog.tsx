import React from 'react';
import { History, CheckCircle2, Clock } from 'lucide-react';
import type { Command } from '../types/zentry';

interface CommandsAuditLogProps {
  commands: Command[];
}

export const CommandsAuditLog: React.FC<CommandsAuditLogProps> = ({ commands }) => {
  return (
    <div className="rounded-2xl p-6 bg-white/80 border border-slate-200/90 backdrop-blur-xl space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Historial de Comandos C&C (Non-Repudiation Audit Log)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Registrado de forma inmutable en Firestore <code className="text-amber-800 font-mono font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-200">devices/&#123;deviceId&#125;/commands</code>
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-200">
          {commands.length} registros
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {commands.map((cmd) => {
          const issuedTime = new Date(cmd.issuedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
          if (cmd.status === 'applied') statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          if (cmd.status === 'delivered') statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
          if (cmd.status === 'pending') statusBadgeClass = 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';

          return (
            <div
              key={cmd.id}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {cmd.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px] border ${statusBadgeClass}`}>
                    {cmd.status}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {issuedTime}
                  </span>
                </div>

                {cmd.payload?.lockReason && (
                  <p className="text-slate-700 italic font-medium">
                    Motivo: "{cmd.payload.lockReason}"
                  </p>
                )}

                <div className="text-[10px] text-slate-500 font-mono">
                  Emisor: <span className="text-slate-800 font-bold">{cmd.issuedBy}</span>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono text-slate-500">
                {cmd.appliedAt ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Aplicado en Android DO
                  </span>
                ) : cmd.deliveredAt ? (
                  <span className="text-amber-700 font-bold">Recibido por dispositivo</span>
                ) : (
                  <span className="text-indigo-700 font-bold">En cola Firestore...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
