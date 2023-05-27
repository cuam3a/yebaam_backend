import mongoose from 'mongoose';
const { Schema } = mongoose;
const DataOfLandingsSchema = new Schema({
    trademarkID: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    landingID: { type: Schema.Types.ObjectId, ref: 'Landings' },
    dataObjetc: Object,
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true },
    isPaid: { type: Boolean, default: false },
    inUse: Boolean
});

module.exports = mongoose.model('DataOfLandings', DataOfLandingsSchema);