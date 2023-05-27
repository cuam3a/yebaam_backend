import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  ReactionsSchema = new Schema({
    name:String,  
    description:String,
    icon:String,
    value:Number,
    creationDate:{type: Date, default: Date.now}
}); 

module.exports = mongoose.model('Reactions', ReactionsSchema);