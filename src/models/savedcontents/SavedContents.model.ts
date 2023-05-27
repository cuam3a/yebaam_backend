import mongoose from 'mongoose';
const { Schema } = mongoose;
const SavedContentSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    // trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    professionalProfileID: { type: Schema.Types.ObjectId, ref: 'ProfessionalProfiles' },
    typeContent: String,
    postID: { type: Schema.Types.ObjectId, ref: 'Posts' },
    classifiedID: { type: Schema.Types.ObjectId, ref: 'Classifieds' },
    professionalPostID: { type: Schema.Types.ObjectId, ref: 'ProfessionalPosts' },
    saveDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedContents', SavedContentSchema);