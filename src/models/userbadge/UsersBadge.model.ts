import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;
const UsersBadgeSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    awardID: { type: Schema.Types.ObjectId, ref: 'Award' },
    userChallengeID: { type: Schema.Types.ObjectId, ref: 'UserChallenges' },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UsersBadge', UsersBadgeSchema);