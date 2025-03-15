const mongoose =  require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String,
        required: true,
        unique: true
    },
    isClaimed:{
        type: Boolean,
        default: false
    },
    claimedBy: {
        ip: {
            type: String
        },
        sessionId:{
            type: String
        },
        time:{
            type: Date
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('coupon', couponSchema);