// useGrouping 'always': in italiano Intl non separa le migliaia sotto 10.000 (1881 invece di 1.881)
const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', useGrouping: 'always' });
const plain = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0, useGrouping: 'always' });

export const formatAxis = (euros) => `${plain.format(euros)} €`;

export const formatEuro = (cents) => euro.format(cents / 100);

// Accetta "12,50", "12.50", "1.234,56" e restituisce i centesimi (o NaN)
export function parseEuro(text) {
  let s = String(text).trim().replace(/\s|€/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return NaN;
  return Math.round(Number(s) * 100);
}

export const centsToInput = (cents) => (cents / 100).toFixed(2).replace('.', ',');

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const thisMonth = () => today().slice(0, 7);

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export function monthLabel(month, short = false) {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('it-IT', {
    month: short ? 'short' : 'long',
    year: short ? undefined : 'numeric',
    timeZone: 'UTC',
  });
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
