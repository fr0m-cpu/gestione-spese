import { Router } from 'express';
import mongoose from 'mongoose';
import { Budget, Goal, Transaction } from '../models.js';
import { currentMonth, month, monthRange } from '../validation.js';

const router = Router();
const TREND_MONTHS = 6;

function totalsByType(rows) {
  const out = { income: 0, expense: 0 };
  for (const r of rows) out[r._id] = r.total;
  return out;
}

router.get('/', async (req, res) => {
  const m = month.parse(req.query.month ?? currentMonth());
  const user = new mongoose.Types.ObjectId(req.userId);
  const { start, end } = monthRange(m);
  const [y, mm] = m.split('-').map(Number);
  const trendStart = new Date(Date.UTC(y, mm - TREND_MONTHS, 1));

  const [allTime, monthTotals, byCategory, trendRows, goals, budgets] = await Promise.all([
    Transaction.aggregate([
      { $match: { user } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { user, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { user, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: { user, date: { $gte: trendStart, $lt: end } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]),
    Goal.find({ user }).lean(),
    Budget.find({ user }).lean(),
  ]);

  const totals = totalsByType(allTime);
  const balance = totals.income - totals.expense;
  const savedInGoals = goals.reduce((s, g) => s + g.saved, 0);
  const spentByCategory = Object.fromEntries(byCategory.map((c) => [c._id, c.total]));

  // Un punto per ogni mese, anche quelli senza movimenti
  const trend = [];
  for (let i = TREND_MONTHS - 1; i >= 0; i--) {
    const key = new Date(Date.UTC(y, mm - 1 - i, 1)).toISOString().slice(0, 7);
    const point = { month: key, income: 0, expense: 0 };
    for (const r of trendRows) if (r._id.month === key) point[r._id.type] = r.total;
    trend.push(point);
  }

  res.json({
    month: m,
    balance,
    savedInGoals,
    available: balance - savedInGoals,
    monthTotals: totalsByType(monthTotals),
    byCategory: byCategory.map((c) => ({ category: c._id, total: c.total })),
    budgets: budgets.map((b) => ({
      category: b.category,
      limit: b.limit,
      spent: spentByCategory[b.category] ?? 0,
    })),
    goals: goals.map((g) => ({ id: g._id, name: g.name, target: g.target, saved: g.saved })),
    trend,
  });
});

export default router;
