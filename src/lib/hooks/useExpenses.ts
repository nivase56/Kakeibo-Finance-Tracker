import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Expense } from '../types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select();

      if (error) throw error;
      
      setExpenses(prev => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
      return null;
    }
  };

  const updateExpense = async (updatedExpense: Expense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updatedExpense)
        .eq('id', updatedExpense.id)
        .select();

      if (error) throw error;
      
      setExpenses(prev => 
        prev.map(expense => expense.id === updatedExpense.id ? data[0] : expense)
      );
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses
  };
}
