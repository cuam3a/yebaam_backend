import mongoose, { Schema } from 'mongoose';

const PermissionForProfessionalCommunityRolesModel = new Schema({
    name: { type: String, unique: true, required: [true, "Name is required"] },
    description: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('PermissionForProfessionalCommunityRoles', PermissionForProfessionalCommunityRolesModel);
