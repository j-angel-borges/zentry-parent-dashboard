import type { Family, Child, Device, Policy, Command, TelemetryDaily } from '../types/zentry';

export const INITIAL_FAMILY: Family = {
  id: 'fam_quispe_2026',
  parentUids: ['uid_parent_master'],
  displayName: 'Familia Zentry',
  plan: 'premium',
  createdAt: new Date().toISOString(),
};

// Only 1 real child: Mateo
export const INITIAL_CHILDREN: Child[] = [
  {
    id: 'child_mateo_01',
    alias: 'Mateo',
    birthYear: 2017,
    cohort: 'middle',
    gradeMinedu: 'PRIMARIA_4',
    activeDeviceId: 'dev_redmi9_mateo',
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
  },
];

// Single real device: Redmi 9
export const INITIAL_DEVICES: Record<string, Device> = {
  dev_redmi9_mateo: {
    id: 'dev_redmi9_mateo',
    familyId: 'fam_quispe_2026',
    childId: 'child_mateo_01',
    model: 'Xiaomi Redmi 9 (Helio G80)',
    osApiLevel: 30,
    provisioningMode: 'adb_lab',
    appVersion: '1.4.0',
    policyVersion: 1,
    activePolicy: {
      isLocked: false,
      lockReason: null,
      version: 1,
      allowedApps: [
        'com.zentryos.launcher',
        'com.google.android.calculator',
        'com.google.android.apps.docs',
        'com.google.android.apps.slides',
        'com.android.settings',
      ],
      dailyLimitMinutes: 120,
      schedule: [
        {
          days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          start: '07:00',
          end: '20:30',
        },
      ],
    },
    lastSeenAt: new Date().toISOString(),
    batteryLevel: undefined,
    networkStatus: 'online',
  },
};

export const INITIAL_POLICIES: Record<string, Policy> = {
  child_mateo_01: {
    id: 'pol_mateo_01',
    childId: 'child_mateo_01',
    name: 'Política Base Redmi 9',
    allowedApps: [
      'com.zentryos.launcher',
      'com.google.android.calculator',
      'com.google.android.apps.docs',
      'com.google.android.apps.slides',
      'com.android.settings',
    ],
    dailyLimitMinutes: 120,
    schedule: [
      {
        days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        start: '07:00',
        end: '20:30',
      },
    ],
    version: 1,
    updatedAt: new Date().toISOString(),
  },
};

// Pure empty state until real telemetry events arrive from device
export const INITIAL_TELEMETRY: Record<string, TelemetryDaily> = {};

export const INITIAL_COMMANDS: Command[] = [];
