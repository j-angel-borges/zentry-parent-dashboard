export type CohortType = 'infantil' | 'middle' | 'teen';

export interface Family {
  id: string;
  parentUids: string[];
  displayName: string;
  advisorId?: string;
  plan: 'free' | 'premium' | 'enterprise';
  createdAt: string;
}

export interface Child {
  id: string;
  alias: string;
  birthYear: number;
  cohort: CohortType;
  gradeMinedu: string;
  activeDeviceId?: string;
  avatarUrl?: string;
}

export interface PolicySchedule {
  days: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN')[];
  start: string; // HH:MM
  end: string;   // HH:MM
}

export interface Policy {
  id: string;
  childId: string;
  name: string;
  allowedApps: string[];
  dailyLimitMinutes: number;
  schedule: PolicySchedule[];
  version: number;
  updatedAt: string;
}

export interface ActivePolicy extends Omit<Policy, 'id' | 'childId' | 'name' | 'updatedAt'> {
  isLocked: boolean;
  lockReason: string | null;
  version: number;
}

export interface Device {
  id: string;
  familyId: string;
  childId: string;
  model: string;
  osApiLevel: number;
  provisioningMode: 'qr' | 'adb_lab';
  appVersion: string;
  policyVersion: number;
  activePolicy: ActivePolicy;
  lastSeenAt: string;
  batteryLevel?: number;
  networkStatus?: 'online' | 'offline' | 'grace_period';
}

export type CommandType = 'LOCK_NOW' | 'UNLOCK' | 'UPDATE_POLICY' | 'SYNC_REQUEST';
export type CommandStatus = 'pending' | 'delivered' | 'applied' | 'failed';

export interface Command {
  id: string;
  type: CommandType;
  payload?: {
    lockReason?: string;
    policy?: Partial<Policy>;
    policyVersion?: number;
  };
  issuedBy: string;
  issuedAt: string;
  deliveredAt: string | null;
  appliedAt: string | null;
  status: CommandStatus;
  errorReason: string | null;
}

export interface TelemetryDaily {
  deviceId: string;
  date: string; // YYYY-MM-DD
  appUsageMinutes: Record<string, number>;
  aiTurnCount: number;
  challengeCompletedCount: {
    logic: number;
    creative: number;
    languages?: number;
  };
  policyViolationAttempts: number;
  sentimentIndex: number | null;
  aiWeeklySummary?: {
    interestTopics: string[];
    logicalComprehension: string;
    moodAndAnxietyPattern: string;
    recommendedActions: string[];
  };
  updatedAt: string;
}
