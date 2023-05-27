import mongoose from 'mongoose';
const { Schema } = mongoose;
const TypeOfReportsSchema = new Schema({
    description: String,
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('TypeOfReports', TypeOfReportsSchema);