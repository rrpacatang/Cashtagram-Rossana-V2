import React, { useState } from 'react';
import styles from './Style/AddPage.module.css'; // Import the CSS Module
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from './firebase'; // Import db from firebase.js
import { useNavigate } from 'react-router-dom';

const AddPage = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { amount, category, description });

    try {
      // Add the expense to Firestore
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount),
        category,
        description,
        timestamp: serverTimestamp(),
      });

      // Reset form fields
      setAmount('');
      setCategory('');
      setDescription('');

      // Show alert
      alert('Expense Added');

      // Redirect to HomePage
      navigate('/');
    } catch (error) {
      console.error('Error adding expense:', error);
      // Handle error here (e.g., show error message to user)
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <h2>{currentDate}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          {/* Amount: */}
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
          {/* Category: */}
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
          {/* Description: */}
          <input
            className={styles.input}
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button className={styles.button} type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddPage;
