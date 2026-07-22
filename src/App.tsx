import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KillSwitchCard } from './components/KillSwitchCard';
import { DeviceStatusCard } from './components/DeviceStatusCard';
import { TelemetrySection } from './components/TelemetrySection';
import { PolicyManager } from './components/PolicyManager';
import { CommandsAuditLog } from './components/CommandsAuditLog';
import { PWAInstallerBanner } from './components/PWAInstallerBanner';
import { zentryStore } from './services/zentryStore';
import type { Family, Child, Device, Policy, TelemetryDaily, Command } from './types/zentry';
import { Shield, Sparkles, ExternalLink, Cpu, Layers } from 'lucide-react';

export function App() {
  const [family, setFamily] = useState<Family>(zentryStore.getFamily());
  const [childrenList, setChildrenList] = useState<Child[]>(zentryStore.getChildren());
  const [selectedChild, setSelectedChild] = useState<Child>(zentryStore.getSelectedChild());
  const [device, setDevice] = useState<Device | null>(zentryStore.getActiveDevice());
  const [policy, setPolicy] = useState<Policy | null>(zentryStore.getActivePolicy());
  const [telemetry, setTelemetry] = useState<TelemetryDaily | null>(zentryStore.getActiveTelemetry());
  const [commands, setCommands] = useState<Command[]>(zentryStore.getCommands());
  const [activeTab, setActiveTab] = useState<'control' | 'telemetry' | 'policy' | 'audit'>('control');

  useEffect(() => {
    const updateState = () => {
      setFamily(zentryStore.getFamily());
      setChildrenList(zentryStore.getChildren());
      const child = zentryStore.getSelectedChild();
      setSelectedChild(child);
      setDevice(zentryStore.getActiveDevice());
      setPolicy(zentryStore.getActivePolicy());
      setTelemetry(zentryStore.getActiveTelemetry());
      setCommands([...zentryStore.getCommands()]);
    };

    const unsubscribe = zentryStore.subscribe(updateState);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectChild = (id: string) => {
    zentryStore.setSelectedChildId(id);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Header with Child Selector & PWA Installer */}
      <Header
        family={family}
        childrenList={childrenList}
        selectedChild={selectedChild}
        onSelectChild={handleSelectChild}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-900">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'control'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mando Remoto (Kill-Switch)</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Telemetría GCP AI</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'policy'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Políticas & Allowlist</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Auditoría C&C</span>
          </button>
        </div>

        {/* Tab 1: Control & Kill Switch */}
        {activeTab === 'control' && (
          <div className="space-y-6 animate-fade-in">
            {/* Primary Action Card: Kill Switch */}
            <KillSwitchCard device={device} child={selectedChild} />

            {/* Hardware & Device Owner Status */}
            <DeviceStatusCard device={device} child={selectedChild} />

            {/* Quick Summary of Telemetry */}
            <TelemetrySection telemetry={telemetry} child={selectedChild} />
          </div>
        )}

        {/* Tab 2: Telemetry & Vertex AI Summary */}
        {activeTab === 'telemetry' && (
          <div className="animate-fade-in">
            <TelemetrySection telemetry={telemetry} child={selectedChild} />
          </div>
        )}

        {/* Tab 3: Policy & Allowlist Management */}
        {activeTab === 'policy' && (
          <div className="animate-fade-in">
            <PolicyManager policy={policy} child={selectedChild} device={device} />
          </div>
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="animate-fade-in">
            <CommandsAuditLog commands={commands} />
          </div>
        )}

        {/* PWA Installation Instructions Banner */}
        <PWAInstallerBanner />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>ZentryOS Parent Dashboard • Gobernanza Activa de la Atención</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com/j-angel-borges/zentry-parent-dashboard"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/j-angel-borges/zentry-ssot"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <span>SSOT Canon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span>GCP Firestore & Cloud Pub/Sub Stack • PWA Standalone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
