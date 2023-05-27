import mongoose from 'mongoose';
const { Schema } = mongoose;
const TypeOfMarksSchema = new Schema({
    name: String,
    description: String,
    inUse: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('TypeOfMarks', TypeOfMarksSchema);