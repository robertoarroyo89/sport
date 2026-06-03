// =============================================================
//  Utilidades de fecha. La semana siempre empieza en LUNES.
// =============================================================

// Devuelve 'YYYY-MM-DD' a medianoche local
export function isoDate(d = new Date()) {
  const z = new Date(d);
  z.setHours(0, 0, 0, 0);
  const y = z.getFullYear();
  const m = String(z.getMonth() + 1).padStart(2, '0');
  const day = String(z.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Índice de día con LUNES = 0 ... DOMINGO = 6
export function dayIndex(d = new Date()) {
  return (d.getDay() + 6) % 7;
}

// Índice del día de HOY (Lunes=0)
export function todayIndex() {
  return dayIndex(new Date());
}

// Fecha del lunes de la semana de la fecha dada
export function getMonday(d = new Date()) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - dayIndex(date));
  return date;
}

// Fecha resultante de sumar 'n' días a una fecha ISO o Date
export function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

// "miércoles, 3 de junio"
export function formatLongDate(d = new Date()) {
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

// "3 jun" (corto)
export function formatShort(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Rango de una semana a partir de su fecha de inicio (ISO)
export function weekRangeLabel(startISO) {
  const start = new Date(startISO);
  const end = addDays(start, 6);
  return `${formatShort(start)} – ${formatShort(end)}`;
}

// Saludo según la hora
export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 14) return 'Buenos días';
  if (h < 21) return 'Buenas tardes';
  return 'Buenas noches';
}
