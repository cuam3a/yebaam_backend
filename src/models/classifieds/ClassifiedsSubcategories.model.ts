import mongoose from 'mongoose';
const { Schema } = mongoose;
const SubcategoriesSchema = new Schema({
    name: String,
    description: String,
    categoryID: { type: Schema.Types.ObjectId, ref: 'Catregories' },
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClassifiedSubcategories', SubcategoriesSchema);