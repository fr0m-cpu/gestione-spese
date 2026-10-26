// Con `danger` la barra diventa arancione all'80% e rossa oltre il 100%
export default function ProgressBar({ value, max, danger = false }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  let tone = 'ok';
  if (danger && value > max) tone = 'over';
  else if (danger && value >= max * 0.8) tone = 'near';
  else if (!danger && value >= max) tone = 'done';

  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`progress-fill ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
