import mongoose from 'mongoose';
const { Schema } = mongoose;
const PqrsNotitcationsSchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    pqrsId: String,
    pqrsData: Object,
    typePqrs: Number,
    notificationReviewDate: Date,
    type: { type: String, default: 'pqrsNotify' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('PqrsNotitcations', PqrsNotitcationsSchema);