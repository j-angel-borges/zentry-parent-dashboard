import type { Family, Child, Device, Policy, Command, TelemetryDaily } from '../types/zentry';

export const INITIAL_FAMILY: Family = {
  id: 'fam_quispe_2026',
  parentUids: ['uid_parent_juan_01', 'uid_parent_maria_02'],
  displayName: 'Familia Quispe',
  advisorId: 'adv_lima_042',
  plan: 'premium',
  createdAt: '2026-05-15T10:00:00Z',
};

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
  {
    id: 'child_sofia_02',
    alias: 'Sofía',
    birthYear: 2012,
    cohort: 'teen',
    gradeMinedu: 'SECUNDARIA_2',
    activeDeviceId: 'dev_note12_sofia',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_DEVICES: Record<string, Device> = {
  dev_redmi9_mateo: {
    id: 'dev_redmi9_mateo',
    familyId: 'fam_quispe_2026',
    childId: 'child_mateo_01',
    model: 'Xiaomi Redmi 9 (Helio G80)',
    osApiLevel: 30,
    provisioningMode: 'adb_lab',
    appVersion: '1.4.0',
    policyVersion: 12,
    activePolicy: {
      isLocked: false,
      lockReason: null,
      version: 12,
      allowedApps: [
        'com.zentryos.launcher',
        'com.google.android.calculator',
        'com.google.android.apps.docs',
        'com.google.android.apps.slides',
        'com.google.android.apps.sheets',
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
    batteryLevel: 84,
    networkStatus: 'online',
  },
  dev_note12_sofia: {
    id: 'dev_note12_sofia',
    familyId: 'fam_quispe_2026',
    childId: 'child_sofia_02',
    model: 'Xiaomi Redmi Note 12',
    osApiLevel: 33,
    provisioningMode: 'qr',
    appVersion: '1.4.0',
    policyVersion: 15,
    activePolicy: {
      isLocked: false,
      lockReason: null,
      version: 15,
      allowedApps: [
        'com.zentryos.launcher',
        'com.google.android.calculator',
        'com.google.android.apps.docs',
        'com.google.android.apps.slides',
        'com.google.android.apps.sheets',
        'com.google.android.apps.youtube',
        'com.android.settings',
      ],
      dailyLimitMinutes: 180,
      schedule: [
        {
          days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          start: '06:30',
          end: '21:30',
        },
      ],
    },
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    batteryLevel: 62,
    networkStatus: 'online',
  },
};

export const INITIAL_POLICIES: Record<string, Policy> = {
  child_mateo_01: {
    id: 'pol_mateo_01',
    childId: 'child_mateo_01',
    name: 'Semana Escolar Mateo',
    allowedApps: [
      'com.zentryos.launcher',
      'com.google.android.calculator',
      'com.google.android.apps.docs',
      'com.google.android.apps.slides',
      'com.google.android.apps.sheets',
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
    version: 12,
    updatedAt: '2026-07-21T18:30:00Z',
  },
  child_sofia_02: {
    id: 'pol_sofia_02',
    childId: 'child_sofia_02',
    name: 'Modo Enfoque Secundaria',
    allowedApps: [
      'com.zentryos.launcher',
      'com.google.android.calculator',
      'com.google.android.apps.docs',
      'com.google.android.apps.slides',
      'com.google.android.apps.sheets',
      'com.google.android.apps.youtube',
      'com.android.settings',
    ],
    dailyLimitMinutes: 180,
    schedule: [
      {
        days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        start: '06:30',
        end: '21:30',
      },
    ],
    version: 15,
    updatedAt: '2026-07-22T08:15:00Z',
  },
};

export const INITIAL_TELEMETRY: Record<string, TelemetryDaily> = {
  dev_redmi9_mateo: {
    deviceId: 'dev_redmi9_mateo',
    date: new Date().toISOString().split('T')[0],
    appUsageMinutes: {
      'Google Workspace (Slides/Docs)': 48,
      'Zentry Study Assistant': 35,
      'Calculadora IA Socrática': 18,
      'Ajustes del Sistema': 4,
    },
    aiTurnCount: 42,
    challengeCompletedCount: {
      logic: 3,
      creative: 2,
      languages: 1,
    },
    policyViolationAttempts: 0,
    sentimentIndex: 92,
    aiWeeklySummary: {
      interestTopics: [
        'Dinosaurios del Cretácico y Paleontología',
        'Fracciones y Geometría en la Calculadora-Chat',
        'Ecosistemas de la Selva Central del Perú',
      ],
      logicalComprehension:
        'Excelente comprensión en el método socrático. Mateo formuló 8 preguntas autónomas para desglosar su tarea de ciencias sin pedir soluciones directas.',
      moodAndAnxietyPattern:
        'Atención sostenida con cero signos de ansiedad digital. El temporizador circadiano ayudó a pausar el uso antes de la cena.',
      recommendedActions: [
        'Recompensar con 20 min extras de lectura o dibujo por cumplir retos lógicos.',
        'Explorar un libro interactivo sobre Paleontología en Google Slides.',
      ],
    },
    updatedAt: new Date().toISOString(),
  },
  dev_note12_sofia: {
    deviceId: 'dev_note12_sofia',
    date: new Date().toISOString().split('T')[0],
    appUsageMinutes: {
      'Google Workspace (Docs/Sheets)': 65,
      'Zentry Study Assistant': 50,
      'YouTube (Canales Educativos)': 40,
      'Calculadora Avanzada': 15,
    },
    aiTurnCount: 58,
    challengeCompletedCount: {
      logic: 5,
      creative: 3,
      languages: 4,
    },
    policyViolationAttempts: 0,
    sentimentIndex: 88,
    aiWeeklySummary: {
      interestTopics: [
        'Álgebra Lineal y Trigonometría',
        'Redacción de Ensayos en Google Docs',
        'Historia del Perú del Siglo XIX',
      ],
      logicalComprehension:
        'Alto desempeño analítico. Sofía completó 5 retos avanzados en el asistente de estudio.',
      moodAndAnxietyPattern:
        'Nivel óptimo de concentración en modo enfoque. Interacción muy constructiva.',
      recommendedActions: [
        'Mantener el horario de descanso acordado de 21:30.',
        'Sugerir consulta en NotebookLM para resúmenes de historia.',
      ],
    },
    updatedAt: new Date().toISOString(),
  },
};

export const INITIAL_COMMANDS: Command[] = [
  {
    id: 'cmd_1001',
    type: 'LOCK_NOW',
    payload: { lockReason: 'Hora de cenar en familia' },
    issuedBy: 'uid_parent_juan_01',
    issuedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 44 - 800).toISOString(),
    appliedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    status: 'applied',
    errorReason: null,
  },
  {
    id: 'cmd_1002',
    type: 'UNLOCK',
    payload: {},
    issuedBy: 'uid_parent_juan_01',
    issuedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 14 - 900).toISOString(),
    appliedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    status: 'applied',
    errorReason: null,
  },
];
