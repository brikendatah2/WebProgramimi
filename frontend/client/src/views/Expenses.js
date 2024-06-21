import React, { useState, useEffect } from 'react';
import api from '../api';
import './ExpenseForm.css';
import {Link, useNavigate, useParams} from 'react-router-dom';

function AddEditExpense() {

    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        paid: false,
        description: '',
        date: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) { // id na tregon se a eshte update ose add
            const fetchExpense = async () => {
                api.get('/expenses/' + id).then(response => {
                    setFormData({
                        category: response.data.category,
                        amount: response.data.amount,
                        paid: response.data.paid,
                        description: response.data.description,
                        date: response.data.date.split('T')[0]
                    })
                })
            }
            fetchExpense();
        }
    }, []);



    const onChange = e => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData,
            [name]: type === 'checkbox' ? checked : value});
    }
    // /api/expenses : POST
    const onSubmit = async e => {
        e.preventDefault();
        try {

            if (id) {
                api.put('/expenses/' + id, formData).then(response => {
                    alert('Expense edited');
                    navigate('/dashboard');
                })
            } else {
                api.post('/expenses', formData)
                .then(response => {
                    alert('Expense added');
                    navigate('/dashboard');
                })
                .catch(err => {
                  console.log('cannot save expenses');
                });
            }
          } catch (error) {
            console.error('Expense save error', error.response.data);
          }
    }


    return (
        <div>
            <Link to ='/dashboard'>
                Go Back
            </Link>
            <form className='my-form' onSubmit={onSubmit}>
                <label>
                    <input onChange={onChange} value={formData.category} type="text" placeholder='Category' name="category" required />
                </label>
                <label>
                    <input onChange={onChange} value={formData.amount} type="number" placeholder='Amount' name="amount" required />
                </label>
                <label>
                    <input type="checkbox" name="paid" 
                    checked={formData.paid} onChange={onChange} />
                    Paid
                </label>
                <label>
                    <input onChange={onChange} value={formData.description} type="text" placeholder="Description" name="description" />
                </label>
                <label>
                    <input onChange={onChange} value={formData.date} type="date" placeholder='Date' name='date' required />
                </label>
                <button type='submit'>
                    {id ? 'Edit' : 'Add'} Expense
                </button>
            </form>
        </div>
    );
}

export default AddEditExpense;