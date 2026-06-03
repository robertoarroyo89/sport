// =============================================================
//  Dashboard (Inicio): saludo, progreso semanal y lo que toca hoy.
// =============================================================
import { CalendarCheck, Flame, Moon } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { greeting, formatLongDate, todayIndex } from '../utils/date';
import { DAYS_ES } from '../constants/config';
import ProgressBar from '../components/ProgressBar';
import SessionCard from '../components/SessionCard';

export default function Dashboard() {
  const { state, progress, completed, total, todaySessions, toggleSession } = useWorkout();
  const { profile, week } = state;
  const today = todayIndex();

  return (
    <div className="mx-auto max-w-app px-5 pt-10">
      {/* Cabecera con saludo */}
      <header className="animate-fade-up">
        <p className="text-sm capitalize text-muted">{formatLongDate()}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight">
          {greeting()}, <span className="text-accent">{profile.name}</span>
        </h1>
      </header>

      {/* Tarjeta de progreso semanal */}
      <section className="card mt-6 animate-fade-up p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="label">Semana {week.number}</p>
            <p className="font-display text-2xl font-bold text-soft">
              {completed} / {total} <span className="text-base font-medium text-muted">sesiones</span>
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
            <span className="font-display text-xl font-extrabold text-accent">{progress}%</span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={progress} />
        </div>
        {progress === 100 && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-accent">
            <Flame className="h-4 w-4" /> ¡Semana completada! Pásate a "Semana" para cerrarla.
          </p>
        )}
      </section>

      {/* Entrenamiento del día */}
      <section className="mt-7">
        <div className="mb-3 flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Hoy · {DAYS_ES[today]}</h2>
        </div>

        {todaySessions.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface2">
              <Moon className="h-6 w-6 text-muted" />
            </div>
            <p className="font-display text-lg font-bold text-soft">Día de descanso</p>
            <p className="text-sm text-muted">
              No tienes entrenamiento asignado para hoy. Recupera y descansa.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySessions.map((s) => (
              <SessionCard key={s.id} session={s} onToggle={toggleSession} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
