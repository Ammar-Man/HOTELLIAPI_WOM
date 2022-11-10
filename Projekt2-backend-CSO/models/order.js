const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    maker: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    cabin: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)

// hello my name is ammar almandawi and i am in shipping teams with anton and jonatan
