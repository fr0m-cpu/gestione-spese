import { useState } from 'react';
import { api, notifyChange } from '../api.js';
import { useData } from '../useData.js';
import { centsToInput, formatEuro, parseEuro } from '../format.js';
import Modal from '../components/Modal.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

function GoalForm({ goal, onClose }) {
  const [name, setName] = useState(goal?.name ?? '');
  const [target, setTarget] = useState(goal ? centsToInput(goal.target) : '');
  const [deadline, setDeadline] = useState(goal?.deadline?.slice(0, 10) ?? '');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const cents = parseEuro(target);
    if (!cents) return setError('Inserisci una cifra valida, es. 1000');
    try {
      await api(goal ? `/goals/${goal._id}` : '/goals', {
        method: goal ? 'PUT' : 'POST',
        body: { name, target: cents, deadline: deadline || null },
      });
      notifyChange();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!confirm(`Eliminare l'obiettivo "${goal.name}"? I soldi messi da parte torneranno disponibili.`)) return;
    try {
      await api(`/goals/${goal._id}`, { method: 'DELETE' });
      notifyChange();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={goal ? 'Modifica obiettivo' : 'Nuovo obiettivo'} onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Es. Vacanza" autoFocus required />
        </label>
        <label>
          Cifra da raggiungere (€)
          <input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="1000" required />
        </label>
        <label>
          Entro il (facoltativo)
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          {goal && (
            <button type="button" className="btn danger" onClick={remove}>
              Elimina
            </button>
          )}
          <button className="btn primary">Salva</button>
        </div>
      </form>
    </Modal>
  );
}

function MoveForm({ goal, direction, onClose }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const isDeposit = direction === 'in';

  async function submit(e) {
    e.preventDefault();
    const cents = parseEuro(amount);
    if (!cents) return setError('Inserisci un importo valido');
    try {
      await api(`/goals/${goal._id}/move`, { method: 'POST', body: { amount: isDeposit ? cents : -cents } });
      notifyChange();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={isDeposit ? `Metti da parte per “${goal.name}”` : `Preleva da “${goal.name}”`} onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Importo (€)
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" autoFocus required />
        </label>
        <p className="hint">
          {isDeposit
            ? 'La cifra resta nel tuo saldo ma non viene più contata come disponibile.'
            : `Messi da parte finora: ${formatEuro(goal.saved)}.`}
        </p>
        {error && <p className="error">{error}</p>}
        <button className="btn primary wide">{isDeposit ? 'Metti da parte' : 'Preleva'}</button>
      </form>
    </Modal>
  );
}

export default function Goals() {
  const { data, error } = useData('/goals');
  const [editing, setEditing] = useState(null); // null | 'new' | goal
  const [moving, setMoving] = useState(null); // { goal, direction }

  return (
    <div className="stack">
      <div className="row-between">
        <h1>Obiettivi</h1>
        <button className="btn primary" onClick={() => setEditing('new')}>
          Nuovo obiettivo
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {data?.length === 0 && (
        <div className="card empty">
          <p>Nessun obiettivo ancora.</p>
          <p className="muted">Decidi per cosa risparmiare e quanto: qui vedrai a che punto sei.</p>
        </div>
      )}

      <div className="grid-2">
        {data?.map((g) => {
          const missing = Math.max(0, g.target - g.saved);
          return (
            <section key={g._id} className="card">
              <div className="row-between">
                <h2>{g.name}</h2>
                <button className="link" onClick={() => setEditing(g)}>
                  Modifica
                </button>
              </div>
              <p className="mid">
                {formatEuro(g.saved)} <span className="muted small">su {formatEuro(g.target)}</span>
              </p>
              <ProgressBar value={g.saved} max={g.target} />
              <p className="muted small">
                {missing === 0 ? 'Obiettivo raggiunto!' : `Mancano ${formatEuro(missing)}`}
                {g.deadline && ` · entro il ${new Date(g.deadline).toLocaleDateString('it-IT', { timeZone: 'UTC' })}`}
              </p>
              <div className="actions">
                <button className="btn" onClick={() => setMoving({ goal: g, direction: 'out' })} disabled={g.saved === 0}>
                  Preleva
                </button>
                <button className="btn primary" onClick={() => setMoving({ goal: g, direction: 'in' })}>
                  Metti da parte
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {editing && <GoalForm goal={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      {moving && <MoveForm {...moving} onClose={() => setMoving(null)} />}
    </div>
  );
}
