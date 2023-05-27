import mongoose from 'mongoose';
const { Schema } = mongoose;
const ProfessionalCommunityPostRequestNotificationsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    postRequestId: { type: Schema.Types.ObjectId, ref: 'PostRequests' },
    notificationReviewDate: Date,
    type: { type: String, default: 'requestPostProfessionalCommunity' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfessionalCommunityPostRequestNotifications', ProfessionalCommunityPostRequestNotificationsSchema);