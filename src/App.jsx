import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { SnackbarProvider, useSnackbar } from "notistack";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

Modal.setAppElement("#root");

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function AppContent() {
  const { enqueueSnackbar } = useSnackbar();
  const [balance, setBalance] = useState(
    Number(localStorage.getItem("balance")) || 5000
  );
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );
  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [form, setForm] = useState({ title: "", price: "", category: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("balance", balance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [balance, expenses]);

  const handleAddIncome = (e) => {
    e.preventDefault();
    const amount = Number(incomeAmount);
    if (amount > 0) {
      setBalance(balance + amount);
      setIncomeAmount("");
      setIncomeModalOpen(false);
      enqueueSnackbar("Income added!", { variant: "success" });
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const { title, price, category, date } = form;
    if (!title || !price || !category || !date) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }
    const amount = Number(price);
    if (amount > balance) {
      enqueueSnackbar("Insufficient balance!", { variant: "error" });
      return;
    }
    let updatedExpenses = [...expenses];
    if (editIndex !== null) {
      const diff = amount - expenses[editIndex].price;
      if (diff > balance) {
        enqueueSnackbar("Insufficient balance for update!", { variant: "error" });
        return;
      }
      updatedExpenses[editIndex] = { title, price: amount, category, date };
      setBalance(balance - diff);
      setEditIndex(null);
    } else {
      updatedExpenses.push({ title, price: amount, category, date });
      setBalance(balance - amount);
    }
    setExpenses(updatedExpenses);
    setForm({ title: "", price: "", category: "", date: "" });
    setExpenseModalOpen(false);
    enqueueSnackbar("Expense saved!", { variant: "success" });
  };

  const handleEdit = (index) => {
    setForm(expenses[index]);
    setEditIndex(index);
    setExpenseModalOpen(true);
  };

  const handleDelete = (index) => {
    const exp = expenses[index];
    setBalance(balance + exp.price);
    setExpenses(expenses.filter((_, i) => i !== index));
    enqueueSnackbar("Expense deleted!", { variant: "info" });
  };

  const summaryData = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || { name: exp.category, value: 0 };
      acc[exp.category].value += exp.price;
      return acc;
    }, {})
  );

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <h2>Wallet Balance: ${balance.toFixed(2)}</h2>

      <button type="button" onClick={() => setIncomeModalOpen(true)}>
        + Add Income
      </button>
      <button type="button" onClick={() => setExpenseModalOpen(true)}>
        + Add Expense
      </button>

      {/* Income Modal */}
      <Modal isOpen={isIncomeModalOpen} onRequestClose={() => setIncomeModalOpen(false)}>
        <h2>Add Balance</h2>
        <form onSubmit={handleAddIncome}>
          <input
            type="number"
            placeholder="Income Amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            required
          />
          <button type="submit">Add Balance</button>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onRequestClose={() => setExpenseModalOpen(false)}>
        <h2>{editIndex !== null ? "Edit Expense" : "Add Expense"}</h2>
        <form onSubmit={handleAddExpense}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Amount"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <button type="submit">Add Expense</button>
        </form>
      </Modal>

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
                <button onClick={() => handleEdit(idx)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(idx)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Charts */}
      <h2>Expense Summary</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={summaryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {summaryData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h2>Expense Trends</h2>
      <BarChart width={500} height={300} data={summaryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
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
