// =============================================================
//  WorkoutContext: estado global de la aplicación.
//  Maneja perfil, semana actual e historial, y persiste todo en
//  localStorage en cada cambio. Expone las acciones de negocio.
// =============================================================
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadState, saveState, clearState, exportBackup, importBackup } from '../utils/storage';
import { buildSessions, groupByDay } from '../utils/plan';
import { applyProgression } from '../utils/progression';
import { isoDate, getMonday, todayIndex } from '../utils/date';

const WorkoutContext = createContext(null);

const EMPTY_STATE = { profile: null, week: null, history: [] };

export function WorkoutProvider({ children }) {
  // Inicializa desde localStorage (o estado vacío) una sola vez
  const [state, setState] = useState(() => loadState() || EMPTY_STATE);

  // Evita guardar en el primer render (antes de cualquier cambio real)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveState(state);
  }, [state]);

  const isOnboarded = !!state.profile;

  // ---------------------------------------------------------
  //  ACCIONES
  // ---------------------------------------------------------

  // Finaliza el onboarding: crea perfil + primera semana
  function completeOnboarding(profile) {
    const week = {
      number: 1,
      startDate: isoDate(getMonday()),
      sessions: buildSessions(profile, 1),
    };
    setState({ profile, week, history: [] });
  }

  // Marca / desmarca una sesión como completada
  function toggleSession(id) {
    setState((prev) => {
      if (!prev.week) return prev;
      return {
        ...prev,
        week: {
          ...prev.week,
          sessions: prev.week.sessions.map((s) =>
            s.id === id ? { ...s, completed: !s.completed } : s
          ),
        },
      };
    });
  }

  // Cierra la semana: aplica progresión de cardio, archiva la semana
  // actual y genera la siguiente. Devuelve los cambios para mostrarlos.
  function closeWeek() {
    const prev = state;
    if (!prev.week) return [];

    const { updatedCardio, changes } = applyProgression(prev.profile, prev.week);
    const newProfile = { ...prev.profile, cardio: updatedCardio };

    const completedCount = prev.week.sessions.filter((s) => s.completed).length;
    const archived = {
      number: prev.week.number,
      startDate: prev.week.startDate,
      endDate: isoDate(),
      sessions: prev.week.sessions,
      completedCount,
      totalCount: prev.week.sessions.length,
      changes,
    };

    const nextNumber = prev.week.number + 1;
    const nextWeek = {
      number: nextNumber,
      startDate: isoDate(getMonday()),
      sessions: buildSessions(newProfile, nextNumber),
    };

    setState({
      profile: newProfile,
      week: nextWeek,
      history: [archived, ...prev.history],
    });

    return changes;
  }

  // Actualiza el perfil. Si rebuild=true regenera el plan de la
  // semana actual (al cambiar días de gym, split o cardio).
  function updateProfile(newProfile, rebuild = false) {
    setState((prev) => {
      const next = { ...prev, profile: newProfile };
      if (rebuild && prev.week) {
        next.week = {
          ...prev.week,
          sessions: buildSessions(newProfile, prev.week.number),
        };
      }
      return next;
    });
  }

  // Reinicio total (vuelve al onboarding)
  function resetAll() {
    clearState();
    setState(EMPTY_STATE);
  }

  // Copia de seguridad
  function exportData() {
    exportBackup(state);
  }

  async function importData(file) {
    const imported = await importBackup(file);
    setState({
      profile: imported.profile,
      week: imported.week || null,
      history: imported.history || [],
    });
  }

  // ---------------------------------------------------------
  //  DERIVADOS
  // ---------------------------------------------------------
  const derived = useMemo(() => {
    const sessions = state.week?.sessions || [];
    const total = sessions.length;
    const completed = sessions.filter((s) => s.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const today = todayIndex();
    const todaySessions = sessions.filter((s) => s.day === today);
    return {
      total,
      completed,
      progress,
      today,
      todaySessions,
      byDay: groupByDay(sessions),
    };
  }, [state.week]);

  const value = {
    state,
    isOnboarded,
    ...derived,
    completeOnboarding,
    toggleSession,
    closeWeek,
    updateProfile,
    resetAll,
    exportData,
    importData,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

// Hook de acceso al contexto
export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout debe usarse dentro de <WorkoutProvider>.');
  return ctx;
}
