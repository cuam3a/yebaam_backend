import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserSettingsSchema = new Schema({
    entityId: String,
    isDisabledNotificactionOfTagged: { type: Boolean, default: false },
    isDisabledNotificactionOfawards: { type: Boolean, default: false },
    // inRanking: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);