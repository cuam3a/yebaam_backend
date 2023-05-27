import mongoose from 'mongoose';
const { Schema } = mongoose;
const AlbumsSchema = new Schema({
    name: String,
    entityID: String,
    quantity: { type: Number, default: 0 },
    privacy: { type: Number, default: 0 }, // 0: Pública, 1: Privada, 2: Amigos
    coverAlbum: Object,
    isDefault: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('Albums', AlbumsSchema);