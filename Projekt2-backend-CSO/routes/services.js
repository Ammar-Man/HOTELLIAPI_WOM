const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Service = require('../models/service')
const authToken = require('../middleware/authToken')

// Get all services
router.get('/', authToken, async (req, res) => {
    try {
        const service = await Service.find()
        res.send(service)
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
})
// Create new services
router.post('/', authToken,async (req, res) => {
    try {
        console.log(req)
        const service = new Service({
            service: req.body.service,
          
           
        })
        //console.log(cabin)
        const newService = await service.save()
        res.send(newService)

    } catch (error) {
        res.status(500).send({ msg: "error"})
    }
})

module.exports = router