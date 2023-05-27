import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { regulationsWithUsersServices } from '../../services/regulationswithusers/regulationswithusers.service';

class RegulationsWithUsersController {
    public async createRegulationsWithUsers(req: Request, res: Response){
        try {
           const body = req.body
           const createRWU = await regulationsWithUsersServices.createRegulationsWithUsers(body)
           if (createRWU) {
               responses.success(req,res, createRWU)
           } else {
               responses.error(req,res, ConstantsRS.ERROR_SAVING_RECORD) 
           }
        } catch (error) {
            responses.error(req,res,{...ConstantsRS.ERROR_SAVING_RECORD,error})           
        }
    }

    public async validateRegulationsWithUsers(req: Request, res: Response){
        try {
            const body = req.body
            const getRWU = await regulationsWithUsersServices.validateRegulationsWithUsers(body)
            if (getRWU) {
                responses.success(req,res,getRWU)
            } else {
                responses.success(req,res,null)
            }
        } catch (error) {
            responses.error(req,res,error)            
        }
    }

    public async updateRegulationsWithUsers(req: Request, res: Response){
        try {
            const body = req.body
            const updateRWU = await regulationsWithUsersServices.updateRegulationsWithUsers(body)
            if (updateRWU) {
                responses.success(req,res,updateRWU)
            } else {
                responses.error(req,res,ConstantsRS.ERROR_UPDATING_RECORD)
            }
        } catch (error) {
            responses.error(req,res,{...ConstantsRS.ERROR_UPDATING_RECORD,error})           
        }
    }

    public async getRegulationsWithUsers(req: Request, res: Response){
        try {
            const getRWU = await regulationsWithUsersServices.getRegulationsWithUsers()
            if (getRWU) {
                responses.success(req,res,getRWU)
            } else {
                responses.success(req,res,null)
            }
        } catch (error) {
            responses.error(req,res,error)            
        }
    }

    public async deleteRegulationsWithUsers(req: Request, res: Response){
        try {
            const body = req.body
            const deleteRWU = await regulationsWithUsersServices.deleteRegulationsWithUsers(body)
            if (deleteRWU) {
                responses.success(req,res,deleteRWU)
            } else {
                responses.error(req,res,ConstantsRS.ERROR_TO_DELETE_REGISTER)
            }
        } catch (error) {
            responses.error(req,res,{...ConstantsRS.ERROR_TO_DELETE_REGISTER,error})           
        }
    }
}


export const regulationsWithUsersController = new RegulationsWithUsersController()