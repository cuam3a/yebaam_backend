import mongoose from 'mongoose';
const { Schema } = mongoose;
const RoleAssignNotificationsCommunitySchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    communityId: { type: Schema.Types.ObjectId, ref: 'Communities' },
    assignedRoleId: { type: Schema.Types.ObjectId, ref: 'CommunityTypeManager' },
    notificationReviewDate: Date,
    type: { type: String, default: 'rolesCommunitytUser' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('RoleAssignNotificationsCommunity', RoleAssignNotificationsCommunitySchema);