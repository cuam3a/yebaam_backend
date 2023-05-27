import mongoose from 'mongoose';
const { Schema } = mongoose;
const LandingsSchema = new Schema({
    type: { type: String, default: 'landing' },
    name: String,
    description: String,
    price: Number,
    isDefault: { type: Boolean, default: false },
    preview: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Landings', LandingsSchema);