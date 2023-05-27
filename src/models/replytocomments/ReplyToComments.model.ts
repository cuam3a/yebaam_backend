import mongoose from 'mongoose';
const { Schema } = mongoose;
const ReplyToCommentSchema = new Schema({
    type: { type: String, default: "replytocomment" },
    text: String,
    image: String,
    video: String,
    sticker: String,
    gif: String,
    audio: String,
    reactionsIDS: [{ type: Schema.Types.ObjectId, ref: 'UserReactions' }],
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    professionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    postID: { type: Schema.Types.ObjectId, ref: 'Posts' },
    professionalPostID: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    commentID: { type: Schema.Types.ObjectId, refPath: 'Comments' },
    likes: { type: Number, default: 0 },
    myReaction: Object,
    commentingUser: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ReplyToComment', ReplyToCommentSchema);