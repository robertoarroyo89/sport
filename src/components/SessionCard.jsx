// =============================================================
//  Tarjeta de una sesión de entrenamiento.
//  - Gym:    foco muscular + ejercicios sugeridos + completar.
//  - Cardio: tipo + objetivo de la semana (tiempo/distancia) + completar.
// =============================================================
import { CheckCircle2, Circle, Dumbbell } from 'lucide-react';
import { CARDIO_TYPES, unitLabel } from '../constants/config';
import { CARDIO_ICON } from './icons';

export default function SessionCard({ session, onToggle, compact = false }) {
  const isGym = session.type === 'gym';
  const isCardio = session.type === 'cardio';

  const cardio = isCardio ? CARDIO_TYPES[session.cardioKey] : null;
  const CardioIcon = cardio ? CARDIO_ICON[cardio.icon] : null;

  const accent = isGym ? 'text-gym' : 'text-cardio';
  const ring = isGym ? 'border-gym/30' : 'border-cardio/30';
  const glow = isGym ? 'bg-gym/10' : 'bg-cardio/10';

  return (
    <div
      className={`card relative overflow-hidden p-4 ${session.completed ? 'opacity-70' : ''}`}
    >
      {/* Acento lateral por tipo */}
      <span
        className={`absolute inset-y-0 left-0 w-1 ${isGym ? 'bg-gym' : 'bg-cardio'}`}
        aria-hidden
      />

      <div className="flex items-start gap-3 pl-2">
        {/* Icono */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${glow} ${ring} border`}>
          {isGym ? (
            <Dumbbell className={`h-5 w-5 ${accent}`} />
          ) : (
            CardioIcon && <CardioIcon className={`h-5 w-5 ${accent}`} />
          )}
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <p className="label">{isGym ? 'Gimnasio' : 'Cardio'}</p>
          <h3 className="font-display text-lg font-bold leading-tight text-soft">
            {isGym ? session.focus : cardio.label}
          </h3>

          {isCardio && (
            <p className={`mt-0.5 text-sm font-semibold ${accent}`}>
              Objetivo: {unitLabel(session.target, session.unit)}
            </p>
          )}

          {isGym && !compact && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {session.exercises.map((ex) => (
                <li key={ex} className="chip">
                  {ex}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Botón completar */}
      <button
        type="button"
        onClick={() => onToggle(session.id)}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.98] ${
          session.completed
            ? 'border-line bg-surface2 text-muted'
            : 'border-transparent bg-accent text-ink'
        }`}
      >
        {session.completed ? (
          <>
            <CheckCircle2 className="h-5 w-5 animate-pop text-accent" />
            Completada
          </>
        ) : (
          <>
            <Circle className="h-5 w-5" />
            {isGym ? 'Marcar gimnasio como completado' : 'Marcar cardio como completado'}
          </>
        )}
      </button>
    </div>
  );
}
