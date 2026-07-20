import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarRange, Salad, UtensilsCrossed, Globe2, Leaf } from 'lucide-react';
import SearchBar from './SearchBar';

const navItems = [
  { to: '/', label: 'Planner', icon: CalendarRange, end: true },
  { to: '/foods', label: 'Foods', icon: Salad, end: false },
  { to: '/meals', label: 'Meals', icon: UtensilsCrossed, end: false },
  { to: '/cuisines', label: 'Cuisines', icon: Globe2, end: false },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-stone-200 bg-white md:w-56 md:border-b-0 md:border-r dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Leaf size={18} />
          </div>
          <span className="text-lg font-semibold tracking-tight">YumYums</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible md:pb-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6 dark:border-stone-800 dark:bg-stone-950/90">
          <SearchBar />
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
