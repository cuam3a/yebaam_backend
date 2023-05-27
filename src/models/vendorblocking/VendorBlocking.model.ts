import mongoose from 'mongoose';
const { Schema } = mongoose;
const VendorBlockingSchema = new Schema({
    sellerID: { type: Schema.Types.ObjectId, ref: 'Users' },
    blockerID: { type: Schema.Types.ObjectId, ref: 'Users' },
    lockDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorBlocking', VendorBlockingSchema);