import mongoose from 'mongoose';
const { Schema } = mongoose;
const QRCodeSchema = new Schema({
    entityID: String,
    name: String,
    urlQR:String,
    urlImageOrVideos: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('QRCode', QRCodeSchema);