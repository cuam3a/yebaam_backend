import mongoose, { Schema } from 'mongoose';
import { ConstantsRS } from '../../utils/constants';

const UsersSchema = new Schema({
    type: { type: String, default: "user" },
    name: String,
    birthday: Date,
    email: {
        type: String, unique: true,
        match: [/.+\@.+\..+/, ConstantsRS.PLEASE_ENTER_A_VALID_MAIL]
    },
    description: String,
    password: String,
    phone: String,
    ubication: { type: Object, default: { originCity: '' } },
    gender: String,
    hasProfessionalProfile: { type: Boolean, default: false },
    professionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    profilePicture: String,
    albumsIDS: [{ type: Schema.Types.ObjectId, ref: 'Albums' }],
    socialIDS: [{ type: Schema.Types.ObjectId, ref: 'Social' }],
    score: { type: Number, default: 0 },
    adminID: String,
    verification_code: Object,
    isEmailVerified: { type: Boolean, default: false },
    externalRegister: Object,
    idCredential: Number,
    isDataVerified: { type: Boolean, default: false },
    isAcceptTerms: { type: Boolean, default: false },
    connectionStatus: { type: Boolean, default: false },
    socketID: String,
    workplaces: [Object],
    studies: [Object],
    relationshipStatus: { type: String, default: '' },
    alias: { type: String, default: '' },
    socialWith: Object,
    connectionsFriends: { type: Number, default: 0 },
    lastConnection: { type: Date, default: Date.now },
    lastConnectionTime: String,
    lastPost: Date,
    bannedPosts: { type: Number, default: 0 },
    strikeCounter: { type: Number, default: 0 },
    bannedCommunities: { type: Number, default: 0 },
    strikeCommunitiesCounter: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    banStartDate: Date,
    banEndDate: Date,
    authenticationData: Object,
    banRemaining: Object,
    privateData: {
        type: Object, default:
        {
            email: 0,
            birthday: 0,
            phone: 0,
            ubication: 0,
            gender: 0,
            relationshipStatus: 0,
        }
    },
    disableAnyNotification: { type: Object, default: { beTagged: false, winAwardOrBadge: false } },
    rankID: { type: Schema.Types.ObjectId, ref: 'Ranks' },
    entityRankID: { type: Schema.Types.ObjectId, ref: 'EntityRanks' },
    numericIdentifier: Number,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Users', UsersSchema);