const mongoose = require('mongoose')

const ownedSchema = new mongoose.Schema({
    maker:      {type:String, required:true},
    address:    {type:  String, required: true, unique: true} ,
    size:       {type:  String, required: true} ,
    sauna:      Boolean ,
    beach:      Boolean ,
    price :     {type:  String, required: true} 


},{timestamps: true})

module.exports = mongoose.model('Owned',ownedSchema)

// hello my name is ammar almandawi and i am in shipping teams with anton and jonatan