import { useState } from 'react';
import { api, notifyChange } from '../api.js';
import { CATEGORIES } from '../categories.js';
import { centsToInput, parseEuro, today } from '../format.js';
import Modal from './Modal.jsx';

// Senza `item` crea un nuovo movimento, con `item` lo modifica
export default function TransactionForm({ item, onClose }) {
  const [type, setType] = useState(item?.type ?? 'expense');
  const [amount, setAmount] = useState(item ? centsToInput(item.amount) : '');
  const [category, setCategory] = useState(item?.category ?? 'spesa');
  const [date, setDate] = useState(item ? item.date.slice(0, 10) : today());
  const [note, setNote] = useState(item?.note ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function changeType(t) {
    setType(t);
    if (!CATEGORIES[t][category]) setCategory(t === 'income' ? 'stipendio' : 'spesa');
  }

  async function submit(e) {
    e.preventDefault();
    const cents = parseEuro(amount);
    if (!cents) return setError('Inserisci un importo valido, es. 12,50');
    setBusy(true);
    try {
      const body = { type, amount: cents, category, date, note };
      await api(item ? `/transactions/${item._id}` : '/transactions', {
        method: item ? 'PUT' : 'POST',
        body,
      });
      notifyChange();
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm('Eliminare questo movimento?')) return;
    setBusy(true);
    try {
      await api(`/transactions/${item._id}`, { method: 'DELETE' });
      notifyChange();
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={item ? 'Modifica movimento' : 'Nuovo movimento'} onClose={onClose}>
      <form onSubmit={submit} className="form">
        <div className="segmented">
          <button type="button" className={type === 'expense' ? 'on expense' : ''} onClick={() => changeType('expense')}>
            Spesa
          </button>
          <button type="button" className={type === 'income' ? 'on income' : ''} onClick={() => changeType('income')}>
            Entrata
          </button>
        </div>

        <label>
          Importo (€)
          <input
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            required
          />
        </label>

        <label>
          Categoria
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.entries(CATEGORIES[type]).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label>
          Nota (facoltativa)
          <input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="Es. spesa al supermercato" />
        </label>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          {item && (
            <button type="button" className="btn danger" onClick={remove} disabled={busy}>
              Elimina
            </button>
          )}
          <button className="btn primary" disabled={busy}>
            {busy ? 'Salvataggio…' : 'Salva'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
