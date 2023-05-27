import mongoose from 'mongoose';
const { Schema } = mongoose;
const ColorChangenotificationSchema = new Schema({
    //senderID:String,
    addresseeID: String,
    //infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    notificationReviewDate: Date,
    type: { type: String, default: 'colorChangeNotify' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ColorChangenotification', ColorChangenotificationSchema);