import mongoose from 'mongoose';
const { Schema } = mongoose;
const ClassifiedCategoriesSchema = new Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClassifiedCatregories', ClassifiedCategoriesSchema);