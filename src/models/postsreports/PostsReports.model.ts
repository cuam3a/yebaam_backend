import mongoose from 'mongoose';
const { Schema } = mongoose;
const PostsSchema = new Schema({
    reportingEntitiesIDS: [String],
    reportedUserID: { type: Schema.Types.ObjectId, ref: 'Users' },
    reportedTrademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    reportedProfessionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    reportedCommunityID: { type: Schema.Types.ObjectId, ref: 'Communities' },
    reportedCommunityUserID: { type: Schema.Types.ObjectId, ref: 'Users' },
    reportedCommunityTrademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    reportedCommunityProfessionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    postID: { type: Schema.Types.ObjectId, ref: 'Posts' },
    professionalPostID: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    typeOfReports: [{ type: Schema.Types.ObjectId, ref: 'TypeOfReports' }],
    descriptions: [Object],
    objection: String,
    reportState: { type: Number, default: 0 }, //0: Reporte, 1: Pendiente, 2: Olvidado, 3: En Revisión, 4: Omitido, 5: Sancionado
    reportDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('PostsReports', PostsSchema);