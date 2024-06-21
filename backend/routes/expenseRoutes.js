const express = require('express');
const Expense = require('../models/Expense');
const verifyToken = require('../verifyToken');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    console.log('post expense');

    const { category, amount, paid, description, date } = req.body;

    try {
        const newExpense = new Expense({
            user: req.user.id,
            category,
            amount,
            paid,
            description,
            date
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    console.log('get expenses');

    // const { name, amount, amountCondition, paid, date, dateCondition } = req.query;
    const { name, amount, amountCondition, paid, date, dateCondition, page = 1, limit = 10, sortField, sortOrder } = req.query;
    let query = { user: req.user.id};
    if (name) {
        console.log(name);
        query.category = {$regex: new RegExp(name, 'i')};
    }

    if (amount) {
        const amountValue = parseFloat(amount);
        if (amountCondition === 'equal') {
            query.amount = amountValue;
        } else if (amountCondition === 'bigger') {
            query.amount = { $gt: amountValue };
        } else if (amountCondition === 'smaller') {
            query.amount = { $lt: amountValue };
        }
    }

    if (paid) {
        query.paid = paid === "true";
    }

    if (date) {
        const dateValue = new Date(date);
        if (dateCondition === 'equal') {
            query.date = dateValue;
        } else if (dateCondition === 'bigger') {
            query.date = { $gt: dateValue };
        } else if (dateCondition === 'smaller') {
            query.date = { $lt: dateValue};
        }
    }

    const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
    };

    if (sortField && sortOrder) {
        options.sort = { [sortField]: sortOrder === 'asc' ? 1 :
    -1 }
    }

    try {
        const expenses = await Expense.find(query, null, options);
        const total = await Expense.countDocuments(query);

        res.json({
            expenses,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get one expense by ID
router.get('/:expenseId', verifyToken, async (req, res) => {
    const { expenseId } = req.params;

    try {
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });  // Added check if expense is not found
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an expense by ID
router.put('/:expenseId', verifyToken, async (req, res) => {
    console.log('update expense');
    const { expenseId } = req.params;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, req.body, { new: true, runValidators: true });  // Update expense
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });  // Added check if expense is not found
        }
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:expenseId', verifyToken, async (req, res) => {
    console.log('delete expense');
    const { expenseId } = req.params;
    console.log(expenseId);

    try {
        const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });  // Added check if expense is not found
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;