import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  ChatConnectionsSchema = new Schema({  
    adminID: String,
    entityID:String,
    chatID:{type:Schema.Types.ObjectId, ref:'ChatsRooms'},
    isMember:{type:Boolean, default:false},
    sendRequest:{type:Boolean, default:false},
    sendInvitation:{type:Boolean, default:false},
    cancelRequest:{type:Boolean, default:false},
    infoAdmin: Object,
    infoEntity: Object,
    creationDate:{type: Date, default: Date.now},
    isEnabled:{type:Boolean, default:true}
}); 

module.exports = mongoose.model('ChatConnections', ChatConnectionsSchema);