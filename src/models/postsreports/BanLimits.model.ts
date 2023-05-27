import mongoose from 'mongoose';
const { Schema } = mongoose;
const BanLimitSchema = new Schema({
    strikeQuantity: Number,
    banDays: Number,
    isLimit: { type: Boolean, default: false }
})

module.exports = mongoose.model('BanLimit', BanLimitSchema);