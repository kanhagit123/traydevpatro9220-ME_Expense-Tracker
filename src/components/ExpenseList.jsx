import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }) => {
  return (
    <div>
      <h2>Expenses</h2>   {/* ✅ Cypress expects this heading */}
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expenses.map((exp) => (
            <li key={exp.id}>
              <span>{exp.title} - ${exp.price} - {exp.category} - {exp.date}</span>
              <button onClick={() => onEditExpense(exp)}>
                <FaEdit />
              </button>
              <button onClick={() => onDeleteExpense(exp.id, exp.price)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
