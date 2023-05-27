import mongoose, { Schema } from 'mongoose';

const UserRolesInTheCommunityModel = new Schema({
    code: Number,
    name: { type: String, unique: [true, 'Name is unique'] },
    description: String,
    permissions: [{ type: Schema.Types.ObjectId, ref: 'PermissionForProfessionalCommunityRoles' }],
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('UserRolesInTheCommunity', UserRolesInTheCommunityModel);