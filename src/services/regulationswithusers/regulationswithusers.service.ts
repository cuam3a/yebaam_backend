const regulationsWithUsersModel = require('../../models/regulationswithusers/RegulationsWithUsers.model')

class RegulationsWithUsersServices {
    public async createRegulationsWithUsers(body:any){
        try {
            const saveRWU = new regulationsWithUsersModel(body);
            return await saveRWU.save()
        } catch (error) {
            console.log(error);            
        }
    }

    public async validateRegulationsWithUsers(body:any){
        try {
            const getRWU = await regulationsWithUsersModel.findOne(body.id)
            return getRWU
        } catch (error) {
            console.log(error);            
        }
    }

    public async updateRegulationsWithUsers(body:any){
        try {
            let updateRWU
            const validateRWU = await this.validateRegulationsWithUsers({id:body.id})
            if (validateRWU) {
                updateRWU = regulationsWithUsersModel.findOneAndUpdate({_id:validateRWU.id}, body, {new:true})
            }
            return updateRWU
        } catch (error) {
            console.log(error);            
        }
    }

    public async getRegulationsWithUsers(){
        try {
            const getRWU = await regulationsWithUsersModel.find({})
            return getRWU ? getRWU : []
        } catch (error) {
            console.log(error);            
        }
    }

    public async deleteRegulationsWithUsers(body:any){
        try {
            let deleteRWU 
            const validateRWU = await this.validateRegulationsWithUsers({id:body.id})
            if (validateRWU) {
                deleteRWU = regulationsWithUsersModel.findOneAndDelete({_id:validateRWU.id})
            }
            return deleteRWU
        } catch (error) {
            console.log(error);            
        }
    }
}

export const regulationsWithUsersServices = new RegulationsWithUsersServices()