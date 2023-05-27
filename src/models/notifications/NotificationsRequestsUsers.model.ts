import mongoose from 'mongoose';
const { Schema } = mongoose;
const NotificationsRequestsUsersSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    socialId: { type: Schema.Types.ObjectId, ref: 'Socials' },
    chatConnectionId: { type: Schema.Types.ObjectId, ref: 'ChatConnections' },
    notificationReviewDate: Date,
    type: { type: String, default: 'requestUser' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('NotificationsRequestsUsers', NotificationsRequestsUsersSchema);