import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProfessionalCommunityUsersModel = new Schema({
    assignedUserId: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles', required: true },
    allocatorUserId: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities', required: true },
    roleCommunityId: { type: Schema.Types.ObjectId, ref: 'UserRolesInTheCommunity', default: null },
    isNormalUser: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfessionalCommunityUsers', ProfessionalCommunityUsersModel);