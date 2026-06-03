// =============================================================
//  WeekView (Semana): plan completo Lunes→Domingo + Cerrar semana.
// =============================================================
import { useState } from 'react';
import { ChevronsRight, Moon, TrendingUp, Minus, X, PartyPopper } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { DAYS_ES, unitLabel } from '../constants/config';
import { weekRangeLabel, todayIndex } from '../utils/date';
import SessionCard from '../components/SessionCard';

export default function WeekView() {
  const { state, byDay, completed, total, closeWeek, toggleSession } = useWorkout();
  const { week } = state;
  const today = todayIndex();

  const [summary, setSummary] = useState(null); // cambios tras cerrar semana

  function handleClose() {
    const changes = closeWeek();
    setSummary(changes);
  }

  return (
    <div className="mx-auto max-w-app px-5 pt-10">
      <header className="animate-fade-up">
        <p className="label">Plan de la semana</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">Semana {week.number}</h1>
        <p className="mt-1 text-sm text-muted">{weekRangeLabel(week.startDate)}</p>
      </header>

      {/* Resumen rápido */}
      <div className="card mt-5 flex items-center justify-between p-4">
        <span className="label">Completado</span>
        <span className="font-display font-bold text-soft">
          {completed} / {total} sesiones
        </span>
      </div>

      {/* Lista por días */}
      <div className="mt-6 space-y-5">
        {DAYS_ES.map((dayName, i) => {
          const sessions = byDay[i] || [];
          const isToday = i === today;
          return (
            <section key={i}>
              <div className="mb-2 flex items-center gap-2">
                <h2
                  className={`font-display text-base font-bold ${
                    isToday ? 'text-accent' : 'text-soft'
                  }`}
                >
                  {dayName}
                </h2>
                {isToday && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    Hoy
                  </span>
                )}
              </div>

              {sessions.length === 0 ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-muted">
                  <Moon className="h-4 w-4" /> Descanso
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((s) => (
                    <SessionCard key={s.id} session={s} onToggle={toggleSession} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Cerrar semana */}
      <button
        type="button"
        onClick={handleClose}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 font-bold text-accent transition active:scale-[0.98]"
      >
        <ChevronsRight className="h-5 w-5" />
        Cerrar semana y avanzar
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        El cardio completado subirá un 10% en la próxima semana.
      </p>

      {/* Modal de resumen de progresión */}
      {summary && (
        <ProgressionModal changes={summary} onClose={() => setSummary(null)} weekNumber={week.number} />
      )}
    </div>
  );
}

function ProgressionModal({ changes, onClose, weekNumber }) {
  const increased = changes.filter((c) => c.increased);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm">
      <div className="w-full max-w-app animate-fade-up rounded-t-3xl border border-line bg-surface p-6 pb-10">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15">
              <PartyPopper className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">¡Semana cerrada!</h3>
              <p className="text-xs text-muted">Empieza la semana {weekNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {changes.length === 0 ? (
          <p className="text-sm text-muted">
            No había sesiones de cardio configuradas. ¡A por la siguiente semana de gimnasio!
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted">
              {increased.length > 0
                ? `Has subido el objetivo en ${increased.length} ${
                    increased.length === 1 ? 'tipo de cardio' : 'tipos de cardio'
                  }.`
                : 'Esta vez los objetivos se mantienen. ¡Complétalos para progresar!'}
            </p>
            <ul className="space-y-2">
              {changes.map((c) => (
                <li
                  key={c.key}
                  className="flex items-center justify-between rounded-2xl border border-line bg-surface2 p-3"
                >
                  <span className="text-sm font-semibold text-soft">{c.label}</span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-muted">{unitLabel(c.from, c.unit)}</span>
                    {c.increased ? (
                      <TrendingUp className="h-4 w-4 text-accent" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted" />
                    )}
                    <span className={`font-bold ${c.increased ? 'text-accent' : 'text-soft'}`}>
                      {unitLabel(c.to, c.unit)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-accent px-5 py-4 font-bold text-ink transition active:scale-[0.98]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
