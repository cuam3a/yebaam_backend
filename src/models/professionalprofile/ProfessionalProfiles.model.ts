import mongoose from 'mongoose';
import { ConstantsRS } from '../../utils/constants';
const { Schema } = mongoose;
const ProfessionalProfilesSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, refPath: 'Users' },
    type: { type: String, default: "professional" },
    name: String,
    profilePicture: String,
    email: {
        type: String, unique: true,
        match: [/.+\@.+\..+/, ConstantsRS.PLEASE_ENTER_A_VALID_MAIL]
    },
    country: String,
    city: String,
    contactNumber: Number,
    profession: String,
    // certificatesIDS: [{ type: Schema.Types.ObjectId, ref: 'Certificates' }],
    // institution: String,
    // workplace: String,
    // workplaceAddress: String,
    // workplaceCity: String,
    creationDate: { type: Date, default: Date.now },
    studyIDS: [{ type: Schema.Types.ObjectId, ref: 'Studies' }],
    experienceIDS: [{ type: Schema.Types.ObjectId, ref: 'Experiences' }],
    lastConnection: { type: Date, default: Date.now },
    lastConnectionTime: String,
    lastPost: Date,
    socialWith: Object,
    connectionStatus: { type: Boolean, default: false },
    socketID: String,
    bannedPosts: { type: Number, default: 0 },
    strikeCounter: { type: Number, default: 0 },
    bannedCommunities: { type: Number, default: 0 },
    strikeCommunitiesCounter: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    banStartDate: Date,
    banEndDate: Date,
    disableAnyNotification: { type: Object, default: { beTagged: false, winAwardOrBadge: false } },
    numericIdentifier: Number,
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProfessionalProfiles', ProfessionalProfilesSchema);