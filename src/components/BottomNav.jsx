// =============================================================
//  Barra de navegación inferior fija (4 pestañas).
// =============================================================
import { Home, CalendarDays, BarChart2, User } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Inicio', Icon: Home },
  { id: 'week', label: 'Semana', Icon: CalendarDays },
  { id: 'stats', label: 'Progreso', Icon: BarChart2 },
  { id: 'profile', label: 'Perfil', Icon: User },
];

export default function BottomNav({ tab, setTab }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-app items-stretch justify-around px-2 py-2">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="group flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 transition"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`flex h-9 w-12 items-center justify-center rounded-full transition ${
                  active ? 'bg-accent/15' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition ${active ? 'text-accent' : 'text-muted group-active:text-soft'}`}
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  active ? 'text-accent' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
