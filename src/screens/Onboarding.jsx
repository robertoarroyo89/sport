// =============================================================
//  Onboarding: cuestionario de configuración inicial.
//  Se muestra obligatoriamente cuando no hay datos en localStorage.
// =============================================================
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Dumbbell, Sparkles } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import {
  SPLITS,
  SPLIT_ORDER,
  CARDIO_TYPES,
  CARDIO_ORDER,
  DEFAULT_CARDIO,
  unitLabel,
} from '../constants/config';
import { CARDIO_ICON } from '../components/icons';

const STEPS = ['Nombre', 'Días', 'Enfoque', 'Cardio', 'Listo'];

export default function Onboarding() {
  const { completeOnboarding } = useWorkout();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gymDays, setGymDays] = useState(3);
  const [splitId, setSplitId] = useState('ppl');
  const [cardio, setCardio] = useState(() => JSON.parse(JSON.stringify(DEFAULT_CARDIO)));

  const canContinue = step !== 0 || name.trim().length > 0;

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function toggleCardio(key) {
    setCardio((c) => ({ ...c, [key]: { ...c[key], enabled: !c[key].enabled } }));
  }
  function setCardioValue(key, raw) {
    const value = Math.max(0, Number(raw) || 0);
    setCardio((c) => ({ ...c, [key]: { ...c[key], value } }));
  }

  function finish() {
    completeOnboarding({
      name: name.trim(),
      gymDays,
      splitId,
      cardio,
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8 pt-10">
      {/* Cabecera */}
      <header className="mb-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent">Configura tu perfil</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold leading-tight">
          Bienvenido a <span className="text-accent">Trackout</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Responde unas preguntas y crearemos tu plan semanal.
        </p>
      </header>

      {/* Indicador de pasos */}
      <div className="mb-7 flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i <= step ? 'bg-accent' : 'bg-surface2'
            }`}
          />
        ))}
      </div>

      {/* Contenido del paso */}
      <div className="flex-1 animate-fade-up" key={step}>
        {/* Paso 0 · Nombre */}
        {step === 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold">¿Cómo te llamas?</h2>
            <p className="mt-1 text-sm text-muted">Lo usaremos para saludarte.</p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="mt-5 w-full rounded-2xl border border-line bg-surface px-4 py-4 text-lg font-medium outline-none transition focus:border-accent"
            />
          </section>
        )}

        {/* Paso 1 · Días de gimnasio */}
        {step === 1 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Días de gimnasio</h2>
            <p className="mt-1 text-sm text-muted">¿Cuántos días entrenas en el gimnasio a la semana?</p>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setGymDays(d)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl border text-2xl font-bold transition active:scale-95 ${
                    gymDays === d
                      ? 'border-accent bg-accent text-ink'
                      : 'border-line bg-surface text-soft'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              {gymDays} {gymDays === 1 ? 'día' : 'días'} de gimnasio por semana
            </p>
          </section>
        )}

        {/* Paso 2 · Enfoque / Split */}
        {step === 2 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Enfoque de gimnasio</h2>
            <p className="mt-1 text-sm text-muted">Cómo repartir los grupos musculares.</p>
            <div className="mt-5 space-y-3">
              {SPLIT_ORDER.map((id) => {
                const split = SPLITS[id];
                const selected = splitId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSplitId(id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                      selected ? 'border-accent bg-accent/10' : 'border-line bg-surface'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        selected ? 'bg-accent text-ink' : 'bg-surface2 text-muted'
                      }`}
                    >
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-soft">{split.label}</p>
                      <p className="text-xs text-muted">{split.description}</p>
                    </div>
                    {selected && <Check className="h-5 w-5 text-accent" />}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Paso 3 · Cardio */}
        {step === 3 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Configura tu cardio</h2>
            <p className="mt-1 text-sm text-muted">
              Activa los que quieras y define el volumen inicial.
            </p>
            <div className="mt-5 space-y-3">
              {CARDIO_ORDER.map((key) => {
                const cfg = CARDIO_TYPES[key];
                const Icon = CARDIO_ICON[cfg.icon];
                const active = cardio[key].enabled;
                return (
                  <div
                    key={key}
                    className={`rounded-2xl border p-4 transition ${
                      active ? 'border-cardio/40 bg-cardio/5' : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          active ? 'bg-cardio/15 text-cardio' : 'bg-surface2 text-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-soft">{cfg.label}</p>
                        <p className="text-xs text-muted">Volumen inicial en {cfg.unit}</p>
                      </div>
                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCardio(key)}
                        className={`relative h-7 w-12 rounded-full transition ${
                          active ? 'bg-cardio' : 'bg-surface2'
                        }`}
                        aria-pressed={active}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                            active ? 'left-6' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {active && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={cardio[key].value}
                          onChange={(e) => setCardioValue(key, e.target.value)}
                          className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 text-center text-lg font-bold outline-none focus:border-cardio"
                        />
                        <span className="text-sm font-medium text-muted">
                          {cfg.unit === 'series' ? 'series' : cfg.unit === 'km' ? 'km' : 'minutos'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Paso 4 · Resumen */}
        {step === 4 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Todo listo, {name.trim() || 'crack'} 🎯</h2>
            <p className="mt-1 text-sm text-muted">Este es el resumen de tu plan.</p>
            <div className="mt-5 space-y-3">
              <SummaryRow label="Días de gimnasio" value={`${gymDays} por semana`} />
              <SummaryRow label="Enfoque" value={SPLITS[splitId].label} />
              <div className="card p-4">
                <p className="label mb-2">Cardio activado</p>
                {CARDIO_ORDER.filter((k) => cardio[k].enabled).length === 0 ? (
                  <p className="text-sm text-muted">Sin cardio (solo gimnasio).</p>
                ) : (
                  <ul className="space-y-1.5">
                    {CARDIO_ORDER.filter((k) => cardio[k].enabled).map((k) => (
                      <li key={k} className="flex justify-between text-sm">
                        <span className="text-soft">{CARDIO_TYPES[k].label}</span>
                        <span className="font-semibold text-cardio">
                          {unitLabel(cardio[k].value, CARDIO_TYPES[k].unit)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Navegación */}
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex items-center justify-center rounded-2xl border border-line bg-surface px-5 py-4 text-soft transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 font-bold text-ink transition active:scale-[0.98] disabled:opacity-40"
          >
            Continuar
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 font-bold text-ink transition active:scale-[0.98]"
          >
            Empezar a entrenar
            <Check className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="card flex items-center justify-between p-4">
      <span className="label">{label}</span>
      <span className="font-display font-bold text-soft">{value}</span>
    </div>
  );
}
