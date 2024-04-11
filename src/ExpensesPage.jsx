import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { collection, getDocs } from "firebase/firestore";
import db from './firebase'; // Import db from firebase.js


const ExpensesPage = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch monthly data
      const monthlySnapshot = await getDocs(collection(db, "monthlyExpenses"));
      const monthlyExpenses = monthlySnapshot.docs.map((doc) => doc.data());
      setMonthlyData(monthlyExpenses);

      // Fetch daily data
      const dailySnapshot = await getDocs(collection(db, "dailyExpenses"));
      const dailyExpenses = dailySnapshot.docs.map((doc) => doc.data());
      setDailyData(dailyExpenses);

      // Fetch yearly data
      const yearlySnapshot = await getDocs(collection(db, "yearlyExpenses"));
      const yearlyExpenses = yearlySnapshot.docs.map((doc) => doc.data());
      setYearlyData(yearlyExpenses);
    };
    fetchData();
  }, []);

  const formatMonthlyData = monthlyData.map((data) => [
    new Date(data.month), // Convert string date to Date object
    data.total,
  ]);

  const formatDailyData = dailyData.map((data) => [
    new Date(data.date), // Convert string date to Date object
    data.total,
  ]);

  const formatYearlyData = yearlyData.map((data) => [
    data.year,
    data.total,
  ]);

  return (
    <div>
      <h2>Monthly Overview</h2>
      <Chart
        chartType="LineChart"
        data={[["Date", "Total Expenses"], ...formatMonthlyData]}
        options={{ title: "Monthly Overview" }}
        width="100%"
        height="400px"
      />
      <h2>Daily Overview</h2>
      <Chart
        chartType="LineChart"
        data={[["Date", "Total Expenses"], ...formatDailyData]}
        options={{ title: "Daily Overview" }}
        width="100%"
        height="400px"
      />
      <h2>Yearly Overview</h2>
      <Chart
        chartType="LineChart"
        data={[["Year", "Total Expenses"], ...formatYearlyData]}
        options={{ title: "Yearly Overview" }}
        width="100%"
        height="400px"
      />
    </div>
  );
};

export default ExpensesPage;
