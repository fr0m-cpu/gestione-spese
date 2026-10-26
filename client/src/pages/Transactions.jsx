import { useMemo, useState } from 'react';
import { useData } from '../useData.js';
import { formatDate, formatEuro, thisMonth } from '../format.js';
import { CATEGORY_COLORS, categoryLabel } from '../categories.js';
import MonthPicker from '../components/MonthPicker.jsx';
import TransactionForm from '../components/TransactionForm.jsx';

export default function Transactions() {
  const [month, setMonth] = useState(thisMonth());
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const { data, error } = useData(`/transactions?month=${month}`);

  const items = useMemo(
    () => (data ?? []).filter((t) => filter === 'all' || t.type === filter),
    [data, filter],
  );

  // Raggruppa per giorno, mantenendo l'ordine (più recenti in alto)
  const days = useMemo(() => {
    const groups = new Map();
    for (const t of items) {
      const key = t.date.slice(0, 10);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    }
    return [...groups];
  }, [items]);

  return (
    <div className="stack">
      <h1>Movimenti</h1>
      <MonthPicker month={month} onChange={setMonth} />

      <div className="segmented small">
        {[
          ['all', 'Tutti'],
          ['expense', 'Spese'],
          ['income', 'Entrate'],
        ].map(([key, label]) => (
          <button key={key} className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {data && items.length === 0 && (
        <div className="card empty">
          <p>Nessun movimento in questo mese.</p>
          <p className="muted">Tocca + per aggiungere una spesa o un'entrata.</p>
        </div>
      )}

      {days.map(([day, list]) => (
        <section key={day} className="card list">
          <p className="day">{formatDate(day)}</p>
          {list.map((t) => (
            <button key={t._id} className="tx" onClick={() => setEditing(t)}>
              <span
                className="dot big-dot"
                style={{ background: t.type === 'income' ? 'var(--pos)' : CATEGORY_COLORS[t.category] }}
              />
              <span className="tx-text">
                <span>{categoryLabel(t.type, t.category)}</span>
                {t.note && <span className="muted small">{t.note}</span>}
              </span>
              <span className={`amount ${t.type === 'income' ? 'pos' : 'neg'}`}>
                {t.type === 'income' ? '+' : '−'}
                {formatEuro(t.amount)}
              </span>
            </button>
          ))}
        </section>
      ))}

      {editing && <TransactionForm item={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
