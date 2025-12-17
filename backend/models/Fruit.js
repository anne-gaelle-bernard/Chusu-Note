const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nomFruit: {
        type: String,
        required: true,
        trim: true
    },
    memo: {
        type: String,
        required: true
    },
    priere: {
        type: String,
        trim: true
    },
    dateChatGui: {
        type: Date,
        required: true
    },
    typeChatGui: {
        type: String,
        required: true,
        enum: ['event', 'autre']
    },
    dateManam: {
        type: Date
    },
    dateReminder: {
        type: Date
    },
    resultatManam: {
        type: String,
        enum: ['TT', 'Non', '']
    },
    raison: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Mise à jour automatique de updatedAt
fruitSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Fruit', fruitSchema);
