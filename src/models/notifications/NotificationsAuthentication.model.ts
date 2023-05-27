import mongoose from 'mongoose';
const { Schema } = mongoose;
const NotificationsAuthenticationSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    certificateId: { type: Schema.Types.ObjectId, ref: 'Certificates' },
    notificationReviewDate: Date,
    type: { type: String, default: 'autenticationNotify' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationsAuthentication', NotificationsAuthenticationSchema);