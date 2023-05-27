import mongoose from 'mongoose';
const { Schema } = mongoose;
const NotificationsAwardsOrBadgesSchema = new Schema({
    //senderID:String,
    addresseeID: String,
    //infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    userBadgeId: { type: Schema.Types.ObjectId, ref: 'UsersBadge' },
    userBadge: Object,
    notificationReviewDate: Date,
    type: { type: String, default: 'usersBadgeNotify' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationsAwardsOrBadges', NotificationsAwardsOrBadgesSchema);