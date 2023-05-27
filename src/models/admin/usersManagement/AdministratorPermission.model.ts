import mongoose from 'mongoose';
const { Schema } = mongoose;
const AdministratorPermissionSchema = new Schema({
    name: String,
    code: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdministratorPermission', AdministratorPermissionSchema);