import { useState } from 'react';
import { useAuth } from '../auth.jsx';

export default function Account() {
  const { user, logout, deleteAccount } = useAuth();
  const [error, setError] = useState('');

  async function remove() {
    if (!confirm('Eliminare definitivamente il tuo account e tutti i tuoi dati? Non si può annullare.')) return;
    try {
      await deleteAccount();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <h1>Account</h1>
      <section className="card">
        <p className="label">Nome</p>
        <p>{user.name}</p>
        <p className="label">Email</p>
        <p>{user.email}</p>
        <div className="actions">
          <button className="btn" onClick={logout}>
            Esci
          </button>
        </div>
      </section>
      <section className="card">
        <h2>Elimina account</h2>
        <p className="muted">Cancella l'account e tutti i movimenti, gli obiettivi e i budget.</p>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button className="btn danger" onClick={remove}>
            Elimina account
          </button>
        </div>
      </section>
    </div>
  );
}
