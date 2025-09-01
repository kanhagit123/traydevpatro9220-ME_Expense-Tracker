import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryChart from "./components/SummaryChart";
import TrendChart from "./components/TrendChart";

const App = () => {
  const [walletBalance, setWalletBalance] = useState(
    Number(localStorage.getItem("walletBalance")) || 5000
  );
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addBalance = (amount) => {
    setWalletBalance(walletBalance + amount);
  };

  const addExpense = (expense) => {
    if (expense.price > walletBalance) {
      alert("Insufficient wallet balance!");
      return;
    }
    setExpenses([...expenses, expense]);
    setWalletBalance(walletBalance - expense.price);
  };

  const deleteExpense = (id, price) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    setWalletBalance(walletBalance + price);
  };

  const editExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map((exp) =>
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    setExpenses(updatedExpenses);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <Wallet balance={walletBalance} onAddBalance={addBalance} />
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList
        expenses={expenses}
        onDeleteExpense={deleteExpense}
        onEditExpense={editExpense}
      />
      <SummaryChart expenses={expenses} />
      <TrendChart expenses={expenses} />
    </div>
  );
};

export default App;