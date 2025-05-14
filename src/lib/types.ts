export type ExpenseCategory = 'needs' | 'wants' | 'culture' | 'unexpected';

export interface Expense {
  id?: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
  category: ExpenseCategory;
  createdAt?: string;
}

export interface Budget {
  id?: string;
  month: string; // YYYY-MM
  total: number;
  needs: number;
  wants: number;
  culture: number;
  unexpected: number;
}