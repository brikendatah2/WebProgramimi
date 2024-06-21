import Login from "./views/login.js";
import Register from './views/register.js';
import Dashboard from './views/Dashboard.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddEditExpense from './views/Expenses.js';
import Income from './views/Income.js';
import AddEditIncome from './views/AddEditIncome.js';





function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expense/add" element={<AddEditExpense />} />
          <Route path="/expense/edit/:id" element={<AddEditExpense />} />
          <Route path="/income/" element={<Income />} />
          <Route path="/income/add" element={<AddEditIncome />} />
          <Route path="/income/edit/:id" element={<AddEditIncome />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
