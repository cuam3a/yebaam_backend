import mongoose from 'mongoose';
const { Schema } = mongoose;
const PurchasesSchema = new Schema({
    payOrder: String,
    type: { type: String, default: 'purchase' },
    userID: { type: Schema.Types.ObjectId, refPath: 'Users' },
    trademarkID: { type: Schema.Types.ObjectId, refPath: 'Trademarks' },
    professionalProfileID: { type: Schema.Types.ObjectId, refPath: 'ProfessionalProfiles' },
    certificateID: { type: Schema.Types.ObjectId, refPath: 'Certificates' },
    landingID: { type: Schema.Types.ObjectId, refPath: 'Landings' },
    pointsPackageID: { type: Schema.Types.ObjectId, refPath: 'pointPackage' },
    purchaseType: String,
    purchaseDate: { type: Date, default: Date.now },
    price: Number,
    quantiy: Number,
    status: Number // 0: Aprobado, 1: Pendiente, 2:Rechazado
});

module.exports = mongoose.model('Purchases', PurchasesSchema);