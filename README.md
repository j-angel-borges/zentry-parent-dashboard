# 🛡️ ZentryOS — Dashboard para Padres (PWA Web App)

[![Live Demo](https://img.shields.io/badge/Vercel-zentry--parent--dashboard.vercel.app-brightgreen?logo=vercel)](https://zentry-parent-dashboard.vercel.app)
[![ZentryOS SSOT](https://img.shields.io/badge/SSOT-zentry--ssot-purple.svg)](https://github.com/j-angel-borges/zentry-ssot)
[![Status](https://img.shields.io/badge/Status-Operational%20PWA-emerald.svg)]()
[![GCP Firestore](https://img.shields.io/badge/Backend-GCP%20Firestore%20C%26C-amber.svg)]()

Consola de Mando Remoto, Telemetría Cognitiva y Gestión de Políticas para el tutor legal en el ecosistema **ZentryOS**. Diseñado como una **Progressive Web App (PWA)** autónoma e instalable directamente en dispositivos **iOS y Android** sin requerir descarga desde tiendas públicas (App Store / Google Play), facilitando el canal de **Venta Directa con Aprovisionamiento en Punto de Venta**.

🌐 **URL de Producción en Vercel**: [https://zentry-parent-dashboard.vercel.app](https://zentry-parent-dashboard.vercel.app)

---

## 🚀 Características Principales

### 1. ⚡ Consola de Mando Remoto (Kill-Switch C&C)
- **Bloqueo/Desbloqueo Instantáneo**: Canal de Comando y Control (C&C) mediante Firebase Firestore con latencia auditada (&lt; 200 ms).
- **Enforcement en Dispositivo**: El cliente nativo en Android (Device Owner) escucha el documento `devices/{deviceId}` y ejecuta `startLockTask()` en tiempo real.
- **Motivo de Bloqueo Personalizable**: Transmite explicaciones pedagógicas (ej. *"Hora de cenar en familia"*, *"Pausa de pantalla"*).

### 2. 🧠 Telemetría Cognitiva y Reporte GCP AI
- **Pipeline Cloud Streaming**: Diseñado para ingestion vía Pub/Sub + almacenamiento analítico en BigQuery.
- **Síntesis Pedagógica Vertex AI (Gemini 2.5)**: Genera resúmenes ejecutivos semanales identificando:
  - *Temas de interés emergentes* (ej: dinosaurios, geometría, ecosistemas).
  - *Nivel de comprensión lógica socrática*.
  - *Patrones de atención y ausencia de ansiedad digital*.
  - *Acciones recomendadas para la crianza*.

### 3. ⚙️ Gestión de Políticas y Allowlist (`setApplicationHidden`)
- **Control de Bloatware**: Gestión visual de apps autorizadas (Google Workspace Docs, Slides, Sheets, Calculadora Socrática, Zentry Kiosk Launcher, Ajustes del Sistema).
- **Presupuesto Diario de Tiempo**: Ajuste de minutos máximos permitidos por menor.
- **Sincronización Monótona de Versión**: Incremento de `policyVersion` para resolución limpia de conflictos.

### 4. 📲 Instalación Directa PWA (Sin Tiendas)
- Soporte nativo manifest standalone en **iOS Safari** y **Android Chrome**.
- Banner interactivo guiando la instalación paso a paso en el Smartphone del padre.

---

## 🏗️ Esquema Firestore (Alineado al SSOT)

La aplicación implementa de forma estricta los esquemas físicos normativos definidos en `02-arquitectura-tecnica/modelo-de-datos-firestore.md` de [zentry-ssot](https://github.com/j-angel-borges/zentry-ssot):

```text
families/{familyId}                          # Cuenta parental (parentUids, plan, displayName)
 ├── children/{childId}                      # Perfil del menor (alias, cohorte, birthYear, gradeMinedu)
 └── policies/{policyId}                     # Política maestra (allowedApps, dailyLimitMinutes, version)

devices/{deviceId}                           # Estado del dispositivo + copia desnormalizada activePolicy
 └── commands/{commandId}                    # Cola C&C auditable (LOCK_NOW, UNLOCK, UPDATE_POLICY)

telemetry_daily/{deviceId}_{yyyyMMdd}        # Contadores diarios y resumen sintético GCP AI
```

---

## 🛠️ Stack Tecnológico

- **Hosting / Deployment**: Vercel (Producción con CI/CD automático desde GitHub)
- **Frontend**: React 19 + TypeScript + Vite 8
- **Estilos**: Tailwind CSS v4 + Glassmorphism Design System (Liquid Glass)
- **Iconografía**: Lucide React
- **PWA**: Web App Manifest + Service Worker (`sw.js`)
- **Backend / Real-time**: Firebase Firestore SDK v9 + GCP Cloud Infrastructure (Pub/Sub & BigQuery)

---

## 📲 Guía de Instalación para Padres / Asesores

1. Ingresa a [https://zentry-parent-dashboard.vercel.app](https://zentry-parent-dashboard.vercel.app) en tu móvil.
2. **En iPhone / iPad (iOS Safari)**: Toca "Compartir" -> "Añadir a la pantalla de inicio".
3. **En Android (Chrome)**: Toca el menú de tres puntos -> "Instalar aplicación".
