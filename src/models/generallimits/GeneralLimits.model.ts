import mongoose from 'mongoose';
const { Schema } = mongoose;
const GeneralLimitsSchema = new Schema({
    authDeniedLimit: Number
});

module.exports = mongoose.model('GeneralLimits', GeneralLimitsSchema);