import { ConstantsRS } from '../../utils/constants';
const countriesModel = require('../../models/locations/Countries.model');

class CountriesCreatorServices {
    public async saveCountry(body: { countryID: number, countryName: string }) {

        return new Promise(async (resolve, reject) => {
            try {
                const countryExist = await countriesModel.findOne({ countryID: body.countryID })

                if (!countryExist) {
                    const countryToSave = new countriesModel(body);
                    const countrySaved = await countryToSave.save();
                    resolve(countrySaved);
                }
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    public async createCountry(body: any) {
        let rta, rtaError
        const countryExist = await countriesModel.findOne({ countryID: body.countryID })

        if (!countryExist) {
            const countryToSave = new countriesModel(body);
            const countrySaved = await countryToSave.save();
            if (countrySaved) {
                rta = countrySaved
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
        }

        return rta ? rta : rtaError
    }

    public async getAll() {
        let rta, rtaError

        const allCountries = await countriesModel.find({
            countryID: { $in: [42, 82] }
        })
        if (allCountries) {
            rta = allCountries
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const countriesCreatorServices = new CountriesCreatorServices();