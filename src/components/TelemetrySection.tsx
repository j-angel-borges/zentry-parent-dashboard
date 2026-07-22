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
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
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
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Telemetría Cognitiva y Reporte GCP AI
            </h3>
            <p className="text-xs text-slate-400">
              Procesado en streaming por GCP Pub/Sub & BigQuery • Síntesis Vertex AI Gemini
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          Fecha: {telemetry.date}
        </span>
      </div>

      {/* Top Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total AI Socratic Turns */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-950 border border-purple-800/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Turnos Socráticos IA</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{telemetry.aiTurnCount}</span>
              <span className="text-xs text-purple-300">interacciones</span>
            </div>
          </div>
        </div>

        {/* Completed Challenges */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 border border-indigo-800/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Retos Resueltos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {telemetry.challengeCompletedCount.logic + telemetry.challengeCompletedCount.creative}
              </span>
              <span className="text-xs text-indigo-300">
                ({telemetry.challengeCompletedCount.logic} lógica, {telemetry.challengeCompletedCount.creative} creativo)
              </span>
            </div>
          </div>
        </div>

        {/* Sentiment & Focus Index */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-800/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Índice Cognitivo / Ánimo</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{telemetry.sentimentIndex}%</span>
              <span className="text-xs text-emerald-300 font-semibold">Óptimo / Enfocado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Usage Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Distribución de Tiempo en Pantalla (Minutos)
          </h4>

          <div className="space-y-3 pt-2">
            {appEntries.map(([appName, minutes]) => {
              const percentage = Math.min(100, Math.round((minutes / maxMinutes) * 100));
              return (
                <div key={appName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200">{appName}</span>
                    <span className="text-cyan-300 font-bold">{minutes} min</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
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
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-indigo-950/60 border border-purple-500/30 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Informe Pedagógico Vertex AI (Gemini 2.5)
              </h4>
            </div>

            {/* Topics of Interest */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                Temas de Interés Detectados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {telemetry.aiWeeklySummary.interestTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-200 font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Logical & Mood Patterns */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <strong className="text-indigo-300 block mb-0.5">Comprensión Lógica:</strong>
                <p className="text-slate-300 leading-relaxed">
                  {telemetry.aiWeeklySummary.logicalComprehension}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <strong className="text-emerald-300 block mb-0.5">Patrón de Ánimo y Atención:</strong>
                <p className="text-slate-300 leading-relaxed">
                  {telemetry.aiWeeklySummary.moodAndAnxietyPattern}
                </p>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                Recomendaciones para Padres:
              </span>
              <ul className="space-y-1">
                {telemetry.aiWeeklySummary.recommendedActions.map((act, idx) => (
                  <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
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
