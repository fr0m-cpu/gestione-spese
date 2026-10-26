import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Budget, Goal, Transaction, User } from '../models.js';
import { clearAuthCookie, requireAuth, setAuthCookie } from '../auth.js';

const router = Router();

const email = z.string().trim().toLowerCase().email('Email non valida').max(200);

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Inserisci il tuo nome').max(60),
  email,
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri').max(100),
});

const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Inserisci la password').max(100),
});

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

router.post('/register', async (req, res) => {
  const data = registerSchema.parse(req.body);
  if (await User.exists({ email: data.email })) {
    return res.status(409).json({ error: 'Esiste già un account con questa email' });
  }
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: await bcrypt.hash(data.password, 12),
  });
  setAuthCookie(res, user._id);
  res.status(201).json(publicUser(user));
});

router.post('/login', async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ error: 'Email o password errati' });
  }
  setAuthCookie(res, user._id);
  res.json(publicUser(user));
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'Accesso richiesto' });
  res.json(publicUser(user));
});

// Elimina l'account e tutti i dati collegati
router.delete('/me', requireAuth, async (req, res) => {
  const user = req.userId;
  await Promise.all([
    Transaction.deleteMany({ user }),
    Goal.deleteMany({ user }),
    Budget.deleteMany({ user }),
    User.deleteOne({ _id: user }),
  ]);
  clearAuthCookie(res);
  res.status(204).end();
});

export default router;
