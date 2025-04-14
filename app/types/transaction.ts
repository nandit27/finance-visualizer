export const categories = [
  'Food & Dining',
  'Shopping',
  'Housing',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Travel',
  'Income',
  'Investment',
  'Others'
] as const;

export type Category = typeof categories[number];

export interface ITransaction {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
} 