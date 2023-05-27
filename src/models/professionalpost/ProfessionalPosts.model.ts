import mongoose from 'mongoose';
const { Schema } = mongoose;
const PostsSchema = new Schema({
    type: { type: String, default: "professionalpost" },
    description: String,
    reactionsIDS: [{ type: Schema.Types.ObjectId, ref: 'UserReactions' }],
    publicactionDate: { type: Date, default: Date.now },
    postIDS: [{ type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' }],
    postIDContent: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    professionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    colorStatusID: { type: Schema.Types.ObjectId, ref: 'ColorLikePost' },
    professionalCommunityID: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities' },
    score: { type: Number, default: 0 },
    imgAndOrVideosGif: [{ Object }],
    taggedUsers: [{ type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' }],
    privacy: { type: Number, default: 0 }, // 0: Pública, 1: Privada, 2: Contactos,
    typePost: { type: Number, default: 0 },
    imgAndOrVideos: Object,
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shareds: { type: Number, default: 0 },
    variable_time: { type: Number, default: 0 },
    myReaction: Object,
    myReport: Boolean,
    isSaved: { type: Boolean, default: false },
    reportID: { type: Schema.Types.ObjectId, ref: 'PostsReports' },
    iSaveIt: Boolean,
    disableNotifications: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfessionalPosts', PostsSchema);