import mongoose from 'mongoose';
const { Schema } = mongoose;
const RegulationsWithUsersSchema = new Schema({
    link:String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('RegulationsWithUsers', RegulationsWithUsersSchema);