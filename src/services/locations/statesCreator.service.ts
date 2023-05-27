import { ConstantsRS } from '../../utils/constants';
const statesModel = require('../../models/locations/States.model');

class StatesCreatorServices {
    public async saveState(body: { countryID: number, stateID: number, stateName: any }) {

        return new Promise(async (resolve, reject) => {
            try {
                const stateExist = await statesModel.findOne({ stateID: body.stateID })

                if (!stateExist) {
                    const stateToSave = new statesModel(body);
                    const stateSaved = await stateToSave.save();
                    resolve(stateSaved);
                }
            } catch (error) {
                console.log("E: ", error);
                reject(error);
            }
        })
    }

    public async createState(body: any) {
        let rta, rtaError
        const stateExist = await statesModel.findOne({ stateID: body.stateID })

        if (!stateExist) {
            const stateToSave = new statesModel(body);
            const stateSaved = await stateToSave.save();
            if (stateSaved) {
                rta = stateSaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async getByCountryID(body: any) {
        let rta, rtaError

        const states = await statesModel.find({ countryID: body.countryID })
        if (states) {
            rta = states
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const statesCreatorServices = new StatesCreatorServices();