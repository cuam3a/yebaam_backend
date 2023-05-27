import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  ChatsSchema = new Schema({  
    //isRoom:{type: Boolean, default: false},
    name:String,
    adminID:String,
    code:String,
    members:[String],
    typeAdmin:String,
    chatCategoriesID:[{type: Schema.Types.ObjectId, ref: 'ChatCategories'}],
    socketIDRoom:String,
    creationDate:{type: Date, default: Date.now},
    privacity:{type:Number, default: 0},
    description:String,
    rules:String,
    numberOfMembers: Number,
    profilePicture:String
}); 

module.exports = mongoose.model('Chats', ChatsSchema);