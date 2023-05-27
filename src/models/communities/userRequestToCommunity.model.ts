import mongoose, { Schema } from 'mongoose';

const userRequestToCommunity = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    communityId: { type: Schema.Types.ObjectId, ref: 'Communities' },
    isPending: { type: Boolean, default: true },
    isAccepted: { type: Boolean, default: false },
    isDeclined: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('userRequestCommunity', userRequestToCommunity);