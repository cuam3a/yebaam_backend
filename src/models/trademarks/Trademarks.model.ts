import mongoose from 'mongoose';
import { ConstantsRS } from '../../utils/constants';

const { Schema } = mongoose;
const TrademarksSchema = new Schema({
    type: { type: String, default: "marks" },
    name: String,
    socialReason: String,
    typeDocument: Number,
    nitOrCedule: String,
    typeOfMarkID: { type: Schema.Types.ObjectId, ref: 'TypeOfMarks' },
    email: {
        type: String, unique: true,
        match: [/.+\@.+\..+/, ConstantsRS.PLEASE_ENTER_A_VALID_MAIL]
    },
    password: String,
    description: String,
    typeOfProfile: String,
    phone: String,
    ubication: Object,
    albumsIDS: [{ type: Schema.Types.ObjectId, ref: 'Albums' }],
    socialIDS: [{ type: Schema.Types.ObjectId, ref: 'Social' }],
    score: { type: Number, default: 0 },
    verification_code: Object,
    isEmailVerified: { type: Boolean, default: false },
    isDataVerified: { type: Boolean, default: false },
    isAcceptTerms: { type: Boolean, default: false },
    externalRegister: Object,
    idCredential: Number,
    profilePicture: Object,
    codeEconomicActivity: String,
    nameEconomicActivity: String,
    connectionStatus: { type: Boolean, default: false },
    socialWith: Object,
    professionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    lastConnection: { type: Date, default: Date.now },
    lastConnectionTime: String,
    lastPost: Date,
    currentLanding: { type: Schema.Types.ObjectId, ref: 'DataOfLandings' },
    connectionsFollowers: { type: Number, default: 0 },
    privacy: { type: Number, default: 0 },
    places: [Object],
    bannedPosts: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    strikeCounter: { type: Number, default: 0 },
    banStartDate: Date,
    banEndDate: Date,
    authenticationData: Object,
    disableAnyNotification: { type: Object, default: { beTagged: false, winAwardOrBadge: false } },
    brandRankingID: { type: Schema.Types.ObjectId, ref: 'BrandRanking' },
    numericIdentifier: Number,
    inRanking: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Trademarks', TrademarksSchema);