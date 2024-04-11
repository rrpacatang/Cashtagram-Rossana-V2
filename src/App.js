import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import Home from './Components/HomePage';
import Add from './Components/AddPage';
import Expenses from './Components/ExpensesPage';
import Help from './Components/HelpPage';
import Navbar from './Components/Navbar';

function App() {
=======
import Home from './HomePage';
import Add from './AddPage';
import Expenses from './ExpensesPage';
import Help from './HelpPage';
import Navbar from './Navbar';

const App = () => {
>>>>>>> d406a58b3958094ae805136d97af8ece818ee984
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<Add />} />
<<<<<<< HEAD
        <Route path="/add/:expenseId" element={<Add />} />
=======
>>>>>>> d406a58b3958094ae805136d97af8ece818ee984
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/help" element={<Help />} />
        <Route index element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
