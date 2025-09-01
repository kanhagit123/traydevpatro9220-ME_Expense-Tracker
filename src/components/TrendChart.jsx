import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const TrendChart = ({ expenses }) => {
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
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#82ca9d" />
    </BarChart>
  );
};

export default TrendChart;