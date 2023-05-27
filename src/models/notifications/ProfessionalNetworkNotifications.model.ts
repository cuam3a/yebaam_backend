import mongoose from 'mongoose';
const { Schema } = mongoose;
const ProfessionalNetworkNotificationsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    ProfessionalPostsId: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comments' },
    replyToCommentId: { type: Schema.Types.ObjectId, ref: 'ReplyToComment' },
    reactionId: { type: Schema.Types.ObjectId, ref: 'UserReactions' },
    notificationReviewDate: Date,
    countReactions: Number,
    type: { type: String, default: 'socialProfessional' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfessionalNetworkNotifications', ProfessionalNetworkNotificationsSchema);