const express = require('express')
const router = express.Router()
const Booking = require('../models/booking')
const Cabin = require('../models/cabin')
const authToken = require('../middleware/authToken')
const newBooking = require('../middleware/newBooking')

// Get all bookings
router.get('/', authToken, async (req, res) => {
    try {
        const booking = await Booking.find()
        res.send(booking)
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Get all bookings with cabinID
router.get('/:id', authToken, async (req, res) => {
    try {
        console.log(res)
        const booking = await Booking.findOne({ _id: req.params.id })
        if (!booking) {
            return res.status(404).send({ msg: "Booking not found." })
        }
        res.send(booking)
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// Create new bookings
router.post('/', authToken, newBooking, async (req, res) => {

    const getCabin = await Cabin.findById(req.body.cabin)
    if (!getCabin) {
        return res.status(404).send({ msg: "Cabin not found." })
    }
    const findBookingDate = await Booking.findOne({

        cabin: req.body.cabin,
        startDate: { $lte: req.body.endDate },
        endDate: { $gte: req.body.startDate }
    }).exec()

    console.log(findBookingDate)
    if (findBookingDate) {
        return res.send({ msg: "Timeslot not available for the cabin" })
    }

    try {
        //   console.log(req)
        const booking = req.newBooking
        // console.log(booking)
        const newBooking = await booking.save()
        // res.send(newBooking)
        res.send({ msg: "New booking is registered", newBooking: newBooking })

    } catch (error) {
        res.status(500).send({ msg: "The address already exists should choose another address" })
    }
})

// Updating the bookings info like date
router.patch('/:id', authToken, async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id)
        if (booking.author == req.authUser.sub) {

            const findBookingDate = await Booking.findOne({

                cabin: req.body.cabin,
                startDate: { $lte: req.body.endDate },
                endDate: { $gte: req.body.startDate }
            }).exec()

            console.log(findBookingDate)
            if (findBookingDate) {
                return res.send({ msg: "Timeslot not available for the cabin" })
            }

            const updatedBookingDate = await Booking.findOneAndUpdate(
                { _id: req.params.id, createdBy: req.authUser.sub }, // villkor för att uppdatera

                req.body, // själva uppdateringen
                { new: true } // returnera den uppdaterade versionen
            )
            if (!updatedBookingDate) { return res.status(404).send({ msg: "Booking not found." }) }
            res.send({ msg: "The cabins is updated!", updatedBookingDate: updatedBookingDate })
        }

        else if (cabins.maker != req.authUser.sub) { return res.status(404).send({ msg: "You cannot delete other people's bookingstime" }) }
    } catch (error) {
        res.status(500).send({ msg: "The address is in use" })
    }
})

// Delete the cabin
router.delete('/:id', authToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (booking.author == req.authUser.sub) {
            console.log("YES")
            const bookingDelete = await Booking.deleteOne({
                _id: req.params.id,
                createdBy: req.authUser.sub
            })

            if (!bookingDelete) {
                return res.status(404).send({ msg: "You don't have such a booking" })
            }
            res.send({ msg: "Booking deleted ", bookingDelete: bookingDelete })
        }

        else if (cabins.maker != req.authUser.sub) { return res.status(404).send({ msg: "You cannot delete other people's bookingstime" }) }
    } catch (error) {
        res.status(500).send({ msg: "The booking is not existing" })
    }
})

module.exports = router