import React from 'react';
import { Smartphone, BatteryCharging, Wifi, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import type { Device, Child } from '../types/zentry';

interface DeviceStatusCardProps {
  device: Device | null;
  child: Child;
}

export const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ device, child }) => {
  if (!device) return null;

  const formattedTime = new Date(device.lastSeenAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {device.model}
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {device.provisioningMode === 'adb_lab' ? 'ADB Lab' : 'QR Enterprise'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Dispositivo Vinculado a {child.alias} • Android API {device.osApiLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Device Owner:</span> Activo (~95%)
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Battery */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
          <BatteryCharging className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Batería</span>
            <span className="text-white font-extrabold text-sm">{device.batteryLevel}%</span>
          </div>
        </div>

        {/* Network Status */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
          <Wifi className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Conexión</span>
            <span className="text-emerald-400 font-extrabold text-xs uppercase">{device.networkStatus}</span>
          </div>
        </div>

        {/* Policy Version */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
          <Cpu className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Política v{device.policyVersion}</span>
            <span className="text-purple-300 font-semibold text-xs">Sincronizada</span>
          </div>
        </div>

        {/* Last Heartbeat */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Último Latido</span>
            <span className="text-slate-200 font-medium text-xs">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
