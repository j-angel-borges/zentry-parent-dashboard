import type {
  Family,
  Child,
  Device,
  Policy,
  Command,
  TelemetryDaily,
  CommandType,
} from '../types/zentry';
import {
  INITIAL_FAMILY,
  INITIAL_CHILDREN,
  INITIAL_DEVICES,
  INITIAL_POLICIES,
  INITIAL_TELEMETRY,
  INITIAL_COMMANDS,
} from './mockData';

type Listener = () => void;

class ZentryStore {
  private family: Family = INITIAL_FAMILY;
  private children: Child[] = INITIAL_CHILDREN;
  private selectedChildId: string = INITIAL_CHILDREN[0].id;
  private devices: Record<string, Device> = { ...INITIAL_DEVICES };
  private policies: Record<string, Policy> = { ...INITIAL_POLICIES };
  private telemetry: Record<string, TelemetryDaily> = { ...INITIAL_TELEMETRY };
  private commands: Command[] = [...INITIAL_COMMANDS];
  private listeners: Set<Listener> = new Set();
  private lastLatencyMs: number | null = 142; // EVA-06 benchmark default

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getFamily(): Family {
    return this.family;
  }

  public getChildren(): Child[] {
    return this.children;
  }

  public getSelectedChild(): Child {
    return (
      this.children.find((c) => c.id === this.selectedChildId) ||
      this.children[0]
    );
  }

  public setSelectedChildId(childId: string) {
    this.selectedChildId = childId;
    this.notify();
  }

  public getActiveDevice(): Device | null {
    const child = this.getSelectedChild();
    if (!child.activeDeviceId) return null;
    return this.devices[child.activeDeviceId] || null;
  }

  public getActivePolicy(): Policy | null {
    const child = this.getSelectedChild();
    return this.policies[child.id] || null;
  }

  public getActiveTelemetry(): TelemetryDaily | null {
    const device = this.getActiveDevice();
    if (!device) return null;
    return this.telemetry[device.id] || null;
  }

  public getCommands(): Command[] {
    return this.commands;
  }

  public getLastLatencyMs(): number | null {
    return this.lastLatencyMs;
  }

  // --- C&C Actions (Kill Switch, Lock/Unlock) ---
  public async issueCommand(type: CommandType, payload: any = {}): Promise<Command> {
    const startTime = Date.now();
    const device = this.getActiveDevice();
    if (!device) throw new Error('No active device found');

    const newCommand: Command = {
      id: `cmd_${Date.now()}`,
      type,
      payload,
      issuedBy: this.family.parentUids[0] || 'uid_parent_master',
      issuedAt: new Date().toISOString(),
      deliveredAt: null,
      appliedAt: null,
      status: 'pending',
      errorReason: null,
    };

    this.commands = [newCommand, ...this.commands];
    this.notify();

    // Simulate real-time GCP Cloud PubSub -> Firestore -> Device Owner Listener ACK
    return new Promise((resolve) => {
      setTimeout(() => {
        const deliveredTime = new Date().toISOString();
        newCommand.deliveredAt = deliveredTime;
        newCommand.status = 'delivered';

        if (type === 'LOCK_NOW') {
          device.activePolicy.isLocked = true;
          device.activePolicy.lockReason = payload.lockReason || 'Bloqueo manual por el padre';
        } else if (type === 'UNLOCK') {
          device.activePolicy.isLocked = false;
          device.activePolicy.lockReason = null;
        }

        device.lastSeenAt = deliveredTime;
        this.notify();

        setTimeout(() => {
          const appliedTime = new Date().toISOString();
          newCommand.appliedAt = appliedTime;
          newCommand.status = 'applied';

          const endTime = Date.now();
          this.lastLatencyMs = endTime - startTime;
          this.notify();
          resolve(newCommand);
        }, 120);
      }, 180);
    });
  }

  // --- Policy Updates ---
  public async updatePolicy(updatedPolicy: Partial<Policy>): Promise<Policy> {
    const child = this.getSelectedChild();
    const current = this.policies[child.id];
    if (!current) throw new Error('Policy not found');

    const newVersion = current.version + 1;
    const newPolicy: Policy = {
      ...current,
      ...updatedPolicy,
      version: newVersion,
      updatedAt: new Date().toISOString(),
    };

    this.policies[child.id] = newPolicy;

    const device = this.getActiveDevice();
    if (device) {
      device.policyVersion = newVersion;
      device.activePolicy = {
        ...device.activePolicy,
        version: newVersion,
        allowedApps: newPolicy.allowedApps,
        dailyLimitMinutes: newPolicy.dailyLimitMinutes,
        schedule: newPolicy.schedule,
      };
      device.lastSeenAt = new Date().toISOString();
    }

    await this.issueCommand('UPDATE_POLICY', { policyVersion: newVersion });

    this.notify();
    return newPolicy;
  }
}

export const zentryStore = new ZentryStore();
