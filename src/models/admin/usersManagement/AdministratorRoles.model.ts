import mongoose, { Schema } from 'mongoose';
const AdministratorRolesSchema = new Schema({
    name: String,
    code: String,
    description: String,
    permitsID: [{ type: Schema.Types.ObjectId, ref: 'AdministratorPermission' }],
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdministratorRoles', AdministratorRolesSchema);