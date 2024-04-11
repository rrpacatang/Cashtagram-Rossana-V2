import React, { useState, useEffect } from 'react';
import styles from '../Style/AddPage.module.css'; // Import the CSS Module
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import db from '../firebase'; // Import db from firebase.js
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams here
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AddPage() {
  const { expenseId } = useParams();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // If there's an expenseId in the URL params, it means we're in edit mode
    console.log('Expense ID passed--> ' + expenseId);
    if (expenseId) {
      // Fetch the expense data based on the expenseId
      const fetchData = async () => {
        try {
          // Create a reference to the document using the expenseId
          const expenseDocRef = doc(db, 'expenses', expenseId);

          // Fetch the document data
          const expenseDocSnapshot = await getDoc(expenseDocRef);

          // Check if the document exists
          if (expenseDocSnapshot.exists()) {
            // Extract the document data
            const expenseData = expenseDocSnapshot.data();

            // Use the document data as needed
            console.log("Expense data:", expenseData);
            setAmount(expenseData.amount || '');
            setCategory(expenseData.category || '');
            setDescription(expenseData.description || '');
            setDate(expenseData.date ? expenseData.date.toDate() : new Date()); // Assuming date is a Firebase Timestamp
          } else {
            console.log("Document does not exist");
          }
        } catch (error) {
          console.error('Error fetching expense data:', error);
        }
      };

      fetchData();
    }
  }, [expenseId]);

  const handleCancelClick = () => {
    navigate('/expenses');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { amount, category, description, date });

    try {
      if (expenseId) {
        const confirmUpdate = window.confirm("Are you sure you want to update this expense?");
        if (!confirmUpdate) {
          return;
        }
        // If in edit mode, update the expense in Firestore
        const expenseDocRef = doc(db, 'expenses', expenseId);
        // Update the document data with the updatedData
        await setDoc(expenseDocRef, {
          amount: parseFloat(amount),
          category,
          description,
          date,
        }, { merge: true });

      } else {
        // If not in edit mode, add a new expense to Firestore
        await addDoc(collection(db, "expenses"), {
          amount: parseFloat(amount),
          category,
          description,
          date,
        });
      }

      // Reset form fields
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');

      alert('Expense Added');

      // Redirect to HomePage
      navigate('/');
    } catch (error) {
      console.error('Error adding/editing expense:', error);
    }
  };

  return (
    <div>
      <h2>{expenseId ? 'Edit Expense' : 'Add Expense'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Amount:
          <input
            className={styles.input}
            type="number"
            placeholder="Enter amount ($CAD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Category:
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled hidden>Select Category</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Food">Food</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Clothes">Clothes</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>
        </label>
        <label className={styles.label}>
          Description:
          <input
            className={styles.input}
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Date:
          <DatePicker
            className={styles.input}
            selected={date}
            onChange={date => setDate(date)}
            dateFormat="MMMM d, yyyy"
            required
          />
        </label>
        <div className={styles.updateButtonsContainer}>
          <button className={styles.button} type="submit">{expenseId ? 'Update Expense' : 'Add Expense'}</button>
          {expenseId && <button className={styles.button} onClick={handleCancelClick}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default AddPage;
