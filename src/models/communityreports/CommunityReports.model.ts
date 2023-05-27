import mongoose from 'mongoose';
const { Schema } = mongoose;
const CommunityReportsSchema = new Schema({
    reportingEntitiesIDS: [String],
    reportedCommunityID: { type: Schema.Types.ObjectId, ref: 'Communities' },
    reportedProfessionalCommunityID: { type: Schema.Types.ObjectId, ref: 'ProfessionalCommunities' },
    reportedUserAdminID: { type: Schema.Types.ObjectId, ref: 'Users' },
    reportedProfessionalAdminID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    typeOfReports: [{ type: Schema.Types.ObjectId, ref: 'TypeOfReports' }],
    descriptions: [Object],
    objection: String,
    reportState: { type: Number, default: 0 }, //0: Reporte, 1: Pendiente, 2: Olvidado, 3: En Revisión, 4: Omitido, 5: Sancionado
    reportDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('CommunityReports', CommunityReportsSchema);