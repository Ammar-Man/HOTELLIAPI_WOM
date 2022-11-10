const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const authToken = require('../middleware/authToken')

// Get all users
router.get('/', authToken, async (req, res) => {
    console.log(req.authUser.sub)
   // console.log(req.params.id)
    const users = await User.find()
    res.send(users)
})
// Get user info
router.get('/info', authToken, async (req, res) => {
    const getUser = await User.findOne({maker: req.authUser.sub})
    console.log(getUser)
    res.send({
        userInfo: {
        _id: getUser._id,
        email: getUser.email,
        firstName: getUser.firstName,
        lastName: getUser.lastName}
    })
})
// Endpoint at /users/login
router.post('/login', async (req, res) => {
    console.log(req)
    // Kolla om det finns en användare med det namnet
    const user = await User.findOne({email: req.body.email}).exec()
    if (user == null) {
        return res.status(401).send({msg: "No such user."})
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
        return res.status(401).send({msg: "Wrong password."})
    }

    const token = jwt.sign({
        sub: user._id, // sub = subject, användar-id
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    /* bra sätt att generera random string, i node-konsolen:
        require('crypto').randomBytes(32).toString('hex')
    */
    res.send({ msg: "Login OK", token: token})
})

// Delete the user
router.delete('/:id', authToken, async (req, res) => {
    try {
       console.log(req.params.id) //6332d8b5753176c70b0bb88c från använders inputt
        console.log(req.authUser.sub) // från token
        if(req.params.id == req.authUser.sub ){
            const user = await User.deleteOne({ 
                _id: req.params.id, 
                createdBy: req.authUser.sub
                //createdBy: req.authUser.sub  
            })
            if (!user) {  return res.status(404).send({msg: "User not found."}) }
            res.status(200).send({msg: "User been deleted", user: user})
        }
      else if(req.params.id != req.authUser.sub){ return res.status(404).send({msg: "You cant delete another users"})}
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}) 

// Create new users
router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        })

        const newUser = await user.save()
        res.send(newUser)

    } catch (error) {
        res.status(500).send({ msg: "This email is already registered you should use new one"})
    }
})

// Activation the user
router.patch('/:id', authToken, async (req, res) => {
    try {
        console.log(req.params.id) //6332d8b5753176c70b0bb88c från använders inputt
        console.log(req.authUser.sub) // från token
        if(req.params.id == req.authUser.sub){
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub}, // villkor för att uppdatera
                req.body, // själva uppdateringen
                { new: true} // returnera den uppdaterade versionen
            )
            if(!updatedUser) {  return res.status(404).send({msg: "User not found."}) }
            res.send({msg: "The user is activated to true!", updatedUser: updatedUser})
        }
        
         else if(req.body._id != req.authUser.sub){
           return res.status(404).send({msg: "You cannot activate other users"})
         }
        
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Undating the user
router.put('/:id', authToken, async (req, res) => {
    try {
        if(req.params.id == req.authUser.sub){
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub}, // villkor för att uppdatera
                req.body, // själva uppdateringen
                { new: true} // returnera den uppdaterade versionen
            )
            if(!updatedUser) {  return res.status(404).send({msg: "User not found."}) }
            res.send({msg: "The user is updated!", updatedUser: updatedUser})
        }
        else if(req.body._id != req.authUser.sub){
            return res.status(404).send({msg: "You cannot update other users"})
          }
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

//
module.exports = router