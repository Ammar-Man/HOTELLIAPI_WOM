const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    cabin: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model(
    'Booking', 
    bookingSchema
)

// hello my name is ammar almandawi and i am in shipping teams with anton and jonatan