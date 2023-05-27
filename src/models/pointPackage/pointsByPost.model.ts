import mongoose, { Schema } from 'mongoose';

let PointsByPostmodel: Schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    marksId: { type: Schema.Types.ObjectId, ref: 'Trademarks' },
    likePoints: {
        value: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 },
        avaliablePoints: { type: Number, default: 0 }
    },
    commentPoints: {
        value: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 },
        avaliablePoints: { type: Number, default: 0 }
    },
    sharePoints: {
        value: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 },
        avaliablePoints: { type: Number, default: 0 }
    },
    benefitedByReactionsIDS: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    benefitedByCommentsIDS: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    benefitedBySharedIDS: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    isEnabled: { type: Boolean, default: true }
});

PointsByPostmodel.methods.getLikePointsByPost = function () {
    return this.likePoints
}

PointsByPostmodel.methods.getSharePointsByPost = function () {
    return this.sharePoints
}

PointsByPostmodel.methods.getCommentsPointsByPost = function () {
    return this.commentPoints
}

module.exports = mongoose.model('pointsByPost', PointsByPostmodel);