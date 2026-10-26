import { Router } from 'express';
import { z } from 'zod';
import { Goal } from '../models.js';
import { cents, isoDate } from '../validation.js';

const router = Router();

const goalSchema = z.object({
  name: z.string().trim().min(1, 'Dai un nome all\'obiettivo').max(60),
  target: cents,
  deadline: isoDate.nullable().default(null),
});

// amount positivo = versamento, negativo = prelievo
const moveSchema = z.object({
  amount: z.number().int('Importo non valido').refine((n) => n !== 0, 'Importo non valido'),
});

router.get('/', async (req, res) => {
  res.json(await Goal.find({ user: req.userId }).sort({ createdAt: 1 }).lean());
});

router.post('/', async (req, res) => {
  const goal = await Goal.create({ ...goalSchema.parse(req.body), user: req.userId });
  res.status(201).json(goal);
});

router.put('/:id', async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    goalSchema.parse(req.body),
    { new: true },
  );
  if (!goal) return res.status(404).json({ error: 'Obiettivo non trovato' });
  res.json(goal);
});

router.post('/:id/move', async (req, res) => {
  const { amount } = moveSchema.parse(req.body);
  // Aggiornamento atomico: un prelievo non può portare il risparmio sotto zero
  const filter = { _id: req.params.id, user: req.userId };
  if (amount < 0) filter.saved = { $gte: -amount };
  const goal = await Goal.findOneAndUpdate(filter, { $inc: { saved: amount } }, { new: true });
  if (!goal) {
    const exists = await Goal.exists({ _id: req.params.id, user: req.userId });
    return exists
      ? res.status(400).json({ error: 'Non puoi prelevare più di quanto hai messo da parte' })
      : res.status(404).json({ error: 'Obiettivo non trovato' });
  }
  res.json(goal);
});

router.delete('/:id', async (req, res) => {
  const { deletedCount } = await Goal.deleteOne({ _id: req.params.id, user: req.userId });
  if (!deletedCount) return res.status(404).json({ error: 'Obiettivo non trovato' });
  res.status(204).end();
});

export default router;
