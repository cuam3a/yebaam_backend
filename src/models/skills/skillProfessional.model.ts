import mongoose from 'mongoose';
const { Schema } = mongoose;

const skillProfesionalSchema = new Schema({
    description: String,
    professionalID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles', required: true },
    // skills: { type: Schema.Types.ObjectId, ref: 'skill', required: true },
    skill: String,
    cretionDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('skillProfesional', skillProfesionalSchema);