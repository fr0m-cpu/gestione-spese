import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '../useData.js';
import { formatAxis, formatEuro, monthLabel, thisMonth } from '../format.js';
import { CATEGORY_COLORS, categoryLabel } from '../categories.js';
import MonthPicker from '../components/MonthPicker.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function Dashboard() {
  const [month, setMonth] = useState(thisMonth());
  const { data, error } = useData(`/summary?month=${month}`);

  if (error && !data) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Caricamento…</p>;

  const { income, expense } = data.monthTotals;
  const net = income - expense;
  const alerts = data.budgets.filter((b) => b.spent >= b.limit * 0.8);
  const trend = data.trend.map((t) => ({
    name: monthLabel(t.month, true),
    Entrate: t.income / 100,
    Uscite: t.expense / 100,
  }));

  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="label">Saldo totale</p>
          <p className={`big ${data.balance < 0 ? 'neg' : ''}`}>{formatEuro(data.balance)}</p>
        </div>
        <div className="hero-split">
          <div>
            <p className="label">Messi da parte</p>
            <p className="mid">{formatEuro(data.savedInGoals)}</p>
          </div>
          <div>
            <p className="label">Disponibile</p>
            <p className={`mid ${data.available < 0 ? 'neg' : ''}`}>{formatEuro(data.available)}</p>
          </div>
        </div>
      </section>

      <MonthPicker month={month} onChange={setMonth} />

      <section className="tiles">
        <div className="tile">
          <p className="label">Entrate</p>
          <p className="mid pos">{formatEuro(income)}</p>
        </div>
        <div className="tile">
          <p className="label">Uscite</p>
          <p className="mid neg">{formatEuro(expense)}</p>
        </div>
        <div className="tile">
          <p className="label">Risparmio del mese</p>
          <p className={`mid ${net < 0 ? 'neg' : 'pos'}`}>{formatEuro(net)}</p>
        </div>
      </section>

      {alerts.length > 0 && (
        <section className="card">
          <h2>Attenzione al budget</h2>
          {alerts.map((b) => (
            <div key={b.category} className="budget-row">
              <div className="row-between">
                <span>{categoryLabel('expense', b.category)}</span>
                <span className={b.spent > b.limit ? 'neg' : 'warn'}>
                  {formatEuro(b.spent)} / {formatEuro(b.limit)}
                </span>
              </div>
              <ProgressBar value={b.spent} max={b.limit} danger />
            </div>
          ))}
        </section>
      )}

      <div className="grid-2">
        <section className="card">
          <h2>Spese per categoria</h2>
          {data.byCategory.length === 0 ? (
            <p className="muted">Nessuna spesa in questo mese.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.byCategory}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.byCategory.map((c) => (
                      <Cell key={c.category} fill={CATEGORY_COLORS[c.category]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [formatEuro(v), categoryLabel('expense', name)]} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="legend">
                {data.byCategory.map((c) => (
                  <li key={c.category}>
                    <span className="dot" style={{ background: CATEGORY_COLORS[c.category] }} />
                    <span>{categoryLabel('expense', c.category)}</span>
                    <span className="amount">{formatEuro(c.total)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card">
          <h2>Ultimi 6 mesi</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trend} margin={{ left: -10, right: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatAxis} width={70} />
              <Tooltip formatter={(v) => formatEuro(Math.round(v * 100))} />
              <Legend iconType="circle" />
              <Bar dataKey="Entrate" fill="var(--pos)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Uscite" fill="var(--neg)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="card">
        <div className="row-between">
          <h2>Obiettivi di risparmio</h2>
          <Link to="/obiettivi">Gestisci</Link>
        </div>
        {data.goals.length === 0 ? (
          <p className="muted">Crea un obiettivo, ad esempio “Vacanza” o “Fondo emergenze”.</p>
        ) : (
          data.goals.map((g) => (
            <div key={g.id} className="budget-row">
              <div className="row-between">
                <span>{g.name}</span>
                <span className="muted">
                  {formatEuro(g.saved)} / {formatEuro(g.target)}
                </span>
              </div>
              <ProgressBar value={g.saved} max={g.target} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
