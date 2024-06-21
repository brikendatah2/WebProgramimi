const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    category: String,
    amount: Number,
    paid: Boolean,
    date: 
    {type: Date, default: Date.now},
    description: String
});

module.exports = mongoose.model('Income', IncomeSchema);