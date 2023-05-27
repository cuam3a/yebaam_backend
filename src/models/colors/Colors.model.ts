import mongoose from 'mongoose';
const { Schema } = mongoose;
const ColorsModel = new Schema({
    colorName: String,
    position: Number,
    hexadecimal: String,
    valueInlikes: Number,
    //pointValue: {type:Number, default: 0},
    modificationDate: { type: Date, default: Date.now },
    creationDate: { type: Date, default: Date.now },
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Colors', ColorsModel);