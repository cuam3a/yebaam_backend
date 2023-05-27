import mongoose from 'mongoose';
const { Schema } = mongoose;
const CertificatesSchema = new Schema({
    type: { type: String, default: 'certificate' },
    professionalProfileID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalProfiles' },
    userID: { type: Schema.Types.ObjectId, refPath: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, refPath: 'Trademarks' },
    certificateClassID: { type: Schema.Types.ObjectId, refPath: 'ClassOfCertificates' },
    certificateClass: String,
    certificateConcept: String,
    name: String,
    description: String,
    file: Object,
    requestDate: Date,
    state: { type: Number, default: 0 },//0: Upload, 1: In Review, 2: Invalidated, 3: Validated
    requestPaid: Boolean,
    invalidationReason: String,
    invalidationCounter: Number,
    validationDate: Date,
    expeditionDate: Date,
    expirationDate: Date,
    typeForNotiFy: { type: String, default: 'certificate' },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Certificates', CertificatesSchema);