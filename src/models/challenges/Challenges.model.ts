import mongoose from 'mongoose';
const { Schema } = mongoose;
const ChallengesSchema = new Schema({
    name: String,
    description: String,
    systemActionID: { type: Schema.Types.ObjectId, ref: 'SystemActions' },
    actionCode: String,
    quantity: Number,
    // validity: Date,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Challenges', ChallengesSchema);