const mongoose = require('mongoose');

const claimHistorySchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true
    },
    ip: {
        type: String

    },
    sessionId:{
        type:String
    },
    claimedAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('claimHistory', claimHistorySchema)