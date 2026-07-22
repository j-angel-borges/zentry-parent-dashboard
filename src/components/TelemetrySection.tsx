import React from 'react';
import { BrainCircuit, Sparkles, Clock, Heart, Award, CheckCircle2 } from 'lucide-react';
import type { TelemetryDaily, Child } from '../types/zentry';

interface TelemetrySectionProps {
  telemetry: TelemetryDaily | null;
  child: Child;
}

export const TelemetrySection: React.FC<TelemetrySectionProps> = ({ telemetry, child }) => {
  if (!telemetry) {
    return (
      <div className="p-8 rounded-2xl bg-white/80 border border-slate-200 text-center text-slate-500 font-medium">
        No hay datos de telemetría registrados hoy para {child.alias}.
      </div>
    );
  }

  const appEntries = Object.entries(telemetry.appUsageMinutes);
  const maxMinutes = Math.max(...Object.values(telemetry.appUsageMinutes), 60);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Telemetría Cognitiva y Reporte GCP AI
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Procesado en streaming por GCP Pub/Sub & BigQuery • Síntesis Vertex AI Gemini
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
          Fecha: {telemetry.date}
        </span>
      </div>

      {/* Top Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total AI Socratic Turns */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 border border-purple-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Turnos Socráticos IA</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{telemetry.aiTurnCount}</span>
              <span className="text-xs font-semibold text-purple-700">interacciones</span>
            </div>
          </div>
        </div>

        {/* Completed Challenges */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Retos Resueltos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {telemetry.challengeCompletedCount.logic + telemetry.challengeCompletedCount.creative}
              </span>
              <span className="text-xs font-semibold text-indigo-700">
                ({telemetry.challengeCompletedCount.logic} lógica, {telemetry.challengeCompletedCount.creative} creativo)
              </span>
            </div>
          </div>
        </div>

        {/* Sentiment & Focus Index */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border border-emerald-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Índice Cognitivo / Ánimo</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700">{telemetry.sentimentIndex}%</span>
              <span className="text-xs text-emerald-800 font-bold">Óptimo / Enfocado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Usage Distribution */}
        <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/90 backdrop-blur-xl space-y-4 shadow-xs">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            Distribución de Tiempo en Pantalla (Minutos)
          </h4>

          <div className="space-y-3.5 pt-2">
            {appEntries.map(([appName, minutes]) => {
              const percentage = Math.min(100, Math.round((minutes / maxMinutes) * 100));
              return (
                <div key={appName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{appName}</span>
                    <span className="text-indigo-700">{minutes} min</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertex AI Weekly Cognitive Summary Card */}
        {telemetry.aiWeeklySummary && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/90 via-white/95 to-indigo-50/90 border border-purple-200/90 backdrop-blur-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Informe Pedagógico Vertex AI (Gemini 2.5)
              </h4>
            </div>

            {/* Topics of Interest */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                Temas de Interés Detectados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {telemetry.aiWeeklySummary.interestTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-purple-100/80 border border-purple-200 text-purple-800 font-bold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Logical & Mood Patterns */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <strong className="text-indigo-800 block mb-0.5 font-bold">Comprensión Lógica:</strong>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {telemetry.aiWeeklySummary.logicalComprehension}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <strong className="text-emerald-800 block mb-0.5 font-bold">Patrón de Ánimo y Atención:</strong>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {telemetry.aiWeeklySummary.moodAndAnxietyPattern}
                </p>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                Recomendaciones para Padres:
              </span>
              <ul className="space-y-1">
                {telemetry.aiWeeklySummary.recommendedActions.map((act, idx) => (
                  <li key={idx} className="text-xs text-slate-800 font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
