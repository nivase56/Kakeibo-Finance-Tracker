import { Expense, Budget, ExpenseCategory } from '../lib/types';
import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format, subMonths, parseISO } from 'date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface InsightsTabProps {
  expenses: Expense[];
  budget: Budget | null;
}

export default function InsightsTab({ expenses, budget }: InsightsTabProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No expense data available yet. Add some expenses to see insights.
      </div>
    );
  }

  // Current month expenses
  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthExpenses = expenses.filter(expense => expense.date.startsWith(currentMonth));
  
  // Calculate category totals for current month
  const categoryTotals = {
    needs: 0,
    wants: 0,
    culture: 0,
    unexpected: 0
  };
  
  currentMonthExpenses.forEach(expense => {
    categoryTotals[expense.category] += expense.amount;
  });
  
  // Category colors
  const categoryColors = {
    needs: 'rgba(34, 197, 94, 0.7)',
    wants: 'rgba(168, 85, 247, 0.7)',
    culture: 'rgba(59, 130, 246, 0.7)',
    unexpected: 'rgba(239, 68, 68, 0.7)'
  };
  
  // Prepare data for pie chart
  const pieData = {
    labels: ['Needs', 'Wants', 'Culture', 'Unexpected'],
    datasets: [
      {
        data: [
          categoryTotals.needs,
          categoryTotals.wants,
          categoryTotals.culture,
          categoryTotals.unexpected
        ],
        backgroundColor: [
          categoryColors.needs,
          categoryColors.wants,
          categoryColors.culture,
          categoryColors.unexpected
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Monthly trends (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'yyyy-MM');
  }).reverse();
  
  const monthlyTotals = last6Months.map(month => {
    const monthExpenses = expenses.filter(expense => expense.date.startsWith(month));
    return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  });
  
  const barData = {
    labels: last6Months.map(month => format(parseISO(`${month}-01`), 'MMM yyyy')),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyTotals,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate spending statistics
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgDailySpend = totalSpent / (new Date().getDate());
  
  // Find top spending categories
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category);
  
  // Top expense
  const topExpense = [...currentMonthExpenses].sort((a, b) => b.amount - a.amount)[0];
  
  // Check budget status
  const budgetStatus = budget 
    ? (totalSpent / budget.total) * 100 
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Spending Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Spending Breakdown
          </h3>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Total spent:₹{totalSpent.toFixed(2)}
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Spending Trends
          </h3>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Last 6 Months Spending'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}`
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Spending Insights */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          This Month&apos;s Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Daily Average</h4>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ₹{avgDailySpend.toFixed(2)}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Average daily spending this month
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <h4 className="font-medium text-purple-800 dark:text-purple-200">Top Category</h4>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 capitalize">
              {sortedCategories[0]}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">
            ₹{categoryTotals[sortedCategories[0] as ExpenseCategory].toFixed(2)} spent
            </p>
          </div>
          
          {topExpense && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900 rounded-lg">
            <h4 className="font-medium text-amber-800 dark:text-amber-200">Largest Expense</h4>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            ₹{topExpense.amount.toFixed(2)}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {topExpense.description} ({format(new Date(topExpense.date), 'MMM d')})
            </p>
          </div>
          )}
          
          {budgetStatus !== null && (
          <div className={`p-4 ${budgetStatus > 90 ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'} rounded-lg`}>
            <h4 className={`font-medium ${budgetStatus > 90 ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
              Budget Status
            </h4>
            <p className={`text-2xl font-bold ${budgetStatus > 90 ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
              {budgetStatus.toFixed(0)}% Used
            </p>
            <p className={`text-sm ${budgetStatus > 90 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
            ₹{((budget?.total ?? 0) - totalSpent).toFixed(2)} remaining
            </p>
          </div>
          )}
        </div>
      </div>
      
      {/* Spending Reflection */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Kakeibo Reflection Questions
        </h3>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-medium mb-1">How much money do you have?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Reflect on your overall financial position and savings.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">How much would you like to save?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Consider your savings goals for this month and beyond.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">How much are you spending?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This month&apos;s spending: ${totalSpent.toFixed(2)}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">How can you improve?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Reflect on your spending habits and areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}