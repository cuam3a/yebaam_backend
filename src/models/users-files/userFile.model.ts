import mongoose from 'mongoose';
const { Schema } = mongoose;

const userFileSchema = new Schema({
    entityId: String,
    nameFile: String,
    nameInLanding: String,
    type: String,
    url: String,
    Bucket: String,
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('userFile', userFileSchema);