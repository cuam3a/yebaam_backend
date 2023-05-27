import mongoose from 'mongoose';
const { Schema } = mongoose;
const SocialSchema = new Schema({
    firstID: String,
    secondID: String,
    areFriends: { type: Boolean, default: false },
    isFollowerFirst: { type: Boolean, default: false },
    isFollowerSecond: { type: Boolean, default: false },
    isBlockerFirst: { type: Boolean, default: false },
    isBlockerSecond: { type: Boolean, default: false },
    sendRequestFirst: { type: Boolean, default: false },
    sendRequestSecond: { type: Boolean, default: false },
    cancelRequest: { type: Boolean, default: false },
    requestStatus: { type: Boolean, default: false },
    disableNotificationsFirst: {type: Boolean, default: false},
    disableNotificationsSecond: {type: Boolean, default: false},
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Socials', SocialSchema);