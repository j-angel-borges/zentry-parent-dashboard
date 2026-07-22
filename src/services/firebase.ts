import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDoc,
} from 'firebase/firestore';
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
} from './mockData';

// REAL Firebase Config for user's GCP/Firebase Project: zentryos
export const firebaseConfig = {
  apiKey: "AIzaSyD36pVBqXzjlxSXmQD0LhVvJpQtvEp1xmk",
  authDomain: "zentryos.firebaseapp.com",
  projectId: "zentryos",
  storageBucket: "zentryos.firebasestorage.app",
  messagingSenderId: "730964985085",
  appId: "1:730964985085:web:e1be19b66ab19966566a94",
  measurementId: "G-X9D970ZWR8"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

type Listener = () => void;

class RealZentryStore {
  private family: Family = INITIAL_FAMILY;
  private children: Child[] = INITIAL_CHILDREN;
  private selectedChildId: string = INITIAL_CHILDREN[0].id;
  private devices: Record<string, Device> = { ...INITIAL_DEVICES };
  private policies: Record<string, Policy> = { ...INITIAL_POLICIES };
  private telemetry: Record<string, TelemetryDaily> = { ...INITIAL_TELEMETRY };
  private commands: Command[] = [];
  private listeners: Set<Listener> = new Set();
  private lastLatencyMs: number | null = null;
  private isLiveConnected: boolean = false;
  private unsubs: Function[] = [];

  constructor() {
    this.initRealFirestore();
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public isConnected(): boolean {
    return this.isLiveConnected;
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
    this.listenToSelectedChildData();
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

  // --- Real Firestore Initialization & Subscriptions ---
  private async initRealFirestore() {
    try {
      const familyRef = doc(db, 'families', this.family.id);
      const familySnap = await getDoc(familyRef);

      // Seed initial schema if first run in Firestore project zentryos
      if (!familySnap.exists()) {
        await setDoc(familyRef, {
          parentUids: this.family.parentUids,
          displayName: this.family.displayName,
          advisorId: this.family.advisorId || 'adv_lima_042',
          plan: this.family.plan,
          createdAt: serverTimestamp(),
        });

        // Seed children
        for (const child of INITIAL_CHILDREN) {
          await setDoc(doc(db, 'families', this.family.id, 'children', child.id), {
            alias: child.alias,
            birthYear: child.birthYear,
            cohort: child.cohort,
            gradeMinedu: child.gradeMinedu,
            activeDeviceId: child.activeDeviceId,
            avatarUrl: child.avatarUrl,
          });
        }

        // Seed policies
        for (const [childId, pol] of Object.entries(INITIAL_POLICIES)) {
          await setDoc(doc(db, 'families', this.family.id, 'policies', pol.id), {
            childId,
            name: pol.name,
            allowedApps: pol.allowedApps,
            dailyLimitMinutes: pol.dailyLimitMinutes,
            schedule: pol.schedule,
            version: pol.version,
            updatedAt: serverTimestamp(),
          });
        }

        // Seed top-level devices
        for (const [devId, dev] of Object.entries(INITIAL_DEVICES)) {
          await setDoc(doc(db, 'devices', devId), {
            familyId: dev.familyId,
            childId: dev.childId,
            model: dev.model,
            osApiLevel: dev.osApiLevel,
            provisioningMode: dev.provisioningMode,
            appVersion: dev.appVersion,
            policyVersion: dev.policyVersion,
            activePolicy: dev.activePolicy,
            lastSeenAt: serverTimestamp(),
            batteryLevel: dev.batteryLevel || 84,
            networkStatus: dev.networkStatus || 'online',
          });
        }
      }

      this.isLiveConnected = true;
      this.notify();

      // Listen to real-time children
      const childrenCol = collection(db, 'families', this.family.id, 'children');
      const unsubChildren = onSnapshot(childrenCol, (snapshot) => {
        const list: Child[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Child);
        });
        if (list.length > 0) {
          this.children = list;
          this.notify();
        }
      });
      this.unsubs.push(unsubChildren);

      this.listenToSelectedChildData();
    } catch (err) {
      console.warn('Firestore initialization or connection:', err);
    }
  }

  private listenToSelectedChildData() {
    const device = this.getActiveDevice();
    if (!device) return;

    // Listen to top-level device document live
    const devRef = doc(db, 'devices', device.id);
    const unsubDevice = onSnapshot(devRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let lastSeenIso = new Date().toISOString();
        if (data.lastSeenAt && data.lastSeenAt.toDate) {
          lastSeenIso = data.lastSeenAt.toDate().toISOString();
        }
        this.devices[device.id] = {
          id: docSnap.id,
          ...data,
          lastSeenAt: lastSeenIso,
        } as Device;
        this.notify();
      }
    });
    this.unsubs.push(unsubDevice);

    // Listen to real-time commands queue: devices/{deviceId}/commands
    const commandsCol = collection(db, 'devices', device.id, 'commands');
    const q = query(commandsCol, orderBy('issuedAt', 'desc'), limit(15));
    const unsubCommands = onSnapshot(q, (snapshot) => {
      const cmds: Command[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const parseIso = (val: any) => (val && val.toDate ? val.toDate().toISOString() : val || null);
        cmds.push({
          id: docSnap.id,
          type: d.type,
          payload: d.payload || {},
          issuedBy: d.issuedBy || 'uid_parent_master',
          issuedAt: parseIso(d.issuedAt) || new Date().toISOString(),
          deliveredAt: parseIso(d.deliveredAt),
          appliedAt: parseIso(d.appliedAt),
          status: d.status || 'pending',
          errorReason: d.errorReason || null,
        });
      });
      this.commands = cmds;
      this.notify();
    });
    this.unsubs.push(unsubCommands);
  }

  // --- Real C&C Command Issuance in Firestore ---
  public async issueCommand(type: CommandType, payload: any = {}): Promise<Command> {
    const startTime = Date.now();
    const device = this.getActiveDevice();
    if (!device) throw new Error('No active device found');

    const commandsCol = collection(db, 'devices', device.id, 'commands');
    
    // Write REAL document to Firestore
    const docRef = await addDoc(commandsCol, {
      type,
      payload,
      issuedBy: this.family.parentUids[0] || 'uid_parent_master',
      issuedAt: serverTimestamp(),
      deliveredAt: null,
      appliedAt: null,
      status: 'pending',
      errorReason: null,
    });

    // Also update the activePolicy desnormalized field in real devices/{deviceId} document
    const devRef = doc(db, 'devices', device.id);
    if (type === 'LOCK_NOW') {
      await updateDoc(devRef, {
        'activePolicy.isLocked': true,
        'activePolicy.lockReason': payload.lockReason || 'Bloqueo manual por el padre',
        lastSeenAt: serverTimestamp(),
      });
    } else if (type === 'UNLOCK') {
      await updateDoc(devRef, {
        'activePolicy.isLocked': false,
        'activePolicy.lockReason': null,
        lastSeenAt: serverTimestamp(),
      });
    }

    const endTime = Date.now();
    this.lastLatencyMs = endTime - startTime;
    this.notify();

    return {
      id: docRef.id,
      type,
      payload,
      issuedBy: this.family.parentUids[0] || 'uid_parent_master',
      issuedAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      appliedAt: new Date().toISOString(),
      status: 'pending',
      errorReason: null,
    };
  }

  // --- Real Policy Updates in Firestore ---
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
      const devRef = doc(db, 'devices', device.id);
      await updateDoc(devRef, {
        policyVersion: newVersion,
        'activePolicy.version': newVersion,
        'activePolicy.allowedApps': newPolicy.allowedApps,
        'activePolicy.dailyLimitMinutes': newPolicy.dailyLimitMinutes,
        lastSeenAt: serverTimestamp(),
      });
    }

    await this.issueCommand('UPDATE_POLICY', { policyVersion: newVersion });
    this.notify();
    return newPolicy;
  }
}

export const zentryRealStore = new RealZentryStore();
