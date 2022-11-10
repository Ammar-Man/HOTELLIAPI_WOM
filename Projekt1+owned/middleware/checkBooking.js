const Booking = require('../models/booking')

module.exports = (req, res, next) => {

    const bookingNotSame = Booking.findOne({
        author: { $ne: req.authUser.sub},
        cabin: req.body.cabin,
        startDate: { $lte: req.body.endDate },
        endDate: { $gte: req.body.startDate }
    })
    const bookingSame = Booking.findOne({
        _id: {$ne: req.params.id},
        cabin: req.body.cabin,
        startDate: { $lte: req.body.endDate },
        endDate: { $gte: req.body.startDate }
    })


    req.authorNotSame = bookingNotSame
    req.authorSame = bookingSame
    next()

}