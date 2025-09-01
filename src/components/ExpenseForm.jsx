import React, { useState } from "react";

const ExpenseForm = ({ onAddExpense }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.date) {
      alert("All fields are required!");
      return;
    }
    const newExpense = { ...form, id: Date.now(), price: Number(form.price) };
    onAddExpense(newExpense);
    setForm({ title: "", price: "", category: "", date: "" });
  };

  return (
    <div>
      <button type="button" onClick={() => document.getElementById("expenseForm").style.display = "block"}>
        + Add Expense
      </button>
      <form id="expenseForm" onSubmit={handleSubmit} style={{ display: "none" }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;