// =============================================================
//  Persistencia local y copia de seguridad (exportar/importar).
// =============================================================
import { STORAGE_KEY } from '../constants/config';

// --- Lectura del estado guardado ---
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('No se pudo leer el estado de localStorage:', e);
    return null;
  }
}

// --- Guardado del estado ---
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('No se pudo guardar en localStorage:', e);
  }
}

// --- Borrado total ---
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('No se pudo borrar localStorage:', e);
  }
}

// --- Exportar copia de seguridad como archivo .json ---
export function exportBackup(state) {
  const payload = {
    app: 'trackout',
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trackout-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Importar copia de seguridad desde un File ---
// Acepta tanto el formato envuelto {app,version,state} como un estado plano.
export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const state = data && data.state ? data.state : data;
        if (!state || !state.profile) {
          reject(new Error('El archivo no contiene un perfil válido.'));
          return;
        }
        resolve(state);
      } catch (e) {
        reject(new Error('El archivo no es un JSON válido.'));
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsText(file);
  });
}
