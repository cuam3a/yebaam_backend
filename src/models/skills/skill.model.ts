import mongoose from 'mongoose';

const { Schema } = mongoose;

const skillSchema = new Schema({
    skill: { type: String, required: true, unique:true },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('skill', skillSchema);