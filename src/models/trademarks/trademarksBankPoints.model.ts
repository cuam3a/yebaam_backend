import mongoose from 'mongoose';
import { Schema } from 'mongoose';

let TrademarkBankPoint: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    marksId: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    totalBoughtPoints: { type: Number, default: 0 },
    availablePoints: { type: Number, default: 0 },
    spendedPoints: { type: Number, default: 0 },
    boughtPackages: [{ type: Schema.Types.ObjectId, ref: 'pointPackage' }],
    isEnabled: { type: Boolean, default: true }
});

TrademarkBankPoint.methods.getTotalBoughtPoints = function () {
    return this.totalBoughtPoints
}

TrademarkBankPoint.methods.getAvailablePoints = function () {
    return this.availablePoints
}

TrademarkBankPoint.methods.getSpendedPoints = function () {
    return this.spendedPoints
}

TrademarkBankPoint.methods.getBoughtPackages = function () {
    return this.boughtPackages
}

module.exports = mongoose.model('trademarkBankPoint', TrademarkBankPoint);