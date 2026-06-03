// =============================================================
//  App: punto de unión. Si no hay perfil -> Onboarding.
//  Si lo hay -> shell con pestañas + barra de navegación inferior.
// =============================================================
import { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import WeekView from './screens/WeekView';
import Stats from './screens/Stats';
import Profile from './screens/Profile';
import BottomNav from './components/BottomNav';

function Shell() {
  const { isOnboarded } = useWorkout();
  const [tab, setTab] = useState('home');

  // Configuración obligatoria si no hay datos guardados
  if (!isOnboarded) return <Onboarding />;

  return (
    <div className="min-h-screen">
      <main className="pb-28">
        {tab === 'home' && <Dashboard />}
        {tab === 'week' && <WeekView />}
        {tab === 'stats' && <Stats />}
        {tab === 'profile' && <Profile />}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <Shell />
    </WorkoutProvider>
  );
}
