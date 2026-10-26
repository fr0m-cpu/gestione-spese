import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { requireAuth } from './auth.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import goalRoutes from './routes/goals.js';
import budgetRoutes from './routes/budgets.js';
import summaryRoutes from './routes/summary.js';

const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'client', 'dist');

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  // Usato da Render per verificare che il server sia attivo
  app.get('/api/health', (req, res) => res.json({ ok: true }));

  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
  app.use('/api/transactions', requireAuth, transactionRoutes);
  app.use('/api/goals', requireAuth, goalRoutes);
  app.use('/api/budgets', requireAuth, budgetRoutes);
  app.use('/api/summary', requireAuth, summaryRoutes);
  app.use('/api', (req, res) => res.status(404).json({ error: 'Non trovato' }));

  // In produzione il server pubblica anche il frontend compilato
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.use((req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.issues[0]?.message ?? 'Dati non validi' });
    }
    if (err.name === 'CastError') return res.status(404).json({ error: 'Non trovato' });
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  });

  return app;
}
