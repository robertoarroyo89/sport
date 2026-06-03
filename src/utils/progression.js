// =============================================================
//  Sobrecarga progresiva del CARDIO.
//  Si todas las sesiones de un tipo de cardio se completaron en la
//  semana, su objetivo aumenta un 10% para la semana siguiente.
//  Si no, se mantiene igual. El gimnasio NO escala numéricamente.
// =============================================================
import { CARDIO_ORDER, CARDIO_TYPES, PROGRESSION_RATE } from '../constants/config';

// Redondeo según unidad: km a 1 decimal, el resto a entero
export function roundTarget(value, unit) {
  if (unit === 'km') return Math.round(value * 10) / 10;
  return Math.round(value);
}

/**
 * Calcula los nuevos objetivos de cardio tras cerrar una semana.
 * @returns {{ updatedCardio: object, changes: Array }}
 */
export function applyProgression(profile, week) {
  const updatedCardio = { ...profile.cardio };
  const changes = [];

  CARDIO_ORDER.forEach((key) => {
    const cfg = profile.cardio?.[key];
    if (!cfg?.enabled) return;

    const sessions = week.sessions.filter((s) => s.type === 'cardio' && s.cardioKey === key);
    if (sessions.length === 0) return;

    const allDone = sessions.every((s) => s.completed);
    const unit = CARDIO_TYPES[key].unit;
    const from = cfg.value;
    let to = from;

    if (allDone) {
      to = roundTarget(from * (1 + PROGRESSION_RATE), unit);
      // Garantiza un incremento mínimo visible cuando el +10% se redondea hacia abajo
      if (to <= from) {
        to = roundTarget(from + (unit === 'km' ? 0.5 : 1), unit);
      }
    }

    updatedCardio[key] = { ...cfg, value: to };
    changes.push({
      key,
      label: CARDIO_TYPES[key].label,
      unit,
      from,
      to,
      increased: allDone,
    });
  });

  return { updatedCardio, changes };
}
