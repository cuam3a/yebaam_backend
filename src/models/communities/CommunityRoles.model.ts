import mongoose from 'mongoose';
const { Schema } = mongoose;
const CommunityRolesSchema = new Schema({
    name: { type: String, unique: [true, 'the name is unique'] },
    requiredScore: Number,
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityRoles', CommunityRolesSchema);