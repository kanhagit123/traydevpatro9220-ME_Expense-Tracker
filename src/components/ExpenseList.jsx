import React from "react";

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }) => {
  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.title} - ${exp.price} - {exp.category} - {exp.date}
            <button onClick={() => onDeleteExpense(exp.id, exp.price)}>Delete</button>
            <button
              onClick={() =>
                onEditExpense({ ...exp, title: prompt("Edit Title", exp.title) })
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;