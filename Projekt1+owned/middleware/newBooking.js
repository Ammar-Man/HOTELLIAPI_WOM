const Booking = require('../models/booking')

module.exports = (req, res, next) => {

    const booking = new Booking({
        author: req.authUser.sub,
        cabin: req.body.cabin,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    })
    req.newBooking = booking
    next()

}
