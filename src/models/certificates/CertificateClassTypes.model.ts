import mongoose from 'mongoose';
const { Schema } = mongoose;
const CertificateClassTypesSchema = new Schema({
    codeType: String,
    name: String,
    forConcept: String,
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('CertificateClassTypes', CertificateClassTypesSchema);