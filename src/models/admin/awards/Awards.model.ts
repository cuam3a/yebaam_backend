import mongoose from 'mongoose';
const { Schema } = mongoose;
const AwardSchema = new Schema({
    name: String,
    description: String,
    typeOfAwardID: { type: Schema.Types.ObjectId, ref: 'TypeOfAwards' },
    challengeIDS: [{ type: Schema.Types.ObjectId, ref: 'Challenges' }],
    scoreValue: Number,
    image: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Award', AwardSchema);