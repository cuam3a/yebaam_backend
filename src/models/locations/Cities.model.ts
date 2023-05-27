import mongoose from 'mongoose';
const { Schema } = mongoose;
const CitiesSchema = new Schema({
    stateID: Number,
    cityID: Number,
    cityName: String
});

module.exports = mongoose.model('Cities', CitiesSchema);