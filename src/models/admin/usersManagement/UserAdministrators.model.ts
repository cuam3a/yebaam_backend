import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  UserAdministratorsSchema = new Schema({  
    name:String,
    birthDate:Date,
    email:String,
    description:String,
    password:String,
    phone:String,
    ubication:Object,
    gender:String,
    adminRoleID:[{type:Schema.Types.ObjectId, ref:'AdministratorRoles'}],
    profilePicture:Object,    
    socketID: String,
    creationDate:{type: Date, default: Date.now},
    type:{type:String, default: "admin"},
    connectionStatus:{ type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
    lastConnection:{ type: Date, default: Date.now },
    lastConnectionTime:String,
    isEmailVerified: {type:Boolean, default:true},
    verification_code: Object,
}); 

module.exports = mongoose.model('UserAdministrators', UserAdministratorsSchema);