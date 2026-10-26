import { monthLabel, shiftMonth, thisMonth } from '../format.js';

export default function MonthPicker({ month, onChange }) {
  const isCurrent = month === thisMonth();
  return (
    <div className="month-picker">
      <button className="icon-btn" onClick={() => onChange(shiftMonth(month, -1))} aria-label="Mese precedente">
        ‹
      </button>
      <span>{monthLabel(month)}</span>
      <button
        className="icon-btn"
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={isCurrent}
        aria-label="Mese successivo"
      >
        ›
      </button>
    </div>
  );
}
