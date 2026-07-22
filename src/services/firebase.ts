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
  private telemetry: Record<string, TelemetryDaily> = {};
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

      // Seed single real child & device if doc doesn't exist in Firestore zentryos yet
      if (!familySnap.exists()) {
        await setDoc(familyRef, {
          parentUids: this.family.parentUids,
          displayName: this.family.displayName,
          plan: this.family.plan,
          createdAt: serverTimestamp(),
        });

        // Seed single real child: Mateo
        const mateo = INITIAL_CHILDREN[0];
        await setDoc(doc(db, 'families', this.family.id, 'children', mateo.id), {
          alias: mateo.alias,
          birthYear: mateo.birthYear,
          cohort: mateo.cohort,
          gradeMinedu: mateo.gradeMinedu,
          activeDeviceId: mateo.activeDeviceId,
          avatarUrl: mateo.avatarUrl,
        });

        // Seed policy for Mateo
        const pol = INITIAL_POLICIES['child_mateo_01'];
        await setDoc(doc(db, 'families', this.family.id, 'policies', pol.id), {
          childId: 'child_mateo_01',
          name: pol.name,
          allowedApps: pol.allowedApps,
          dailyLimitMinutes: pol.dailyLimitMinutes,
          schedule: pol.schedule,
          version: pol.version,
          updatedAt: serverTimestamp(),
        });

        // Seed single real device: Redmi 9
        const dev = INITIAL_DEVICES['dev_redmi9_mateo'];
        await setDoc(doc(db, 'devices', 'dev_redmi9_mateo'), {
          familyId: dev.familyId,
          childId: dev.childId,
          model: dev.model,
          osApiLevel: dev.osApiLevel,
          provisioningMode: dev.provisioningMode,
          appVersion: dev.appVersion,
          policyVersion: dev.policyVersion,
          activePolicy: dev.activePolicy,
          lastSeenAt: serverTimestamp(),
          networkStatus: 'online',
        });
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
      console.warn('Firestore initialization or connection error:', err);
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

    // Listen to daily telemetry document if created by device: telemetry_daily/{deviceId}_{YYYYMMDD}
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const telemRef = doc(db, 'telemetry_daily', `${device.id}_${todayStr}`);
    const unsubTelem = onSnapshot(telemRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.telemetry[device.id] = {
          deviceId: device.id,
          date: data.date || todayStr,
          appUsageMinutes: data.appUsageMinutes || {},
          aiTurnCount: data.aiTurnCount || 0,
          challengeCompletedCount: data.challengeCompletedCount || { logic: 0, creative: 0 },
          policyViolationAttempts: data.policyViolationAttempts || 0,
          sentimentIndex: data.sentimentIndex ?? null,
          aiWeeklySummary: data.aiWeeklySummary || undefined,
          updatedAt: new Date().toISOString(),
        };
        this.notify();
      }
    });
    this.unsubs.push(unsubTelem);
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

    // Update activePolicy field in real devices/{deviceId} document
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
      deliveredAt: null,
      appliedAt: null,
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
