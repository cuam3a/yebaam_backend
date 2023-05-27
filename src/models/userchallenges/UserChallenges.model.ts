import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserChallengesSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    challengeID: { type: Schema.Types.ObjectId, ref: 'Challenges' },
    awardID: { type: Schema.Types.ObjectId, ref: 'Award' },
    // userChallengeInteractionID: { type: Schema.Types.ObjectId, ref: 'UserChallengeInteractions' },
    actionCode: String,
    advance: Number,
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    completed: { type: Boolean, default: false },
    relatedEntitiesIDS: [String],
    relatedPostIDS: [String],
    relatedStoryIDS: [String],
    relatedCommentIDS: [String]
});

module.exports = mongoose.model('UserChallenges', UserChallengesSchema);