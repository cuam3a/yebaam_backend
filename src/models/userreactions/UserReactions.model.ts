import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserReactionsSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, refPath: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, refPath: 'Trademarks' },
    professionalProfileID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalProfiles' },
    // userID: { type: Schema.Types.ObjectId, required: true, refPath: 'onModel' },
    // onModel: { type: String, required: true, enum: ['Users', 'Trademarks'] },
    // reactionID: [{ type: Schema.Types.ObjectId, ref: 'Reactions' }],
    reactionDate: { type: Date, default: Date.now },
    postID: { type: Schema.Types.ObjectId, refPath: 'Posts' },
    commentID: { type: Schema.Types.ObjectId, refPath: 'Comments' },
    replyToCommentID: { type: Schema.Types.ObjectId, refPath: 'ReplyToComment' },
    professionalPostID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalPosts' },
    isEnabled: { type: Boolean, default: true },
    value: Number
});

module.exports = mongoose.model('UserReactions', UserReactionsSchema);