import mongoose from 'mongoose';
const { Schema } = mongoose;
const ChatRoomsSchema = new Schema({
    name: String,
    adminID: String,
    code: String,
    members: [String],
    typeAdmin: String,
    chatCategoriesID: { type: Schema.Types.ObjectId, ref: 'ChatCategories' },
    socketIDRoom: String,
    creationDate: { type: Date, default: Date.now },
    privacity: { type: Number, default: 0 },
    description: String,
    rules: String,
    numberOfMembers: Number,
    profilePicture: Object,
    stateRequest: Number,
    isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('ChatsRooms', ChatRoomsSchema);