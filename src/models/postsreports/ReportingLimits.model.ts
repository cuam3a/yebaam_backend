import mongoose from 'mongoose';
const { Schema } = mongoose;
const ReportingLimitsSchema = new Schema({
    limitForPost: Number,
    limitForUser: Number
});

module.exports = mongoose.model('ReportingLimits', ReportingLimitsSchema);