const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Service', serviceSchema)


// hello my name is ammar almandawi and i am in shipping teams with anton and jonatan