import mongoose from 'mongoose';
const { Schema } = mongoose;
const CountriesSchema = new Schema({
    countryID: Number,
    countryName: String
});

module.exports = mongoose.model('Countries', CountriesSchema);