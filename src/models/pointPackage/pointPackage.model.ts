import mongoose from 'mongoose';
const { Schema } = mongoose;

const PointPackageSchema = new Schema({
    type: { type: String, default: 'pointspackage' },
    pointsQuantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    description: String,
    inUse: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('pointPackage', PointPackageSchema);