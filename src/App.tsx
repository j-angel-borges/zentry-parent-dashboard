import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KillSwitchCard } from './components/KillSwitchCard';
import { DeviceStatusCard } from './components/DeviceStatusCard';
import { TelemetrySection } from './components/TelemetrySection';
import { PolicyManager } from './components/PolicyManager';
import { CommandsAuditLog } from './components/CommandsAuditLog';
import { PWAInstallerBanner } from './components/PWAInstallerBanner';
import { zentryRealStore } from './services/firebase';
import type { Family, Child, Device, Policy, TelemetryDaily, Command } from './types/zentry';
import { Shield, Sparkles, ExternalLink, Cpu, Layers } from 'lucide-react';

export function App() {
  const [family, setFamily] = useState<Family>(zentryRealStore.getFamily());
  const [childrenList, setChildrenList] = useState<Child[]>(zentryRealStore.getChildren());
  const [selectedChild, setSelectedChild] = useState<Child>(zentryRealStore.getSelectedChild());
  const [device, setDevice] = useState<Device | null>(zentryRealStore.getActiveDevice());
  const [policy, setPolicy] = useState<Policy | null>(zentryRealStore.getActivePolicy());
  const [telemetry, setTelemetry] = useState<TelemetryDaily | null>(zentryRealStore.getActiveTelemetry());
  const [commands, setCommands] = useState<Command[]>(zentryRealStore.getCommands());
  const [activeTab, setActiveTab] = useState<'control' | 'telemetry' | 'policy' | 'audit'>('control');
  const [isConnected, setIsConnected] = useState<boolean>(zentryRealStore.isConnected());

  useEffect(() => {
    const updateState = () => {
      setFamily(zentryRealStore.getFamily());
      setChildrenList(zentryRealStore.getChildren());
      const child = zentryRealStore.getSelectedChild();
      setSelectedChild(child);
      setDevice(zentryRealStore.getActiveDevice());
      setPolicy(zentryRealStore.getActivePolicy());
      setTelemetry(zentryRealStore.getActiveTelemetry());
      setCommands([...zentryRealStore.getCommands()]);
      setIsConnected(zentryRealStore.isConnected());
    };

    const unsubscribe = zentryRealStore.subscribe(updateState);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectChild = (id: string) => {
    zentryRealStore.setSelectedChildId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Header with Child Selector, Real Firestore status & PWA Installer */}
      <Header
        family={family}
        childrenList={childrenList}
        selectedChild={selectedChild}
        onSelectChild={handleSelectChild}
        isLiveConnected={isConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'control'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mando Remoto (Kill-Switch)</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Telemetría GCP AI</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'policy'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Políticas & Allowlist</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
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
      <footer className="mt-12 border-t border-slate-200 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 bg-white/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>ZentryOS Parent Dashboard • GCP Firestore Real (zentryos)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <a
              href="https://github.com/j-angel-borges/zentry-parent-dashboard"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/j-angel-borges/zentry-ssot"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              <span>SSOT Canon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="font-medium text-slate-500">
            <span>GCP Project: zentryos • Live C&C Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
