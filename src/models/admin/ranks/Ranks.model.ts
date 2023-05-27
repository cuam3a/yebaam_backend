import mongoose from 'mongoose';
const { Schema } = mongoose;
const RanksSchema = new Schema({
    name: { type: String, required: [true, "Name is required"], unique: true },
    order: { type: Number, default: 0 },
    description: String,
    image: Object,
    grayImage: Object,
    thumbnailImage: Object,
    requiredScore: { type: Number, required: [true, "Score is required"], unique: true },
    // permissions: [{ type: Schema.Types.ObjectId, ref: "permissionRank" }],
    default: { type: Boolean, default: false },
    latest: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    inUse: { type: Boolean, default: false }
});

module.exports = mongoose.model('Ranks', RanksSchema);