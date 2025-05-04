const mongoose = require('mongoose');

// Food Menu Schema
const foodMenuSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    breakfast: {
        type: String,
        required: true
    },
    lunch: {
        type: String,
        required: true
    },
    dinner: {
        type: String,
        required: true
    },
    snacks: {
        type: String,
        required: false
    }
});

// Food Feedback Schema
const foodFeedbackSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const FoodMenu = mongoose.model('FoodMenu', foodMenuSchema);
const FoodFeedback = mongoose.model('FoodFeedback', foodFeedbackSchema);

module.exports = { FoodMenu, FoodFeedback };
