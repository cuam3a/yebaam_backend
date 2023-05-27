import { ConstantsRS } from '../../utils/constants';
const reactionsModel = require('../../models/reactions/Reactions.model');

class ReactionsServices {
    public async createReaction(body: any) {
        try {
            let rta, rtaError, token, success = false, response = {}
            const reactionToSave = new reactionsModel(body)

            const reaction = await reactionToSave.save()
            if (reaction) {
                success = true
                rta = reaction
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }

            return response = {
                error: rtaError ? rtaError : null,
                success: success,
                token: token ? token : null,
                data: rta ? rta : []
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const reactionsServices = new ReactionsServices()