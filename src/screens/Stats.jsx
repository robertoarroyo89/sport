// =============================================================
//  Stats (Progreso): objetivos actuales, evolución e historial.
// =============================================================
import { TrendingUp, Trophy, History as HistoryIcon, Dumbbell } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { CARDIO_TYPES, CARDIO_ORDER, unitLabel } from '../constants/config';
import { weekRangeLabel } from '../utils/date';
import { CARDIO_ICON } from '../components/icons';

export default function Stats() {
  const { state } = useWorkout();
  const { profile, week, history } = state;

  // Total de sesiones completadas en todo el historial + semana actual
  const historyCompleted = history.reduce((acc, w) => acc + w.completedCount, 0);
  const currentCompleted = week.sessions.filter((s) => s.completed).length;
  const totalCompleted = historyCompleted + currentCompleted;

  const activeCardio = CARDIO_ORDER.filter((k) => profile.cardio?.[k]?.enabled);

  return (
    <div className="mx-auto max-w-app px-5 pt-10">
      <header className="animate-fade-up">
        <p className="label">Tu evolución</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">Progreso</h1>
      </header>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatTile
          icon={<Trophy className="h-5 w-5 text-accent" />}
          value={history.length}
          label={history.length === 1 ? 'Semana cerrada' : 'Semanas cerradas'}
        />
        <StatTile
          icon={<Dumbbell className="h-5 w-5 text-accent" />}
          value={totalCompleted}
          label="Sesiones completadas"
        />
      </div>

      {/* Objetivos actuales de cardio */}
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
          <TrendingUp className="h-5 w-5 text-cardio" />
          Objetivos de cardio
        </h2>
        {activeCardio.length === 0 ? (
          <p className="card p-5 text-sm text-muted">No tienes cardio activado.</p>
        ) : (
          <div className="space-y-3">
            {activeCardio.map((k) => {
              const cfg = CARDIO_TYPES[k];
              const Icon = CARDIO_ICON[cfg.icon];
              return (
                <div key={k} className="card flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cardio/10 text-cardio">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-soft">{cfg.label}</p>
                    <p className="text-xs text-muted">Objetivo actual</p>
                  </div>
                  <span className="font-display text-lg font-bold text-cardio">
                    {unitLabel(profile.cardio[k].value, cfg.unit)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Historial de semanas */}
      <section className="mt-8 pb-4">
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
          <HistoryIcon className="h-5 w-5 text-muted" />
          Historial
        </h2>
        {history.length === 0 ? (
          <div className="card p-6 text-center text-sm text-muted">
            Aún no has cerrado ninguna semana. Cuando cierres tu primera semana, aparecerá aquí su
            resumen.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((w) => {
              const pct = w.totalCount === 0 ? 0 : Math.round((w.completedCount / w.totalCount) * 100);
              return (
                <div key={w.number} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-soft">Semana {w.number}</p>
                      <p className="text-xs text-muted">{weekRangeLabel(w.startDate)}</p>
                    </div>
                    <span
                      className={`font-display text-lg font-bold ${
                        pct === 100 ? 'text-accent' : 'text-soft'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface2">
                    <div
                      className={`h-full rounded-full ${pct === 100 ? 'bg-accent' : 'bg-cardio'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {w.completedCount} de {w.totalCount} sesiones completadas
                  </p>

                  {/* Subidas de cardio de esa semana */}
                  {w.changes && w.changes.some((c) => c.increased) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {w.changes
                        .filter((c) => c.increased)
                        .map((c) => (
                          <span
                            key={c.key}
                            className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent"
                          >
                            <TrendingUp className="h-3 w-3" />
                            {c.label} → {unitLabel(c.to, c.unit)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ icon, value, label }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
        {icon}
      </div>
      <p className="font-display text-3xl font-extrabold leading-none text-soft">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
