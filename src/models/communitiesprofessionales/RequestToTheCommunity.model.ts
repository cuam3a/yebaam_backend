import mongoose, { Schema } from 'mongoose';

const RequestToTheCommunityModel = new Schema({
    professionalId: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    communityId: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities' },
    isPending: { type: Boolean, default: true },
    isAccepted: { type: Boolean, default: false },
    isDeclined: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestToTheCommunity', RequestToTheCommunityModel);