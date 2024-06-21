import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState('');

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filter, setFilter] = useState({
        name: '',
        amount: '',
        amountCondition: 'equal',
        paid: '',
        date: '',
        dateCondition: 'equal'
    });

    const navigate = useNavigate();

    const getExpenses = async () => {
        try {
            const response = await api.get('/expenses',
            { params: { ...filter, page, limit, sortField, sortOrder } });
            setExpenses(response.data.expenses || []);
            setTotal(response.data.total);
        } catch(error) {

        }
        
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }
        getExpenses();
    }, [page, limit, sortField, sortOrder]);

    const deleteExpense = async () => {
        await api.delete('/expenses/' + deleteExpenseId);
        setShowModal(false);
        getExpenses();
        alert('Expense Deleted');
    }

    const confirmDelete = (expenseId) => {
        setShowModal(true);
        setDeleteExpenseId(expenseId);
    }

    const handleLogOut = async (event) => {
        localStorage.removeItem('token');
        navigate('/');
    }

    const cancelDelete = () => {
        setShowModal(false);
    }

    const handleEdit = (expenseId) => {
        navigate('/expense/edit/' + expenseId);
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    }

    const applyFilter = async () => {
        setPage(1);
        const response = await api.get('/expenses', { params: filter });
        setExpenses(response.data);
        setShowFilterModal(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getExpenses();
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content">
                <h1>Expenses</h1>
                <div className="button-group">
                    <Link to='/expense/add'>
                        <button className='btn primary'>Add Expenses</button>
                    </Link>
                    <button onClick={() => setShowFilterModal(true)} className='btn secondary'>Filter</button>
                    <button onClick={handleLogOut} className='btn primary'>Log out</button>
                </div>

                <table className='table'>
                    <thead>
                        <tr>
                            <th onClick={() => handleSortChange('category')}>
                                Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSortChange('amount')}>
                                Amount {sortField === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSortChange('paid')}>
                                Paid {sortField === 'paid' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSortChange('date')}>
                                Date {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense._id}>
                                <td>{expense.category}</td>
                                <td>{expense.amount}</td>
                                <td><input type="checkbox" checked={expense.paid} disabled /></td>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.description}</td>
                                <td>
                                    <button onClick={() => handleEdit(expense._id)} className='btn primary small'>Edit</button>
                                    <button onClick={() => confirmDelete(expense._id)} className='btn danger small'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='pagination'>
                    {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={page === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {showModal &&
                    <div className='confirm-overlay'>
                        <div className='confirm-dialog'>
                            <p>Are you sure you want to delete this expense?</p>
                            <button onClick={deleteExpense} className='btn danger'>Yes</button>
                            <button onClick={cancelDelete} className='btn secondary'>No</button>
                        </div>
                    </div>
                }

                {showFilterModal &&
                    <div className='filter-overlay'>
                        <div className='filter-dialog'>
                            <h2>Filter Expenses</h2>
                            <div className='filter-group'>
                                <label>Category:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={filter.name}
                                    onChange={handleFilterChange}
                                    placeholder="Enter category"
                                />
                            </div>
                            <div className='filter-group'>
                                <label>Amount:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="amount"
                                        value={filter.amount}
                                        onChange={handleFilterChange}
                                        placeholder="Enter amount"
                                    />
                                    <select
                                        name="amountCondition"
                                        value={filter.amountCondition}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="equal">Equal</option>
                                        <option value="bigger">Bigger</option>
                                        <option value="smaller">Smaller</option>
                                    </select>
                                </div>
                            </div>
                            <div className='filter-group'>
                                <label>Paid:</label>
                                <select
                                    name="paid"
                                    value={filter.paid}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                            <div className='filter-group'>
                                <label>Date:</label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        name="date"
                                        value={filter.date}
                                        onChange={handleFilterChange}
                                    />
                                    <select
                                        name="dateCondition"
                                        value={filter.dateCondition}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="equal">Equal</option>
                                        <option value="bigger">Bigger</option>
                                        <option value="smaller">Smaller</option>
                                    </select>
                                </div>
                            </div>
                            <div className='filter-buttons'>
                                <button onClick={applyFilter} className='btn primary'>Apply Filter</button>
                                <button onClick={() => setShowFilterModal(false)} className='btn secondary'>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Dashboard;
