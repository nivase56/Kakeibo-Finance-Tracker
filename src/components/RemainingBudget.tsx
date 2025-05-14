import { Budget, Expense, ExpenseCategory } from '../lib/types';
import { format } from 'date-fns';

interface RemainingBudgetProps {
  budget: Budget | null;
  expenses: Expense[];
}

export default function RemainingBudget({ budget, expenses }: RemainingBudgetProps) {
  if (!budget) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No budget set for {format(new Date(), 'MMMM yyyy')}. Please set your budget first.
      </div>
    );
  }

  // Filter expenses for current month
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthExpenses = expenses.filter(expense => expense.date.startsWith(currentMonth));
  
  // Calculate totals by category
  const totalByCategory = {
    needs: 0,
    wants: 0,
    culture: 0,
    unexpected: 0
  };
  
  currentMonthExpenses.forEach(expense => {
    totalByCategory[expense.category] += expense.amount;
  });
  
  // Calculate remaining amounts
  const remaining = {
    needs: budget.needs - totalByCategory.needs,
    wants: budget.wants - totalByCategory.wants,
    culture: budget.culture - totalByCategory.culture,
    unexpected: budget.unexpected - totalByCategory.unexpected,
    total: budget.total - (
      totalByCategory.needs +
      totalByCategory.wants +
      totalByCategory.culture +
      totalByCategory.unexpected
    )
  };
  
  // Helper function for progress bar percentage (capped at 100%)
  const getPercentage = (spent: number, budgeted: number) => {
    if (budgeted <= 0) return 0;
    return Math.min(Math.round((spent / budgeted) * 100), 100);
  };
  
  const getBgColor = (spent: number, budgeted: number) => {
    const percentage = getPercentage(spent, budgeted);
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const categories: {key: ExpenseCategory; label: string}[] = [
    { key: 'needs', label: 'Needs (Necessities)' },
    { key: 'wants', label: 'Wants (Enjoyment)' },
    { key: 'culture', label: 'Culture (Self-improvement)' },
    { key: 'unexpected', label: 'Unexpected (Emergencies)' }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Remaining Budget for {format(new Date(), 'MMMM yyyy')}
        </h3>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ${remaining.total.toFixed(2)} / ${budget.total.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getBgColor(budget.total - remaining.total, budget.total)}`} 
              style={{ width: `${getPercentage(budget.total - remaining.total, budget.total)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
        
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${remaining[cat.key].toFixed(2)} / ${budget[cat.key].toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getBgColor(budget[cat.key] - remaining[cat.key], budget[cat.key])}`} 
                  style={{ width: `${getPercentage(budget[cat.key] - remaining[cat.key], budget[cat.key])}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Spent: ${(budget[cat.key] - remaining[cat.key]).toFixed(2)}</span>
                <span>
                  {getPercentage(budget[cat.key] - remaining[cat.key], budget[cat.key])}% used
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
