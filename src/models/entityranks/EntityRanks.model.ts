import mongoose from 'mongoose';
const { Schema } = mongoose;
const EntityRanksSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    rankID: { type: Schema.Types.ObjectId, ref: 'Ranks' },
    start: { type: Number, default: 0 },
    end: { type: Number, default: 0 },
    latest: { type: Boolean, default: false },
    advance: { type: Number, default: 0 },
    relatedEntitiesIDS: [String],
    relatedPostIDS: [String],
    relatedStoryIDS: [String],
    relatedCommentIDS: [String]
});

module.exports = mongoose.model('EntityRanks', EntityRanksSchema);