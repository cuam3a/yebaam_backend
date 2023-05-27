import { notificationsServices } from '../notifications/notifications.services';
const ColorModel = require('../../models/colors/Colors.model')
const postModel = require('../../models/post/Posts.model');

class ColorsServices{
    public async createColor(body:any){
        try {
            let colorToSaved, colorSaved
            const getColor = await this.getColorByAnyField(body.name)
            if (!getColor || getColor.id == body.colorId) {
                colorToSaved = new ColorModel(body)
                colorSaved = await colorToSaved.save()
            }
            return colorSaved
        } catch (error) {
            console.log(error);            
        }
    }

    public async getColorByAnyField(body:any){
        try {
            let getColor
            if (body.name != undefined) { 
                getColor = await ColorModel.findOne({name:body.name})
            } else if (body.colorId != undefined) { 
                getColor = await ColorModel.findOne({_id:body.colorId})
            } else if (body.hexadecimal != undefined) { 
                getColor = await ColorModel.findOne({hexadecimal:body.hexadecimal})
            } else if (body.activeOrInactive != undefined) { 
                getColor = await ColorModel.find({isEnabled:body.activeOrInactive})
            } 
            return getColor
        } catch (error) {
            console.log(error);            
        }
    
    }

    public async getAllColors(){
        try {
            const getColors = await ColorModel.find({}).sort('-valueInlikes')
            return getColors
        } catch (error) {
            console.log(error);            
        }
    }

    public async updateColorById(body:any){
        try {
            let colorUpdate
            const getColor = await this.getColorByAnyField(body.name)
            if (!getColor || getColor.id == body.colorId) {
                colorUpdate = await await ColorModel.findOneAndUpdate({_id:body.colorId},body,{new:true})
            }
            return colorUpdate
        } catch (error) {
            console.log(error);            
        }
    
    }

    public async deleteColor(body:any){
        try {
            const deleteColor = await ColorModel.findOneAndDelete({_id:body.colorId})
            return deleteColor
        } catch (error) {
            console.log(error);            
        }
    }

    public async reactionColorChange(body:any){
        try {
            let updatePost, quantityLikes = body.likes, colorReaction:any={}
            if (body.userID != undefined && body.communityID == undefined) {               
                const getColor = await ColorModel.find({isEnabled:true})
                
                if (getColor.length > 0) {
                    getColor.forEach((color:any) => {
                        if (color.valueInlikes <= quantityLikes) {
                            colorReaction = color
                        }
                    });                    
                    if (body.hexadecimal != undefined) {
                        if (colorReaction.hexadecimal != body.hexadecimal) {
                            updatePost = await postModel.findOneAndUpdate({_id:body.id},{hexadecimal:colorReaction.hexadecimal},{new:true})
                            await notificationsServices.sendNotificationColorChange(body)
                        }
                    }else {
                        updatePost = await postModel.findOneAndUpdate({_id:body.id},{hexadecimal:colorReaction.hexadecimal},{new:true})
                        await notificationsServices.sendNotificationColorChange(body)
                    }
                }
            }
            return updatePost
        } catch (error) {
            console.log(error);            
        }
    }
}
export const colorsServices = new ColorsServices();