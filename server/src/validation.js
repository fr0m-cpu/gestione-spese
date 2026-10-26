import { z } from 'zod';

// Importo in centesimi, positivo, fino a 10 milioni di euro
export const cents = z
  .number({ invalid_type_error: 'Importo non valido' })
  .int('Importo non valido')
  .positive('L\'importo deve essere maggiore di zero')
  .max(1_000_000_000, 'Importo troppo alto');

// Data in formato AAAA-MM-GG, salvata a mezzanotte UTC
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida')
  .transform((s) => new Date(`${s}T00:00:00Z`))
  .refine((d) => !Number.isNaN(d.getTime()), 'Data non valida');

export const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mese non valido');

export function monthRange(m) {
  const [y, mm] = m.split('-').map(Number);
  return { start: new Date(Date.UTC(y, mm - 1, 1)), end: new Date(Date.UTC(y, mm, 1)) };
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}
