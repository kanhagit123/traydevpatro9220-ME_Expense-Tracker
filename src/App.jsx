import { useEffect, useState } from "react";
import Modal from "react-modal";
import { SnackbarProvider, useSnackbar } from "notistack";
import { FaPlus } from "react-icons/fa";
import "./App.css";

Modal.setAppElement("#root");

function AppContent() {
  const { enqueueSnackbar } = useSnackbar();
  const [walletBalance, setWalletBalance] = useState(
    parseFloat(localStorage.getItem("walletBalance")) || 5000
  );
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [walletBalance, expenses]);

  // Add income
  const handleAddIncome = (e) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0) {
      enqueueSnackbar("Please enter a valid income amount", { variant: "warning" });
      return;
    }
    setWalletBalance(walletBalance + amount);
    setIncomeAmount("");
    setIsIncomeModalOpen(false);
    enqueueSnackbar("Income added successfully!", { variant: "success" });
  };

  // Add expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const { title, price, category, date } = expenseForm;
    const amount = parseFloat(price);

    if (!title || !amount || !category || !date) {
      enqueueSnackbar("All fields are required", { variant: "warning" });
      return;
    }

    if (amount > walletBalance) {
      enqueueSnackbar("Insufficient balance!", { variant: "error" });
      return;
    }

    const newExpense = { title, price: amount, category, date };
    setExpenses([...expenses, newExpense]);
    setWalletBalance(walletBalance - amount);

    // reset form
    setExpenseForm({ title: "", price: "", category: "", date: "" });
    setIsExpenseModalOpen(false);
    enqueueSnackbar("Expense added successfully!", { variant: "success" });
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <h2>Wallet Balance: ${walletBalance.toFixed(2)}</h2>

      {/* Add Income button */}
      <button type="button" onClick={() => setIsIncomeModalOpen(true)}>
        + Add Income
      </button>

      {/* Add Expense button */}
      <button type="button" onClick={() => setIsExpenseModalOpen(true)}>
        + Add Expense
      </button>

      {/* Transactions Section */}
      <div className="transactions">
        <h2>Transactions</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((exp, idx) => (
              <li key={idx}>
                {exp.title} - ${exp.price} - {exp.category} - {exp.date}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIsIncomeModalOpen(false)}
        contentLabel="Add Income"
      >
        <h2>Add Balance</h2>
        <form onSubmit={handleAddIncome}>
          <input
            type="number"
            placeholder="Income Amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
          <button type="submit">Add Balance</button>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => setIsExpenseModalOpen(false)}
        contentLabel="Add Expense"
      >
        <h2>Add Expense</h2>
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={expenseForm.title}
            onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
          />
          <input
            type="number"
            name="price"
            placeholder="Expense Amount"
            value={expenseForm.price}
            onChange={(e) => setExpenseForm({ ...expenseForm, price: e.target.value })}
          />
          <select
            name="category"
            value={expenseForm.category}
            onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input
            type="date"
            name="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
          />
          <button type="submit">Add Expense</button>
        </form>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AppContent />
    </SnackbarProvider>
  );
}
