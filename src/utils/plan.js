// =============================================================
//  Generador del plan semanal.
//  A partir del perfil del usuario crea las sesiones (gym/cardio)
//  y las reparte de forma equilibrada de Lunes(0) a Domingo(6).
// =============================================================
import { SPLITS, EXERCISES_BY_FOCUS, CARDIO_TYPES, CARDIO_ORDER } from '../constants/config';

// Intercala dos listas: A, B, A, B, ... para repartir gym y cardio
function interleave(a, b) {
  const out = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

/**
 * Construye la lista de sesiones de una semana.
 * @param {object} profile  Perfil del usuario.
 * @param {number} weekNumber  Número de semana (para los IDs).
 * @returns {Array} sesiones con { id, day, type, completed, ... }
 */
export function buildSessions(profile, weekNumber) {
  const split = SPLITS[profile.splitId] || SPLITS.fullbody;

  // --- Sesiones de gimnasio ---
  const gymSpecs = [];
  for (let i = 0; i < profile.gymDays; i++) {
    const focus = split.focuses[i % split.focuses.length];
    gymSpecs.push({
      type: 'gym',
      focus,
      exercises: EXERCISES_BY_FOCUS[focus] || [],
    });
  }

  // --- Sesiones de cardio (una por tipo activado) ---
  const cardioSpecs = CARDIO_ORDER.filter((k) => profile.cardio?.[k]?.enabled).map((k) => ({
    type: 'cardio',
    cardioKey: k,
    target: profile.cardio[k].value,
    unit: CARDIO_TYPES[k].unit,
  }));

  // Intercala para no acumular todo el gym al principio
  const ordered = interleave(gymSpecs, cardioSpecs);
  const total = ordered.length;

  // Reparte uniformemente sobre los 7 días (0..6).
  return ordered.map((spec, k) => {
    const day = total <= 1 ? 0 : Math.round((k * 6) / (total - 1));
    return {
      id: `w${weekNumber}-s${k}`,
      day,
      completed: false,
      ...spec,
    };
  });
}

// Agrupa sesiones por día -> { 0: [...], 1: [...], ... }
export function groupByDay(sessions = []) {
  const map = {};
  for (let i = 0; i < 7; i++) map[i] = [];
  sessions.forEach((s) => {
    if (!map[s.day]) map[s.day] = [];
    map[s.day].push(s);
  });
  return map;
}
