import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import db from '../firebase';
import { useNavigate } from 'react-router-dom';
import styles from '../Style/ExpensesPage.module.css';
import { FaEdit, FaTrash, FaSort, FaSearch } from 'react-icons/fa';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState({
    amount: 'asc',
    category: 'asc',
    description: 'asc',
    date: 'asc',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let expensesQuery = collection(db, 'expenses');

        if (selectedMonth) {
          const monthIndex = months.indexOf(selectedMonth);
          const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
          const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 0);

          expensesQuery = query(expensesQuery, where('date', '>=', startDate), where('date', '<=', endDate));
        }

        if (selectedYear) {
          const startYearDate = new Date(selectedYear, 0, 1);
          const endYearDate = new Date(selectedYear, 11, 31);

          expensesQuery = query(expensesQuery, where('date', '>=', startYearDate), where('date', '<=', endYearDate));
        }

        const querySnapshot = await getDocs(expensesQuery);
        const expensesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, searchQuery]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleAddButtonClick = () => {
    navigate('/add');
  };

  const handleClearButtonClick = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setSearchQuery('');
  };

  const handleEditExpense = async (expenseId) => {
    navigate(`/add/${expenseId}`);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
      if (!confirmDelete) {
        return;
      }

      await deleteDoc(doc(db, 'expenses', expenseId));
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseId));
      console.log('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSort = (column) => {
    let sortedExpenses = [...expenses];

    // Implement sorting logic based on the column clicked
    switch (column) {
      case 'amount':
        sortedExpenses.sort((a, b) => {
          const direction = sortDirection.amount === 'asc' ? 1 : -1;
          return direction * (a.amount - b.amount);
        });
        setSortDirection(prevState => ({
          ...prevState,
          amount: sortDirection.amount === 'asc' ? 'desc' : 'asc',
        }));
        break;
      case 'category':
        sortedExpenses.sort((a, b) => {
          const direction = sortDirection.category === 'asc' ? 1 : -1;
          return direction * a.category.localeCompare(b.category);
        });
        setSortDirection(prevState => ({
          ...prevState,
          category: sortDirection.category === 'asc' ? 'desc' : 'asc',
        }));
        break;
      case 'description':
        sortedExpenses.sort((a, b) => {
          const direction = sortDirection.description === 'asc' ? 1 : -1;
          return direction * a.description.localeCompare(b.description);
        });
        setSortDirection(prevState => ({
          ...prevState,
          description: sortDirection.description === 'asc' ? 'desc' : 'asc',
        }));
        break;
      case 'date':
        sortedExpenses.sort((a, b) => {
          const direction = sortDirection.date === 'asc' ? 1 : -1;
          const dateA = a.date ? a.date.toDate() : new Date(0);
          const dateB = b.date ? b.date.toDate() : new Date(0);
          return direction * (dateA - dateB);
        });
        setSortDirection(prevState => ({
          ...prevState,
          date: sortDirection.date === 'asc' ? 'desc' : 'asc',
        }));
        break;
      default:
        break;
    }

    setExpenses(sortedExpenses);
  };

  const handleSearch = () => {
    // Filter expenses based on the search query
    const filteredExpenses = expenses.filter(expense =>
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setExpenses(filteredExpenses);
  };

  const monthOptions = months.map((month, index) => (
    <option key={index} value={month}>{month}</option>
  ));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
  const yearOptions = years.map((year) => (
    <option key={year} value={year}>{year}</option>
  ));

  return (
    <div className={styles.expensesPage}>
      <h2>Expenses</h2>
      <div className={styles.optionsContainer}>
        <div className={`${styles.filter} ${styles.left}`}>
          <label htmlFor="selectedMonth">Filter by Month:</label>
          <select
            id="selectedMonth"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="">All Months</option>
            {monthOptions}
          </select>
          <label htmlFor="selectedYear">Filter by Year:</label>
          <select
            id="selectedYear"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="">All Years</option>
            {yearOptions}
          </select>
          <button className={styles.button} onClick={handleClearButtonClick}>Clear</button>
        </div>

        <div className={styles.right}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category or description"
            className={styles.searchInput}
          />
          <button className={styles.button} onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      <table className={styles.expensesTable}>
        <thead>
          <tr>
            <th> Amount <FaSort onClick={() => handleSort('amount')} className={styles.icon} /></th>
            <th> Category <FaSort onClick={() => handleSort('category')} className={styles.icon} /></th>
            <th> Description <FaSort onClick={() => handleSort('description')} className={styles.icon} /></th>
            <th> Date <FaSort onClick={() => handleSort('date')} className={styles.icon} /></th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <td>${expense.amount.toFixed(2)}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>
                {expense.date ? new Date(expense.date.toDate()).toLocaleDateString() : 'N/A'}
              </td>
              <td>
                <FaEdit onClick={() => handleEditExpense(expense.id)} className={styles.icon} />
                <FaTrash onClick={() => handleDeleteExpense(expense.id)} className={styles.icon} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.button} onClick={handleAddButtonClick}>Add Expense</button>
    </div>
  );
}

export default ExpensesPage;
