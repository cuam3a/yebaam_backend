import  mongoose from 'mongoose';
const {Schema} = mongoose;
const  CategoriesOfCommunitiesProfessionalModel = new Schema({  
    name:String,
    description:String,
    creationDate:{type: Date, default: Date.now},
    isEnabled:{type:Boolean,default:true}   
}); 

module.exports = mongoose.model('CategoriesOfCommunitiesProfessional', CategoriesOfCommunitiesProfessionalModel);