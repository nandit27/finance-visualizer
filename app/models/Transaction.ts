import mongoose from 'mongoose';
import { Category, categories } from '../types/transaction';

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: categories, required: true },
}, {
  timestamps: true
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 