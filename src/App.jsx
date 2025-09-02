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
import "./App.css";

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
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);

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

    if (editId !== null) {
      const idx = expenses.findIndex((exp) => exp.id === editId);
      const diff = amount - expenses[idx].price;
      if (diff > balance) {
        enqueueSnackbar("Insufficient balance for update!", {
          variant: "error",
        });
        return;
      }
      updatedExpenses[idx] = { ...form, id: editId, price: amount };
      setBalance(balance - diff);
      setEditId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title,
        price: amount,
        category,
        date,
      };
      updatedExpenses.push(newExpense);
      setBalance(balance - amount);
    }

    setExpenses(updatedExpenses);
    setForm({ title: "", price: "", category: "", date: "" });
    setExpenseModalOpen(false);
    enqueueSnackbar("Expense saved!", { variant: "success" });
  };

  const handleEdit = (id) => {
    const exp = expenses.find((exp) => exp.id === id);
    setForm(exp);
    setEditId(id);
    setExpenseModalOpen(true);
  };

  const handleDelete = (id) => {
    const exp = expenses.find((exp) => exp.id === id);
    setBalance(balance + exp.price);
    setExpenses(expenses.filter((e) => e.id !== id));
    enqueueSnackbar("Expense deleted!", { variant: "info" });
  };

  const summaryData = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        name: exp.category,
        value: 0,
      };
      acc[exp.category].value += exp.price;
      return acc;
    }, {})
  );

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>

      {/* ✅ Wallet + Expenses cards */}
      <div className="cards">
        <div className="card">
          <h2>Wallet Balance</h2>
          <p>${balance.toFixed(2)}</p>
          <button type="button" onClick={() => setIncomeModalOpen(true)}>
            + Add Income
          </button>
        </div>

        <div className="card">
          <h2>Expenses</h2>
          <p>
            ₹{expenses.reduce((sum, e) => sum + e.price, 0).toFixed(2)}
          </p>
          <button type="button" onClick={() => setExpenseModalOpen(true)}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIncomeModalOpen(false)}
      >
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
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => setExpenseModalOpen(false)}
      >
        <h2>{editId !== null ? "Edit Expense" : "Add Expense"}</h2>
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
          <button type="submit">
            {editId !== null ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </Modal>

      {/* Expenses List */}
      <div className="transactions">
        <h2>Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                {exp.title} - ${exp.price} - {exp.category} - {exp.date}
                <button onClick={() => handleEdit(exp.id)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(exp.id)}>
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
