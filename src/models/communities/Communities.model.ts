import mongoose from 'mongoose';
const { Schema } = mongoose;
const CommunitiesSchema = new Schema({
    name: { type: String, unique: true },
    type: { type: String, default: "community" },
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    CategoriesOfCommunitiesIDS: { type: Schema.Types.ObjectId, ref: 'CategoriesOfCommunities' },
    albumsIDS: [{ type: Schema.Types.ObjectId, ref: 'Albums' }],
    profilePicture: Object,
    lastConnection: { type: Date, default: Date.now },
    lastConnectionTime: String,
    lastPost: Date,
    membersMetric: { type: Number, default: 0 },
    filterPost: { type: Boolean, default: false },
    reportID: { type: Schema.Types.ObjectId, ref: 'CommunityReports' },
    myReport: Boolean,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Communities', CommunitiesSchema);