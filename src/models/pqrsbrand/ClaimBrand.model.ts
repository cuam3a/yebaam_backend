import mongoose from 'mongoose';
const { Schema } = mongoose;
const ClaimSchema = new Schema({
    type: { type: Number, default: 1 },
    entityId: { type: Schema.Types.ObjectId, refPath: 'Trademarks' },
    affair: String,
    description: String,
    status: { type: String, default: 'Sended'},
    reply: { type: String, default: null },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ClaimsBrand', ClaimSchema);