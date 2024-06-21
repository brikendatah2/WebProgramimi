import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from './Sidebar';

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteIncomeId, setDeleteIncomeId] = useState('');

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

    const getIncomes = async () => {
        try {
            const response = await api.get('/incomes',
            { params: { ...filter, page, limit, sortField, sortOrder } });
            setIncomes(response.data.incomes || []);
            setTotal(response.data.total);
        } catch(error) {

        }
        
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }
        getIncomes();
    }, [page, limit, sortField, sortOrder]);

    const deleteIncome = async () => {
        await api.delete('/incomes/' + deleteIncomeId);
        setShowModal(false);
        getIncomes();
        alert('Income Deleted');
    }

    const confirmDelete = (incomeId) => {
        setShowModal(true);
        setDeleteIncomeId(incomeId);
    }

    const handleLogOut = async (event) => {
        localStorage.removeItem('token');
        navigate('/');
    }

    const cancelDelete = () => {
        setShowModal(false);
    }

    const handleEdit = (incomeId) => {
        navigate('/income/edit/' + incomeId);
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
        const response = await api.get('/incomes', { params: filter });
        setIncomes(response.data);
        setShowFilterModal(false);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getIncomes();
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content">
                <h1>Incomes</h1>
                <div className="button-group">
                    <Link to='/income/add'>
                        <button className='btn primary'>Add Incomes</button>
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
                        {incomes.map(income => (
                            <tr key={income._id}>
                                <td>{income.category}</td>
                                <td>{income.amount}</td>
                                <td><input type="checkbox" checked={income.paid} disabled /></td>
                                <td>{new Date(income.date).toLocaleDateString()}</td>
                                <td>{income.description}</td>
                                <td>
                                    <button onClick={() => handleEdit(income._id)} className='btn primary small'>Edit</button>
                                    <button onClick={() => confirmDelete(income._id)} className='btn danger small'>Delete</button>
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
                            <p>Are you sure you want to delete this income?</p>
                            <button onClick={deleteIncome} className='btn danger'>Yes</button>
                            <button onClick={cancelDelete} className='btn secondary'>No</button>
                        </div>
                    </div>
                }

                {showFilterModal &&
                    <div className='filter-overlay'>
                        <div className='filter-dialog'>
                            <h2>Filter Incomes</h2>
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

export default Income;
