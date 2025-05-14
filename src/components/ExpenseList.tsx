import { Expense } from '../lib/types';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No expenses recorded yet.
      </div>
    );
  }

  const categoryColors = {
    needs: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    wants: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    culture: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    unexpected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Expenses</h3>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="min-w-[3rem] text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(new Date(expense.date), 'MMM')}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {format(new Date(expense.date), 'd')}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {expense.description}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${categoryColors[expense.category]}`}
                  >
                    {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ₹{expense.amount.toFixed(2)}
              </div>
              <button 
                onClick={() => expense.id && onDelete(expense.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete expense"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
