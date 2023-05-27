import mongoose from 'mongoose';
const { Schema } = mongoose;
const StudiesSchema = new Schema({
    professionalProfileID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalProfiles' },
    type: { type: String, default: "study" },
    degree: String,
    institution: String,
    ubication: Object,
    startDate: Date,
    endDate: Date,
    isCurrently: { type: Boolean, default: false },
    certificateIDS: [{ type: Schema.Types.ObjectId, ref: 'Certificates' }],
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Studies', StudiesSchema);