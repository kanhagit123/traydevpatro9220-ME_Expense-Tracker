import React, { useState } from "react";

const Wallet = ({ balance, onAddBalance }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onAddBalance(Number(amount));
    setAmount("");
  };

  return (
    <div>
      <h2>Wallet Balance: ${balance}</h2>
      <button type="button" onClick={() => document.getElementById("incomeForm").style.display = "block"}>
        + Add Income
      </button>
      <form id="incomeForm" onSubmit={handleSubmit} style={{ display: "none" }}>
        <input
          type="number"
          placeholder="Income Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Balance</button>
      </form>
    </div>
  );
};

export default Wallet;