import mongoose from 'mongoose';
const { Schema } = mongoose;
const SocialNetworkNotificationsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comments' },
    replyToCommentId: { type: Schema.Types.ObjectId, ref: 'ReplyToComment' },
    reactionId: { type: Schema.Types.ObjectId, ref: 'UserReactions' },
    notificationReviewDate: Date,
    countReactions: Number,
    type: { type: String, default: 'socialUser' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('SocialNetworkNotifications', SocialNetworkNotificationsSchema);