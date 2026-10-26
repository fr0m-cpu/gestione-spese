import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Goals from './pages/Goals.jsx';
import Budgets from './pages/Budgets.jsx';
import Account from './pages/Account.jsx';
import Privacy from './pages/Privacy.jsx';

function Gate() {
  const { user } = useAuth();

  if (user === undefined) return <div className="splash">Caricamento…</div>;
  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="movimenti" element={<Transactions />} />
        <Route path="obiettivi" element={<Goals />} />
        <Route path="budget" element={<Budgets />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* L'informativa è leggibile anche senza account */}
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<Gate />} />
      </Routes>
    </AuthProvider>
  );
}
