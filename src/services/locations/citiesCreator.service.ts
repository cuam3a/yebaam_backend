import { ConstantsRS } from '../../utils/constants';
const citiesModel = require('../../models/locations/Cities.model');

class CitiesCreatorServices {
    public async saveCity(body: { stateID: number, cityID: number, cityName: any }) {
        return new Promise(async (resolve, reject) => {
            try {
                const cityExist = await citiesModel.findOne({ cityID: body.cityID })

                if (!cityExist) {
                    const cityToSave = new citiesModel(body);
                    const citySaved = await cityToSave.save();
                    resolve(citySaved);
                }
            } catch (error) {
                console.log("E: ", error);
                reject(error);
            }
        })
    }

    public async createCity(body: any) {
        let rta, rtaError
        const cityExist = await citiesModel.findOne({ cityID: body.cityID })

        if (!cityExist) {
            const cityToSave = new citiesModel(body);
            const citySaved = await cityToSave.save();
            if (citySaved) {
                rta = citySaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async getByStateID(body: any) {
        let rta, rtaError

        const cities = await citiesModel.find({ stateID: body.stateID })
        if (cities) {
            rta = cities
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const citiesCreatorServices = new CitiesCreatorServices();