import mongoose from 'mongoose';
const { Schema } = mongoose;
const TypeOfAwardsSchema = new Schema({
    name: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('TypeOfAwards', TypeOfAwardsSchema);