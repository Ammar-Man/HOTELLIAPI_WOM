const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Service = require('../models/service')
const authToken = require('../middleware/authToken')

// Get all orders
router.get('/', authToken, async (req, res) => {
    
    console.log(req.authUser.sub)

   // console.log(req.params.id)
   try{
    const order = await Order.find({maker: req.authUser.sub})
    res.send(order)
   }
 catch (error) {
    res.status(500).send({ msg: error.message })
}   
})

// Create new orders
router.post('/', authToken,async (req, res) => {
    try {
        console.log(req)
        const order = new Order({
            maker: req.authUser.sub,
            date: req.body.date,
            cabin: req.body.cabin,
            service: req.body.service
        })
        //console.log(cabin)
        const newOrder = await order.save()
        res.send(newOrder)

    } catch (error) {
        res.status(500).send({ msg: "The address already exists should choose another address"})
    }
})



// Updating the cabin
router.patch('/:id', authToken, async (req, res) => {
    try {

        
        const updatedOrder = await Order.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub}, // villkor för att uppdatera
                req.body, // själva uppdateringen
                { new: true} // returnera den uppdaterade versionen
            )
            if(!updatedOrder) {  return res.status(404).send({msg: "Order not found."}) }

            res.send({msg: "The Orders services is updated!", updatedOrder: updatedOrder})
            
    } catch (error) {
        res.status(500).send({ msg: "The address is in use"})
    }
})

// Delete the cabin

router.delete('/:id', authToken, async (req, res) => {
    try {

        
            const orderDelete = await Order.deleteOne(
                { _id: req.params.id, createdBy: req.authUser.sub}
            )
            if (!orderDelete) {  return res.status(404).send({msg: "Order is not found."}) }
            res.status(200).send({msg: "Order been deleted", orderDelete: orderDelete})

    } catch (error) {
        res.status(500).send({ msg: "The Order is not existing"})
    }
})



module.exports = router
