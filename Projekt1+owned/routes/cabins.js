const express = require('express')
const router = express.Router()
const Cabin = require('../models/cabin')
const Owned = require('../models/owned')
const authToken = require('../middleware/authToken')

// Get all cabins
router.get('/', authToken, async (req, res) => {
    console.log(req.authUser.sub)
   // console.log(req.params.id)
   try{
    const cabins = await Cabin.find()
    res.send(cabins)
   }
 catch (error) {
    res.status(500).send({ msg: error.message })
}   
})

// Create new cabins
router.post('/', authToken,async (req, res) => {
    try {
        console.log(req)
        const cabin = new Cabin({
            maker: req.authUser.sub,
            address: req.body.address,
            size: req.body.size,
            sauna: req.body.sauna,
            beach: req.body.beach,
            price: req.body.price
        })
        //console.log(cabin)
        const newCabin = await cabin.save()
        res.send(newCabin)

    } catch (error) {
        res.status(500).send({ msg: "The address already exists should choose another address"})
    }
})

// Updating the cabin
router.patch('/:id', authToken, async (req, res) => {
    try {

        const cabins = await Cabin.findById(req.params.id)
         if(cabins.maker == req.authUser.sub){
            const updatedCabin = await Cabin.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub}, // villkor för att uppdatera
                req.body, // själva uppdateringen
                { new: true} // returnera den uppdaterade versionen
            )
            if(!updatedCabin) {  return res.status(404).send({msg: "Cabin not found."}) }
            res.send({msg: "The cabins is updated!", updatedCabin: updatedCabin})
            
        }

        else if(cabins.maker != req.authUser.sub){
            return res.status(404).send({msg: "You cannot update other cabins"})
          }
    } catch (error) {
        res.status(500).send({ msg: "The address is in use"})
    }
})

// Delete the cabin
router.delete('/:id', authToken, async (req, res) => {
    try {

        const cabins = await Cabin.findById(req.params.id) 
        if(cabins.maker == req.authUser.sub ){
            const cabinsDelete = await Cabin.deleteOne(
                { _id: req.params.id, createdBy: req.authUser.sub}
            )
            if (!cabinsDelete) {  return res.status(404).send({msg: "Cabin is not found."}) }
            res.status(200).send({msg: "Cabin been deleted", cabinsDelete: cabinsDelete})
        }
        
      else if(cabins.maker != req.authUser.sub){ return res.status(404).send({msg: "You cannot delete other people's cabin"})}
    } catch (error) {
        res.status(500).send({ msg: "The cabin is not existing"})
    }
})

// Project 2 Onwed part.
// Get all cabins
router.get('/owned', authToken, async (req, res) => {
  
    const getOwned = await Owned.findOne({maker: req.authUser.sub})
   try{
    const owned = await Owned.find({maker: req.authUser.sub})
    res.send(owned)
   }
 catch (error) {
    res.status(500).send({ msg: error.message })
}   
})

// Create new cabins
router.post('/owned', authToken,async (req, res) => {
    try {
        console.log("post/owned")

        const owned = new Owned({
            maker: req.authUser.sub,
            address: req.body.address,
            size: req.body.size,
            sauna: req.body.sauna,
            beach: req.body.beach,
            price: req.body.price
        })
        const newOwned = await owned.save()
        res.send(newOwned)

    } catch (error) {
        res.status(500).send({ msg: "The address already exists should choose another address"})
    }
})

// Updating the cabin
router.patch('/owned', authToken, async (req, res) => {
    try {

        const cabins = await Cabin.findById(req.params.id)

         if(cabins.maker == req.authUser.sub){
            const updatedCabin = await Cabin.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub}, // villkor för att uppdatera
                req.body, // själva uppdateringen
                { new: true} // returnera den uppdaterade versionen
            )
            if(!updatedCabin) {  return res.status(404).send({msg: "Cabin not found."}) }
            res.send({msg: "The cabins is updated!", updatedCabin: updatedCabin})
            
        }

        else if(cabins.maker != req.authUser.sub){
            return res.status(404).send({msg: "You cannot update other cabins"})
          }
    } catch (error) {
        res.status(500).send({ msg: "The address is in use"})
    }
})

// Delete the cabin
router.delete('/owned/:id', authToken, async (req, res) => {
    try {

            const cabinsDelete = await Cabin.deleteOne(
                { _id: req.params.id, createdBy: req.authUser.sub}
            )
            if (!cabinsDelete) {  return res.status(404).send({msg: "Cabin is not found."}) }
            res.status(200).send({msg: "Cabin been deleted", cabinsDelete: cabinsDelete})

    } catch (error) {
        res.status(500).send({ msg: "The cabin is not existing"})
    }
})

module.exports = router
