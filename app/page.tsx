'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const transactionSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Amount must be a non-zero number",
  }),
  description: z.string().min(3, "Description must be at least 3 characters"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface Transaction extends TransactionForm {
  _id: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onSubmit = async (data: TransactionForm) => {
    try {
      const url = editingTransaction
        ? '/api/transactions'
        : '/api/transactions';
      
      const method = editingTransaction ? 'PUT' : 'POST';
      const body = editingTransaction
        ? { ...data, id: editingTransaction._id }
        : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save transaction');

      toast.success(
        editingTransaction
          ? 'Transaction updated successfully'
          : 'Transaction added successfully'
      );

      setIsDialogOpen(false);
      setEditingTransaction(null);
      reset();
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setValue('amount', transaction.amount);
    setValue('description', transaction.description);
    setValue('date', transaction.date);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth.amount += Number(transaction.amount);
    } else {
      acc.push({ month, amount: Number(transaction.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Personal Finance Tracker</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(null);
            reset();
          }
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  {...register('description')}
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  {...register('date')}
                  type="date"
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#40E0D0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground">No transactions yet</p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex justify-between items-center p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-bold ${Number(transaction.amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${Math.abs(Number(transaction.amount)).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
