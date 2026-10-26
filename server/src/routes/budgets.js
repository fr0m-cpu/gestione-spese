import { Router } from 'express';
import { z } from 'zod';
import { Budget } from '../models.js';
import { CATEGORIES } from '../categories.js';
import { cents } from '../validation.js';

const router = Router();

const category = z.enum(CATEGORIES.expense, { message: 'Categoria non valida' });

router.get('/', async (req, res) => {
  res.json(await Budget.find({ user: req.userId }).sort({ category: 1 }).lean());
});

// Crea o aggiorna il limite mensile di una categoria
router.put('/:category', async (req, res) => {
  const cat = category.parse(req.params.category);
  const { limit } = z.object({ limit: cents }).parse(req.body);
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, category: cat },
    { limit },
    { new: true, upsert: true },
  );
  res.json(budget);
});

router.delete('/:category', async (req, res) => {
  await Budget.deleteOne({ user: req.userId, category: category.parse(req.params.category) });
  res.status(204).end();
});

export default router;
