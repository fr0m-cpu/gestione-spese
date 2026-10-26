import { useState } from 'react';
import { api, notifyChange } from '../api.js';
import { useData } from '../useData.js';
import { centsToInput, formatEuro, monthLabel, parseEuro, thisMonth } from '../format.js';
import { CATEGORIES } from '../categories.js';
import ProgressBar from '../components/ProgressBar.jsx';

function BudgetRow({ category, label, budget, spent }) {
  const [value, setValue] = useState(budget ? centsToInput(budget.limit) : '');
  const [error, setError] = useState('');

  async function save() {
    const text = value.trim();
    if (!text && !budget) return;
    try {
      if (!text) {
        await api(`/budgets/${category}`, { method: 'DELETE' });
      } else {
        const cents = parseEuro(text);
        if (!cents) return setError('Importo non valido');
        if (cents === budget?.limit) return;
        await api(`/budgets/${category}`, { method: 'PUT', body: { limit: cents } });
      }
      setError('');
      notifyChange();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="budget-row">
      <div className="row-between">
        <span>{label}</span>
        <span className="budget-input">
          <span className="muted small">{formatEuro(spent)} /</span>
          <input
            inputMode="decimal"
            placeholder="nessun limite"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            aria-label={`Budget mensile ${label}`}
          />
          <span className="muted small">€</span>
        </span>
      </div>
      {budget && <ProgressBar value={spent} max={budget.limit} danger />}
      {error && <p className="error small">{error}</p>}
    </div>
  );
}

export default function Budgets() {
  const month = thisMonth();
  const { data, error } = useData(`/summary?month=${month}`);

  if (error && !data) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Caricamento…</p>;

  const spent = Object.fromEntries(data.byCategory.map((c) => [c.category, c.total]));
  const budgets = Object.fromEntries(data.budgets.map((b) => [b.category, b]));
  const totalLimit = data.budgets.reduce((s, b) => s + b.limit, 0);

  return (
    <div className="stack">
      <h1>Budget mensile</h1>
      <p className="muted">
        Imposta quanto vuoi spendere al massimo ogni mese per categoria. Spese di {monthLabel(month)}.
        {totalLimit > 0 && ` Totale budget: ${formatEuro(totalLimit)}.`}
      </p>
      <section className="card">
        {Object.entries(CATEGORIES.expense).map(([key, label]) => (
          <BudgetRow
            key={`${key}-${budgets[key]?.limit ?? 0}`}
            category={key}
            label={label}
            budget={budgets[key]}
            spent={spent[key] ?? 0}
          />
        ))}
      </section>
    </div>
  );
}
