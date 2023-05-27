import mongoose from 'mongoose';
const { Schema } = mongoose;
const ExperiencesSchema = new Schema({
    professionalProfileID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalProfiles' },
    type: { type: String, default: "experience" },
    position: String,
    company: String,
    ubication: Object,
    activities: String,
    creationDate: { type: Date, default: Date.now },
    startDate: Date,
    endDate: Date,
    isCurrently: { type: Boolean, default: false },
    certificateIDS: [{ type: Schema.Types.ObjectId, ref: 'Certificates' }],
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Experiences', ExperiencesSchema);