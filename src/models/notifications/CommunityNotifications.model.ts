import mongoose from 'mongoose';
const { Schema } = mongoose;
const CommunityNotificationsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    userRequestCommunityId: { type: Schema.Types.ObjectId, ref: 'userRequestCommunity' },
    notificationReviewDate: Date,
    type: { type: String, default: 'requesCommunitytUser' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('CommunityNotifications', CommunityNotificationsSchema);