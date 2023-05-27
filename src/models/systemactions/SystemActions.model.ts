import mongoose from 'mongoose';
const { Schema } = mongoose;
const SystemActionsSchema = new Schema({
    actionCode: String,
    name: String,
    description: String,
    rankingPoints: { type: Number, default: 0 },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemActions', SystemActionsSchema);