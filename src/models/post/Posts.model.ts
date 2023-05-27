import mongoose from 'mongoose';
const { Schema } = mongoose;
const PostsSchema = new Schema({
    type: { type: String, default: "post" },
    description: String,
    reactionsIDS: [{ type: Schema.Types.ObjectId, ref: 'UserReactions' }],
    publicactionDate: { type: Date, default: Date.now },
    postIDS: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    postIDContent: { type: Schema.Types.ObjectId, ref: 'Posts' },
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    colorStatusID: { type: Schema.Types.ObjectId, ref: 'ColorLikePost' },
    score: { type: Number, default: 0 },
    communityID: { type: Schema.Types.ObjectId, ref: 'Communities' },
    imgAndOrVideosGif: [{ Object }],
    taggedUsers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    taggedTrademarks: [{ type: Schema.Types.ObjectId, ref: 'Trademarks' }],
    privacy: { type: Number, default: 0 }, // 0: Pública, 1: Privada, 2: Amigos
    albumID: { type: Schema.Types.ObjectId, ref: 'Albums' },
    albumsIDS: [{ type: Schema.Types.ObjectId, ref: 'Albums' }],
    typePost: { type: Number, default: 0 },
    typeCat: Number,
    imgAndOrVideos: Object,
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shareds: { type: Number, default: 0 },
    variable_time: { type: Number, default: 0 },
    myReaction: Object,
    ubication: Object,
    isSaved: { type: Boolean, default: false },
    reportID: { type: Schema.Types.ObjectId, ref: 'PostsReports' },
    myReport: Boolean,
    // dataToPoints: Object,
    pointsByPostID: { type: Schema.Types.ObjectId, ref: 'pointsByPost' },
    activePoints: Boolean,
    hexadecimal: { type: String, default: '#F1F2F6' },
    iSaveIt: Boolean,
    disableNotifications: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Posts', PostsSchema);