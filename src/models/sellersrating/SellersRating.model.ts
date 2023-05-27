import mongoose from 'mongoose';
const { Schema } = mongoose;
const SellersRatingSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: 'Users' },
    qualifierID: { type: Schema.Types.ObjectId, ref: 'Users' },
    value: Number,
    ratingDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('SellersRating', SellersRatingSchema);