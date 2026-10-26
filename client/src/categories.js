// Stesse chiavi di server/src/categories.js
export const CATEGORIES = {
  expense: {
    casa: 'Casa',
    spesa: 'Spesa',
    bollette: 'Bollette',
    trasporti: 'Trasporti',
    ristoranti: 'Ristoranti e bar',
    svago: 'Svago',
    salute: 'Salute',
    abbigliamento: 'Abbigliamento',
    abbonamenti: 'Abbonamenti',
    regali: 'Regali',
    altro: 'Altro',
  },
  income: {
    stipendio: 'Stipendio',
    extra: 'Lavori extra',
    rimborsi: 'Rimborsi',
    regali: 'Regali',
    altro: 'Altro',
  },
};

export const CATEGORY_COLORS = {
  casa: '#0f766e',
  spesa: '#2563eb',
  bollette: '#d97706',
  trasporti: '#7c3aed',
  ristoranti: '#db2777',
  svago: '#0891b2',
  salute: '#16a34a',
  abbigliamento: '#ea580c',
  abbonamenti: '#4f46e5',
  regali: '#be123c',
  altro: '#64748b',
};

export const categoryLabel = (type, key) => CATEGORIES[type]?.[key] ?? key;
