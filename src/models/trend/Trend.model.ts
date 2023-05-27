import mongoose from 'mongoose';
const { Schema } = mongoose;

const TrendSchema = new Schema({
    idpost: { type: Schema.Types.ObjectId, ref: 'Posts' },
    date: Date,
    score: { type: Number, default: 0 },
    Trend: { type: Boolean, default: false },
    position: Number,
    max_score: Number
})

module.exports = mongoose.model('Trends', TrendSchema, "Trends");