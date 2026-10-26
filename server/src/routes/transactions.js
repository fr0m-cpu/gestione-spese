import { Router } from 'express';
import { z } from 'zod';
import { Transaction } from '../models.js';
import { CATEGORIES } from '../categories.js';
import { cents, currentMonth, isoDate, month, monthRange } from '../validation.js';

const router = Router();

const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense'], { message: 'Tipo non valido' }),
    amount: cents,
    category: z.string(),
    note: z.string().trim().max(200).default(''),
    date: isoDate,
  })
  .refine((t) => CATEGORIES[t.type].includes(t.category), {
    message: 'Categoria non valida',
  });

router.get('/', async (req, res) => {
  const { start, end } = monthRange(month.parse(req.query.month ?? currentMonth()));
  const items = await Transaction.find({ user: req.userId, date: { $gte: start, $lt: end } })
    .sort({ date: -1, createdAt: -1 })
    .lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const data = transactionSchema.parse(req.body);
  const item = await Transaction.create({ ...data, user: req.userId });
  res.status(201).json(item);
});

router.put('/:id', async (req, res) => {
  const data = transactionSchema.parse(req.body);
  const item = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.userId }, data, {
    new: true,
  });
  if (!item) return res.status(404).json({ error: 'Movimento non trovato' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const { deletedCount } = await Transaction.deleteOne({ _id: req.params.id, user: req.userId });
  if (!deletedCount) return res.status(404).json({ error: 'Movimento non trovato' });
  res.status(204).end();
});

export default router;
