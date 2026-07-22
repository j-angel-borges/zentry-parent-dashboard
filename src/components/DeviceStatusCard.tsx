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
    <div className="rounded-2xl p-6 bg-white/80 border border-slate-200/90 backdrop-blur-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              {device.model}
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-200">
                {device.provisioningMode === 'adb_lab' ? 'ADB Lab' : 'QR Enterprise'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Dispositivo Real Vinculado a {child.alias} • Android API {device.osApiLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Device Owner:</span> Activo (~95%)
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Battery Level (Fidedigno: reads strictly from Firestore or shows --) */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3">
          <BatteryCharging className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Batería Dispositivo</span>
            <span className="text-slate-900 font-extrabold text-sm">
              {device.batteryLevel !== undefined ? `${device.batteryLevel}%` : '-- (Esperando reporte)'}
            </span>
          </div>
        </div>

        {/* Network Status */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3">
          <Wifi className="w-5 h-5 text-cyan-600 flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Conexión Real</span>
            <span className="text-emerald-700 font-extrabold text-xs uppercase">{device.networkStatus}</span>
          </div>
        </div>

        {/* Policy Version */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3">
          <Cpu className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Política Firestore</span>
            <span className="text-purple-700 font-bold text-xs">v{device.policyVersion} Sincronizada</span>
          </div>
        </div>

        {/* Last Heartbeat */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Último Timestamp</span>
            <span className="text-slate-800 font-semibold text-xs">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
