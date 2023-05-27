import mongoose from 'mongoose';
const { Schema } = mongoose;
const BrandRankingSchema = new Schema({
    trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    advance: { type: Number, default: 0 },
    relatedEntitiesIDS: [String],
    relatedPostIDS: [String],
    relatedStoryIDS: [String],
    relatedCommentIDS: [String]
});

module.exports = mongoose.model('BrandRanking', BrandRankingSchema);