import mongoose from 'mongoose';
const { Schema } = mongoose;
const RoleAssignNotificationsProfessionalCommunitySchema = new Schema({
    senderID: String,
    addresseeID: String,
    infoSender: Object,
    infoAddressee: Object,
    doYouSeeTheNotification: { type: Boolean, default: false },
    communityId: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities' },
    assignedRoleId: { type: Schema.Types.ObjectId, ref: 'UserRolesInTheCommunity' },
    notificationReviewDate: Date,
    type: { type: String, default: 'rolesProfessionalCommunitytUser' },
    notification: String,
    whoIsNotified: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('RoleAssignNotificationsProfessionalCommunity', RoleAssignNotificationsProfessionalCommunitySchema);