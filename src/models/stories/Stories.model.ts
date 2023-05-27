import mongoose from 'mongoose';
const { Schema } = mongoose;
const StoriesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    trademarkId: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    multimedia: [Object],
    durationTime: Number,
    expirationDate: Date,
    taggedUsers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    taggedTrademarks: [{ type: Schema.Types.ObjectId, ref: 'Trademarks' }],
    views: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    itWasSeen: Boolean,
    archived: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stories', StoriesSchema);