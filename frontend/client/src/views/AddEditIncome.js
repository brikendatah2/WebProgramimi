import React, { useState, useEffect } from 'react';
import api from '../api';
// import './AddEditIncomeForm.css';
import {Link, useNavigate, useParams} from 'react-router-dom';

function AddEditIncome() {

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
            const fetchIncome = async () => {
                api.get('/incomes/' + id).then(response => {
                    setFormData({
                        category: response.data.category,
                        amount: response.data.amount,
                        paid: response.data.paid,
                        description: response.data.description,
                        date: response.data.date.split('T')[0]
                    })
                })
            }
            fetchIncome();
        }
    }, []);



    const onChange = e => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData,
            [name]: type === 'checkbox' ? checked : value});
    }
    // /api/incomes : POST
    const onSubmit = async e => {
        e.preventDefault();
        try {

            if (id) {
                api.put('/incomes/' + id, formData).then(response => {
                    alert('Income edited');
                    navigate('/income');
                })
            } else {
                api.post('/incomes', formData)
                .then(response => {
                    alert('Income added');
                    navigate('/income');
                })
                .catch(err => {
                  console.log('cannot save incomes');
                });
            }
          } catch (error) {
            console.error('Income save error', error.response.data);
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
                    {id ? 'Edit' : 'Add'} Income
                </button>
            </form>
        </div>
    );
}

export default AddEditIncome;