import mongoose from 'mongoose';
const { Schema } = mongoose;
const StatesSchema = new Schema({
    countryID: Number,
    stateID: Number,
    stateName: String
});

module.exports = mongoose.model('States', StatesSchema);