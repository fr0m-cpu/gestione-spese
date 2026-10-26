import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const owner = { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true };

// Tutti gli importi sono in centesimi (interi) per evitare errori di arrotondamento

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

const transactionSchema = new Schema(
  {
    user: owner,
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },
    note: { type: String, trim: true, default: '' },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);
transactionSchema.index({ user: 1, date: -1 });

const goalSchema = new Schema(
  {
    user: owner,
    name: { type: String, required: true, trim: true },
    target: { type: Number, required: true, min: 1 },
    saved: { type: Number, default: 0, min: 0 },
    deadline: { type: Date, default: null },
  },
  { timestamps: true },
);

const budgetSchema = new Schema({
  user: owner,
  category: { type: String, required: true },
  limit: { type: Number, required: true, min: 1 },
});
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

export const User = model('User', userSchema);
export const Transaction = model('Transaction', transactionSchema);
export const Goal = model('Goal', goalSchema);
export const Budget = model('Budget', budgetSchema);
