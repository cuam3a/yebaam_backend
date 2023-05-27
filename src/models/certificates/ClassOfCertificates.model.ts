import mongoose from 'mongoose';
const { Schema } = mongoose;
const ClassOfCertificatesSchema = new Schema({
    typeID: { type: Schema.Types.ObjectId, refPath: 'CertificateClassTypes' },
    name: String,
    codeType: String,
    forConcept: String,
    scoreValue: Number,
    price: Number,
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClassOfCertificates', ClassOfCertificatesSchema);