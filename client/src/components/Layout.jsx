import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import TransactionForm from './TransactionForm.jsx';

const LINKS = [
  { to: '/', label: 'Riepilogo', end: true },
  { to: '/movimenti', label: 'Movimenti' },
  { to: '/obiettivi', label: 'Obiettivi' },
  { to: '/budget', label: 'Budget' },
];

export default function Layout() {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Gestione Spese</span>
        <nav className="nav-desktop">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/account" className="avatar" title="Account">
          {user.name.slice(0, 1).toUpperCase()}
        </NavLink>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <button className="fab" onClick={() => setAdding(true)} aria-label="Aggiungi movimento">
        +
      </button>

      <nav className="nav-mobile">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {adding && <TransactionForm onClose={() => setAdding(false)} />}
    </div>
  );
}
