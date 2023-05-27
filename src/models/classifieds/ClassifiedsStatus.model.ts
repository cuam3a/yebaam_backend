import mongoose from 'mongoose';
const { Schema } = mongoose;
const ClassifiedsStatusSchema = new Schema({
    name: String,
    order: Number,
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClassifiedsStatus', ClassifiedsStatusSchema);