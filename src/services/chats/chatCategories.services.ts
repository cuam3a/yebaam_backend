import { ConstantsRS } from '../../utils/constants';
import { chatRoomsSevices } from './chatRooms.services';
const chatCategoriesModel = require("../../models/chats/ChatCategories.model");

class ChatCategoriresServices{
    public async getAllChatCategories(){
        try {
            let rta
            let getCategories = await chatCategoriesModel.find({isEnabled:true});
            return getCategories ? rta = getCategories : rta
        } catch (error) {
            console.log(error);            
        }
    }
    public async getChatCategoryById(chatCategoryID:string){
        try {
            let rta
            let getCategory = await chatCategoriesModel.findOne({_id:chatCategoryID, isEnabled:true});
            return getCategory ? rta = getCategory : rta
        } catch (error) {
            console.log(error);            
        }
    }
    public async getChatCategoryByName(name:string){
        try {
            let rta
            let getCategory = await chatCategoriesModel.findOne({name:name, isEnabled:true});
            return getCategory ? rta = getCategory : rta
        } catch (error) {
            console.log(error);            
        }
    }
    public async createChatCategory(obj:any){
        try {
            let saveCategory;
            const getCategory = await this.getChatCategoryByName(obj.name);           
            if (!getCategory) {
                const saveTocategorie = new chatCategoriesModel(obj);
                saveCategory = await saveTocategorie.save(); 
            } else {
                saveCategory = ConstantsRS.THE_RECORD_ALREDY_EXISTS;                 
            }
            return saveCategory;
        } catch (error) {
            console.log(error);
        }
    }
    public async removeChatCategoryByID(chatCategoryID:string){
        try {
            let deleteChatCategory; 
            const useCategory = await chatRoomsSevices.getChatRoomsByCategoryIdForDelete({chatCategoriesID:chatCategoryID})
            if (!useCategory) {
                deleteChatCategory = await chatCategoriesModel.findOneAndDelete({_id:chatCategoryID});
            } else {
                deleteChatCategory = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return deleteChatCategory
        } catch (error) {
            console.log(error);
        }
    }
    public async deleteChatCategoryByID(chatCategoryID:string){
        try {
            let deleteChatCategory; 
            const useCategory = await chatCategoriesModel.findOneAndUpdate({_id:chatCategoryID}, {isEnabled:false},{new:true});
            if (!useCategory) {
                deleteChatCategory = await chatCategoriesModel.findOneAndDelete({_id:chatCategoryID});
            } else {
                deleteChatCategory = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return deleteChatCategory
        } catch (error) {
            console.log(error);
        }
    }
    public async updateChatCategory(obj:any){
        try {
            let updateToResponse, updateResponse;
            let getCategory = await this.getChatCategoryByName(obj.name);
            if (!getCategory) {
                updateToResponse = await chatCategoriesModel.findOneAndUpdate({_id:obj.chatCategoryID},obj,{new : true});
            }else if(obj.chatCategoryID == getCategory.id){
                updateToResponse = await chatCategoriesModel.findOneAndUpdate({_id:obj.chatCategoryID},obj,{new : true});
            }
            return updateToResponse ? updateResponse = updateToResponse : updateResponse;
        } catch (error) {
            console.log(error);            
        }
    }    
}

export const chatCategoriresServices = new ChatCategoriresServices();