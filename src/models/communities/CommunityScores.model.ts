import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  CommunityScoresSchema = new Schema({  
    userID:{type:Schema.Types.ObjectId,ref:'Users'},
    communityID:{type:Schema.Types.ObjectId,ref:'Communities'},
    score:{type:Number,default:0},
    communityRolesID:{type:Schema.Types.ObjectId,ref:'CommunityRoles'},
    creationDate:{type: Date, default: Date.now},
    isEnabled:{type:Boolean,default:true}
}); 

module.exports = mongoose.model('CommunityScores', CommunityScoresSchema);