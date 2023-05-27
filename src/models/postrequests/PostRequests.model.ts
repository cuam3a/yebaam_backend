import mongoose from 'mongoose';
const { Schema } = mongoose;
const PostRequestsSchema = new Schema({
    communityID: { type: Schema.Types.ObjectId, ref: 'Communities' },
    professionalCommunityID: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities' },
    postID: { type: Schema.Types.ObjectId, ref: 'Posts' },
    professionalPostID: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    postingUserID: { type: Schema.Types.ObjectId, ref: 'Users' },
    postingProfessionalID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    status: { type: Number, default: 0 }, // 0: Petición, 1: Eliminado, 2: Posteado
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PostRequests', PostRequestsSchema);