import { useState } from 'react';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await (isRegister ? register(form) : login({ email: form.email, password: form.password }));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/icon.svg" alt="" width="56" height="56" />
        <h1>Gestione Spese</h1>
        <p className="muted">Spese, entrate e risparmi sempre sotto controllo.</p>

        <form onSubmit={submit} className="form">
          {isRegister && (
            <label>
              Nome
              <input value={form.name} onChange={set('name')} autoComplete="given-name" required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={isRegister ? 8 : undefined}
              required
            />
          </label>
          {isRegister && <p className="hint">Almeno 8 caratteri.</p>}
          {error && <p className="error">{error}</p>}
          <button className="btn primary wide" disabled={busy}>
            {busy ? 'Attendi…' : isRegister ? 'Crea account' : 'Accedi'}
          </button>
        </form>

        <button
          className="link"
          onClick={() => {
            setMode(isRegister ? 'login' : 'register');
            setError('');
          }}
        >
          {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>
      </div>
    </div>
  );
}
