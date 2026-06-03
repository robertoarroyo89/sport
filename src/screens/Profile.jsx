// =============================================================
//  Profile (Perfil): datos del usuario, edición de la configuración,
//  copia de seguridad (exportar / importar) y reinicio total.
// =============================================================
import { useRef, useState } from 'react';
import {
  User,
  Download,
  Upload,
  RotateCcw,
  Save,
  Pencil,
  Check,
  X,
  Dumbbell,
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import {
  SPLITS,
  SPLIT_ORDER,
  CARDIO_TYPES,
  CARDIO_ORDER,
  unitLabel,
} from '../constants/config';
import { CARDIO_ICON } from '../components/icons';

export default function Profile() {
  const { state, updateProfile, resetAll, exportData, importData } = useWorkout();
  const { profile } = state;

  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState(null);

  function flash(message, kind = 'ok') {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 2600);
  }

  function startEdit() {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    updateProfile(draft, true); // rebuild=true: regenera el plan de la semana
    setEditing(false);
    flash('Perfil actualizado. Plan de la semana regenerado.');
  }

  function setName(name) {
    setDraft((d) => ({ ...d, name }));
  }
  function setGymDays(gymDays) {
    setDraft((d) => ({ ...d, gymDays }));
  }
  function setSplit(splitId) {
    setDraft((d) => ({ ...d, splitId }));
  }
  function toggleCardio(key) {
    setDraft((d) => ({
      ...d,
      cardio: { ...d.cardio, [key]: { ...d.cardio[key], enabled: !d.cardio[key].enabled } },
    }));
  }
  function setCardioValue(key, raw) {
    const value = Math.max(0, Number(raw) || 0);
    setDraft((d) => ({ ...d, cardio: { ...d.cardio, [key]: { ...d.cardio[key], value } } }));
  }

  async function onImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite reimportar el mismo archivo
    if (!file) return;
    try {
      await importData(file);
      flash('Copia de seguridad importada correctamente.');
    } catch (err) {
      flash(err.message || 'No se pudo importar el archivo.', 'error');
    }
  }

  function doExport() {
    exportData();
    flash('Copia de seguridad descargada.');
  }

  function doReset() {
    resetAll();
  }

  const view = editing ? draft : profile;

  return (
    <div className="mx-auto max-w-app px-5 pt-10">
      <header className="animate-fade-up flex items-center justify-between">
        <div>
          <p className="label">Tu cuenta</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold">Perfil</h1>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-soft active:scale-95"
          >
            <Pencil className="h-4 w-4" /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink active:scale-95"
            >
              <Save className="h-4 w-4" /> Guardar
            </button>
          </div>
        )}
      </header>

      {/* Avatar + nombre */}
      <section className="card mt-6 flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
          <User className="h-7 w-7 text-accent" />
        </div>
        <div className="flex-1">
          {editing ? (
            <input
              type="text"
              value={view.name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface2 px-3 py-2 text-lg font-bold outline-none focus:border-accent"
            />
          ) : (
            <p className="font-display text-2xl font-bold text-soft">{view.name}</p>
          )}
          <p className="mt-0.5 text-sm text-muted">
            Semana {state.week.number} en curso
          </p>
        </div>
      </section>

      {/* Configuración de entrenamiento */}
      <section className="mt-7">
        <h2 className="mb-3 font-display text-xl font-bold">Configuración</h2>

        {/* Días de gym */}
        <div className="card p-4">
          <p className="label mb-3">Días de gimnasio</p>
          {editing ? (
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setGymDays(d)}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-lg font-bold transition active:scale-95 ${
                    view.gymDays === d ? 'border-accent bg-accent text-ink' : 'border-line bg-surface2 text-soft'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-display text-lg font-bold text-soft">
              {view.gymDays} {view.gymDays === 1 ? 'día' : 'días'} por semana
            </p>
          )}
        </div>

        {/* Enfoque */}
        <div className="card mt-3 p-4">
          <p className="label mb-3">Enfoque de gimnasio</p>
          {editing ? (
            <div className="space-y-2">
              {SPLIT_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSplit(id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[0.99] ${
                    view.splitId === id ? 'border-accent bg-accent/10' : 'border-line bg-surface2'
                  }`}
                >
                  <Dumbbell
                    className={`h-5 w-5 ${view.splitId === id ? 'text-accent' : 'text-muted'}`}
                  />
                  <span className="flex-1 text-sm font-semibold text-soft">{SPLITS[id].label}</span>
                  {view.splitId === id && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-display text-lg font-bold text-soft">{SPLITS[view.splitId].label}</p>
          )}
        </div>

        {/* Cardio */}
        <div className="card mt-3 p-4">
          <p className="label mb-3">Cardio</p>
          <div className="space-y-2.5">
            {CARDIO_ORDER.map((key) => {
              const cfg = CARDIO_TYPES[key];
              const Icon = CARDIO_ICON[cfg.icon];
              const c = view.cardio[key];
              const active = c.enabled;

              if (!editing && !active) return null;

              return (
                <div
                  key={key}
                  className={`rounded-xl border p-3 ${
                    active ? 'border-cardio/30 bg-cardio/5' : 'border-line bg-surface2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${active ? 'text-cardio' : 'text-muted'}`} />
                    <span className="flex-1 text-sm font-semibold text-soft">{cfg.label}</span>
                    {editing ? (
                      <button
                        type="button"
                        onClick={() => toggleCardio(key)}
                        className={`relative h-6 w-11 rounded-full transition ${
                          active ? 'bg-cardio' : 'bg-line'
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                            active ? 'left-6' : 'left-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="font-bold text-cardio">{unitLabel(c.value, cfg.unit)}</span>
                    )}
                  </div>
                  {editing && active && (
                    <div className="mt-2 flex items-center gap-2 pl-8">
                      <input
                        type="number"
                        min="0"
                        value={c.value}
                        onChange={(e) => setCardioValue(key, e.target.value)}
                        className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-center font-bold outline-none focus:border-cardio"
                      />
                      <span className="text-xs text-muted">
                        {cfg.unit === 'series' ? 'series' : cfg.unit === 'km' ? 'km' : 'minutos'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {editing && (
            <p className="mt-3 text-xs text-muted">
              Al guardar, el plan de la semana actual se regenera con la nueva configuración.
            </p>
          )}
        </div>
      </section>

      {/* Copia de seguridad */}
      <section className="mt-7">
        <h2 className="mb-3 font-display text-xl font-bold">Copia de seguridad</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={doExport}
            className="card flex flex-col items-center gap-2 p-5 transition active:scale-95"
          >
            <Download className="h-6 w-6 text-accent" />
            <span className="text-sm font-semibold text-soft">Exportar JSON</span>
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="card flex flex-col items-center gap-2 p-5 transition active:scale-95"
          >
            <Upload className="h-6 w-6 text-cardio" />
            <span className="text-sm font-semibold text-soft">Importar JSON</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImportFile}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Tus datos se guardan solo en este dispositivo. Exporta periódicamente para no perderlos.
        </p>
      </section>

      {/* Zona de peligro */}
      <section className="mt-7 pb-4">
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-warn/40 bg-warn/10 px-5 py-4 font-semibold text-warn transition active:scale-[0.98]"
          >
            <RotateCcw className="h-5 w-5" />
            Reiniciar toda la app
          </button>
        ) : (
          <div className="card border-warn/40 p-5">
            <p className="font-display font-bold text-soft">¿Seguro que quieres reiniciar?</p>
            <p className="mt-1 text-sm text-muted">
              Se borrarán perfil, semana actual e historial de este dispositivo. Esta acción no se
              puede deshacer.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-xl border border-line bg-surface2 py-3 text-sm font-semibold text-soft active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={doReset}
                className="flex-1 rounded-xl bg-warn py-3 text-sm font-bold text-ink active:scale-95"
              >
                Sí, borrar todo
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-5">
          <div
            className={`flex max-w-app items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.kind === 'error'
                ? 'border-warn/40 bg-warn/15 text-warn'
                : 'border-accent/40 bg-accent/15 text-accent'
            }`}
          >
            {toast.kind === 'error' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
