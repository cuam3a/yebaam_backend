import mongoose from 'mongoose';
const { Schema } = mongoose;
const NotificationsProfessionalCommunitySchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    RequestToTheCommunityId: { type: Schema.Types.ObjectId, ref: 'RequestToTheCommunity' },
    notificationReviewDate: Date,
    type: { type: String, default: 'requesCommunitytPrfessional' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationsProfessionalCommunity', NotificationsProfessionalCommunitySchema);