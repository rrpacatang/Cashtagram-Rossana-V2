import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from './firebase'; // Import db from firebase.js

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const colors = {
  Housing: "#FFB3BA",
  Utilities: "#FFD3BA",
  Transportation: "#FFFFBA",
  Food: "#BAFFC9",
  Healthcare: "#BAE1FF",
  Clothes: "#BAC2FF",
  "Personal Care": "#D9BAFF",
  Entertainment: "#FFBACD",
  Others: "#689534",
};

const HomePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate total expenses whenever expenses change
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpenses(total);
  }, [expenses]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleAddExpense = () => {
    navigate("/add");
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      // Delete the expense from Firestore
      await deleteDoc(doc(db, "expenses", expenseId));

      // Update the expenses state to remove the deleted expense
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      // Handle error here (e.g., show error message to user)
    }
  };

  const options = {
    title: selectedMonth,
    pieHole: 0.4,
    pieSliceText: "label",
    legend: "none",
    pieSliceTextStyle: {
      color: "black",
    },
    pieStartAngle: 100,
    tooltip: { isHtml: true },
    chartArea: {
      left: "5%",
      top: "5%",
      width: "45%", // Adjusted to make space for legend
      height: "90%",
    },
    slices: expenses.map((_, index) => ({ color: colors[expenses[index].category] || "gray" })),
  };

  const data = [
    ["Expense", "Amount", { role: "style" }, { role: "tooltip", type: "string", p: { html: true } }],
    ...expenses.map((expense, index) => {
      const color = colors[expense.category] || "gray"; // Default color if category not found
      return [expense.description, expense.amount, color, `<b>$${expense.amount.toFixed(2)}</b>`];
    }),
  ];

  const expenseList = (
    <table className="expense-list">
      <tbody>
        {expenses.map((expense, index) => (
          <tr key={index}>
            <td className="expense-cell" style={{ backgroundColor: colors[expense.category] }}>{expense.description}</td>
            <td className="expense-cell">${expense.amount.toFixed(2)}</td>
            <td className="expense-cell">
              <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const categoryLegends = (
    <table className="category-legends">
      <h1>Category Legends</h1>
      <tbody>
        {Object.entries(colors).map(([category, color]) => (
          <tr key={category}>
            <td className="category-legend" style={{ backgroundColor: color }}>{category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const monthOptions = months.map((month) => (
    <option key={month} value={month}>{month}</option>
  ));

  return (
    <div className="homepage-container">
      <div className="left-column">
        <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions}
        </select>
        <button onClick={handleAddExpense}>Add Expense</button>
        <Chart
          className="chart"
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
        />
<div className="total-expenses">
  <h1>Total Expenses: {totalExpenses}</h1>
</div>
      </div>
      <div className="right-column">
        {expenseList}
        {categoryLegends}
      </div>
    </div>
  );
};

export default HomePage;
