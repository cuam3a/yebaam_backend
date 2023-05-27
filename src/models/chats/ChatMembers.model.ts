import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  ChatMembersSchema = new Schema({  
    chatID:String,
    userID:String,
    creationDate:{type: Date, default: Date.now}
}); 

module.exports = mongoose.model('ChatMembers', ChatMembersSchema);