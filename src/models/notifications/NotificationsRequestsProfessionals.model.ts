import mongoose from 'mongoose';
const { Schema } = mongoose;
const NotificationsRequestsProfessionalsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    socialProfessionalId: { type: Schema.Types.ObjectId, ref: 'SocialProfessional' },
    notificationReviewDate: Date,
    type: { type: String, default: 'requestProfessional' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationsRequestsProfessionals', NotificationsRequestsProfessionalsSchema);