"use client";

import { useEffect, useState } from "react";
import { useExpenses } from "../lib/hooks/useExpenses";
import { useBudget } from "../lib/hooks/useBudget";
import TabNavigation from "../components/TabNavigation";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import BudgetForm from "../components/BudgetForm";
import RemainingBudget from "../components/RemainingBudget";
import InsightsTab from "../components/InsightsTab";
import { Budget, Expense } from "@/lib/types";
import editSvg from "../../public/edit-button.svg";
import Image from "next/image";
export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    expenses,
    isLoading: expensesLoading,
    addExpense,
    deleteExpense,
  } = useExpenses();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const { budget, isLoading: budgetLoading, saveBudget } = useBudget();
  console.log(expensesLoading, expenses);

  useEffect(()=>{
    console.log(expenses, "Test");
    
    if(expenses.length > 0 ){
      setShowExpenseForm(false)
    }else{
      setShowExpenseForm(true)
    }
  },[expenses])

  const handleAddExpense = async (
    newExpense: Omit<Expense, "id" | "createdAt">
  ) => {
    await addExpense(newExpense);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const handleSaveBudget = async (newBudget: Budget) => {
    await saveBudget(newBudget);
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kakeibo Finance Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Smart budgeting inspired by the Japanese art of saving
        </p>
      </header>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card relative">
            <div className="flex items-center justify-between">
              <button
                className="text-sm bg-gray-900 shadow-2xl mb-5 text-white p-2 font-semibold rounded-xs hover:underline"
                onClick={() => setShowExpenseForm((prev) => !prev)}
              >
                Add New Expense
                <Image src={editSvg} alt="editSvg" className="w-5 h-5 inline mx-1"/>
              </button>
            </div>
            {showExpenseForm && <ExpenseForm onSubmit={handleAddExpense} />}
          </div>
          <div>
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <BudgetForm
              budget={budget}
              onSave={handleSaveBudget}
              isLoading={budgetLoading}
            />
          </div>
          <div>
            <RemainingBudget budget={budget} expenses={expenses} />
          </div>
        </div>
      )}

      {activeTab === 2 && <InsightsTab expenses={expenses} budget={budget} />}
    </main>
  );
}
