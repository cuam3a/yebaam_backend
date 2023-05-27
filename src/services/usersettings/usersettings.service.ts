import { similarServices } from '../similarservices/similar.services';
const userSettingsModel = require('../../models/usersettings/UserSettings.model')

class UserSettingsServices {
    public async createUserSettings(body:any){
        try {
            const saveUS = new userSettingsModel(body)
            const createUS = await saveUS.save()
            return createUS
        } catch (error) {
            console.log(error);            
        }
    }

    public async modifyUserSettings(body:any){
        try {
            let updateUS:any = {}
            const existUser = await similarServices.identifyUserBrandOrCommunity(body.entityId)
            if (existUser) {
                if (existUser.code == undefined) {
                    const getUS = await this.getUserSettingsByEntityId({entityId:body.entityId})
                    if (getUS) {
                        updateUS = await userSettingsModel.findOneAndUpdate({_id:getUS.id}, body, {new:true})
                    }                   
                }
            }
            return updateUS
        } catch (error) {
            console.log(error);            
        }
    }

    public async deleteUserSettings(body:any){
        try {
            let deleteUS:any = {}
            const existUser = await similarServices.identifyUserBrandOrCommunity(body.entityId)
            if (existUser) {
                if (existUser.code != undefined) {
                    deleteUS = await userSettingsModel.findOneAndUpdate({_id:body.entityId})
                }
            }
            return deleteUS
        } catch (error) {
            console.log(error);            
        }
    }

    public async getUserSettingsByEntityId(body:any){
        try {
            let getUS
            const existUser = await similarServices.identifyUserBrandOrCommunity(body.entityId)
            if (existUser) {             
                if (existUser.code == undefined) {
                    getUS = await userSettingsModel.findOne({entityId:body.entityId})
                    if (!getUS) {
                        getUS = await this.createUserSettings({entityId:body.entityId})
                    }
                }
            }
            return getUS
        } catch (error) {
            console.log(error);            
        }
    }
}

export const userSettingsServices = new UserSettingsServices();