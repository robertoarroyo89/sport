// =============================================================
//  Configuración global, catálogos y constantes de la app
// =============================================================

// Clave única de almacenamiento en localStorage
export const STORAGE_KEY = 'trackout:state:v1';

// Porcentaje de sobrecarga progresiva aplicado al cardio completado
export const PROGRESSION_RATE = 0.1; // +10%

// -------------------------------------------------------------
//  SPLITS / ENFOQUES DE GIMNASIO
//  Cada split define los "focos" que se rotan por cada día de gym.
// -------------------------------------------------------------
export const SPLITS = {
  fullbody: {
    id: 'fullbody',
    label: 'Full Body',
    description: 'Cuerpo completo en cada sesión.',
    focuses: ['Full Body'],
  },
  upperLower: {
    id: 'upperLower',
    label: 'Torso / Pierna',
    description: 'Alterna tren superior e inferior.',
    focuses: ['Torso', 'Pierna'],
  },
  ppl: {
    id: 'ppl',
    label: 'Empuje / Tirón / Pierna',
    description: 'Push · Pull · Legs clásico.',
    focuses: ['Empuje', 'Tirón', 'Pierna'],
  },
};

export const SPLIT_ORDER = ['fullbody', 'upperLower', 'ppl'];

// -------------------------------------------------------------
//  EJERCICIOS SUGERIDOS POR FOCO (3-4 recomendaciones)
// -------------------------------------------------------------
export const EXERCISES_BY_FOCUS = {
  'Full Body': ['Sentadilla', 'Press de banca', 'Remo con barra', 'Press militar'],
  Torso: ['Press de banca', 'Remo con barra', 'Press militar', 'Jalón al pecho'],
  Pierna: ['Sentadilla', 'Peso muerto rumano', 'Prensa', 'Elevación de gemelos'],
  Empuje: ['Press de banca', 'Press militar', 'Fondos en paralelas', 'Extensión de tríceps'],
  'Tirón': ['Dominadas', 'Remo con barra', 'Curl de bíceps', 'Face pull'],
};

// -------------------------------------------------------------
//  TIPOS DE CARDIO
//  unit determina cómo se redondea la progresión (km con decimal).
// -------------------------------------------------------------
export const CARDIO_TYPES = {
  cycling: { key: 'cycling', label: 'Ciclismo', unit: 'min', icon: 'bike', defaultValue: 30 },
  zone2: { key: 'zone2', label: 'Carrera Zona 2', unit: 'min', icon: 'footprints', defaultValue: 30 },
  hills: { key: 'hills', label: 'Cuestas / Series', unit: 'series', icon: 'mountain', defaultValue: 6 },
  longRun: { key: 'longRun', label: 'Long Run', unit: 'km', icon: 'route', defaultValue: 8 },
};

export const CARDIO_ORDER = ['cycling', 'zone2', 'hills', 'longRun'];

// Perfil de cardio por defecto que usa el onboarding
export const DEFAULT_CARDIO = {
  cycling: { enabled: true, value: 30 },
  zone2: { enabled: true, value: 30 },
  hills: { enabled: false, value: 6 },
  longRun: { enabled: false, value: 8 },
};

// -------------------------------------------------------------
//  CALENDARIO (semana empieza en LUNES = índice 0)
// -------------------------------------------------------------
export const DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const DAYS_SHORT_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Etiqueta legible de una unidad
export function unitLabel(value, unit) {
  if (unit === 'series') return `${value} series`;
  if (unit === 'km') return `${value} km`;
  return `${value} min`;
}
