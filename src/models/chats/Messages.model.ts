import mongoose from 'mongoose';
const { Schema } = mongoose;
const MessagesSchema = new Schema({
    content: String,
    multimedia: [Object],
    senderID: String,
    infoSender: Object,
    addresseeID: String,
    responseToMessageId: { type: Schema.Types.ObjectId, ref: 'Messages' },
    storyID: { type: Schema.Types.ObjectId, ref: 'Stories' },
    stateMessage: Number,
    link: String,
    isEnabledSender: { type: Boolean, default: true },
    isEnabledAddressee: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Messages', MessagesSchema);