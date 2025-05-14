import { useState, useEffect } from 'react';
import { Budget } from '../lib/types';
import { format } from 'date-fns';

interface BudgetFormProps {
  budget: Budget | null;
  onSave: (budget: Budget) => Promise<void>;
  isLoading: boolean;
}

export default function BudgetForm({ budget, onSave, isLoading }: BudgetFormProps) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [total, setTotal] = useState('');
  const [needs, setNeeds] = useState('');
  const [wants, setWants] = useState('');
  const [culture, setCulture] = useState('');
  const [unexpected, setUnexpected] = useState('');
  
  useEffect(() => {
    if (budget) {
      setTotal(budget.total.toString());
      setNeeds(budget.needs.toString());
      setWants(budget.wants.toString());
      setCulture(budget.culture.toString());
      setUnexpected(budget.unexpected.toString());
    }
  }, [budget]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onSave({
      id: budget?.id,
      month: currentMonth,
      total: parseFloat(total) || 0,
      needs: parseFloat(needs) || 0,
      wants: parseFloat(wants) || 0,
      culture: parseFloat(culture) || 0,
      unexpected: parseFloat(unexpected) || 0,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Budget</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Budget for {format(new Date(), 'MMMM yyyy')}
            </label>
            <input
              type="number"
              id="total"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Allocate Your Budget</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="needs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Needs (Necessities)
            </label>
            <input
              type="number"
              id="needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Essential spending: rent, groceries, utilities, transport
            </p>
          </div>
          
          <div>
            <label htmlFor="wants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wants (Enjoyment)
            </label>
            <input
              type="number"
              id="wants"
              value={wants}
              onChange={(e) => setWants(e.target.value)}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Non-essential purchases: dining out, entertainment, shopping
            </p>
          </div>
          
          <div>
            <label htmlFor="culture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Culture (Self-improvement)
            </label>
            <input
              type="number"
              id="culture"
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Personal growth: books, education, fitness, health
            </p>
          </div>
          
          <div>
            <label htmlFor="unexpected" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unexpected (Emergencies)
            </label>
            <input
              type="number"
              id="unexpected"
              value={unexpected}
              onChange={(e) => setUnexpected(e.target.value)}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Unforeseen costs: repairs, medical expenses, emergencies
            </p>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Budget'}
      </button>
      
      {parseFloat(needs) + parseFloat(wants) + parseFloat(culture) + parseFloat(unexpected) !== parseFloat(total) && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
          Note: Your category allocations don&apos;t add up to your total budget.
        </div>
      )}
    </form>
  );
}
