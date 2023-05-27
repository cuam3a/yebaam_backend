import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommunityManagersSchema = new Schema({
    assignedUserId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    allocatorUserId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Communities', required: true },
    typeId: { type: Schema.Types.ObjectId, ref: 'CommunityTypeManager', default: null },
    isNormalUser: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('CommunityManagers', CommunityManagersSchema);