import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SummaryChart = ({ expenses }) => {
  const data = expenses.reduce((acc, exp) => {
    const found = acc.find((item) => item.name === exp.category);
    if (found) {
      found.value += exp.price;
    } else {
      acc.push({ name: exp.category, value: exp.price });
    }
    return acc;
  }, []);

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default SummaryChart;