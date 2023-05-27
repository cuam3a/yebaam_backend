import { ConstantsRS } from '../../utils/constants';
import { challengeServices } from '../challenges/challenges.services';
const systemActionModel = require('../../models/systemactions/SystemActions.model');

class SystemActionServices {
    public async saveSystemAction(body: any) {
        let rta, rtaError
        const action = await systemActionModel.findOne({ actionCode: body.actionCode })

        if (!action) {
            const systemActionToSave = new systemActionModel(body);
            const systemActionSaved = await systemActionToSave.save();
            if (systemActionSaved) {
                rta = systemActionSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async updateSystemAction(body: any) {
        let rta, rtaError
        const action = await systemActionModel.findById(body.id)

        if (action) {
            const systemActionToUpdate = await systemActionModel.updateOne({ _id: body.id }, body);

            if (systemActionToUpdate.nModified == 1) {
                rta = await systemActionModel.findById(body.id)
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deleteSystemAction(body: any) {
        let rta, rtaError
        const useAction = await challengeServices.getChallenegeByAction({systemActionID:body.id})
        if (!useAction) {
            const action = await systemActionModel.findById(body.id).exec()
            if (action) {
                const systemActionsToDelete = await systemActionModel.deleteOne({ _id: body.id });
    
                if (systemActionsToDelete) {
                    rta = "Acción del sistema eliminada satisfactoriamente"
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
        }

        return rta ? rta : rtaError
    }

    public async getById(body: any) {
        let rta, rtaError

        const systemActionById = await systemActionModel.findById(body.id)
        if (systemActionById) {
            rta = systemActionById
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError

        const allSystemActions = await systemActionModel.find({})
        if (allSystemActions) {
            rta = allSystemActions
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }

    public async getByActionCode(actionCode: any) {
        let rta, rtaError

        const systemActionByActionCode = await systemActionModel.findOne({ actionCode })
        if (systemActionByActionCode) {
            rta = systemActionByActionCode
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const systemActionServices = new SystemActionServices()