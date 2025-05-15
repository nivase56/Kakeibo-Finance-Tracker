import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Budget } from '../types';
import { format } from 'date-fns';

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentMonth = format(new Date(), 'yyyy-MM');

  const fetchBudget = async (month = currentMonth) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', month)
        .maybeSingle();

      if (error) throw error;
      
      setBudget(data);
    } catch (err) {
      console.error('Error fetching budget:', err);
      setError('Failed to fetch budget');
    } finally {
      setIsLoading(false);
    }
  };

  const saveBudget = async (newBudget: Budget) => {
    try {
      // Check if budget for this month already exists
      if (budget?.id) {
        // Update existing budget
        const { data, error } = await supabase
          .from('budgets')
          .update({
            month: newBudget.month,
            total: newBudget.total,
            needs: newBudget.needs,
            wants: newBudget.wants,
            culture: newBudget.culture,
            unexpected: newBudget.unexpected
          })
          .eq('id', budget.id)
          .select();
  
        if (error) throw error;
        
        setBudget(data[0]);
      } else {
        // Create new budget - omit the id field entirely to let the database generate it
        const { data, error } = await supabase
          .from('budgets')
          .insert([{
            month: newBudget.month,
            total: newBudget.total,
            needs: newBudget.needs,
            wants: newBudget.wants,
            culture: newBudget.culture,
            unexpected: newBudget.unexpected
          }])
          .select();
  
        if (error) throw error;
        
        setBudget(data[0]);
      }
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget');
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return {
    budget,
    isLoading,
    error,
    saveBudget,
    refreshBudget: fetchBudget
  };
}
