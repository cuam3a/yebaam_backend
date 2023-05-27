import mongoose from 'mongoose';
const { Schema } = mongoose;
const ConversationListsModel = new Schema({
    firstId: String,
    secondId: String,
    lastMessage: Object,
    infoFirst:Object,
    infoSecond:Object,
    lastMessageDate:Date,
    doYouSeeTheConversation: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    isEnabled: {type:Boolean,default:true}
});

module.exports = mongoose.model('ConversationLists', ConversationListsModel);