import mongoose from 'mongoose';
const { Schema } = mongoose;
const ClassifiedsSchema = new Schema({
    type: { type: String, default: "classified" },
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    classifedsStatusID: { type: Schema.Types.ObjectId, ref: 'ClassifiedsStatus' },
    categoryID: { type: Schema.Types.ObjectId, ref: 'ClassifiedCatregories' },
    subcategoryID: { type: Schema.Types.ObjectId, ref: 'ClassifiedSubcategories' },
    countryID: { type: Schema.Types.ObjectId, ref: 'Countries' },
    stateID: { type: Schema.Types.ObjectId, ref: 'States' },
    cityID: { type: Schema.Types.ObjectId, ref: 'Cities' },
    title: String,
    description: String,
    price: Number,
    multimedia: [Object],
    iSaveIt: Boolean,
    mySellerRating: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Classifieds', ClassifiedsSchema);