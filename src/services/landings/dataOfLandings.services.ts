import { ConstantsRS } from '../../utils/constants';
import { landingsServices } from './landings.services';
import { trademarksServices } from '../trademarks/trademarks.services';
const dataLandingModel = require('../../models/landings/DataOfLandings.model')

class DataOfLandingsServices {
    //#region  use for trademarkServices
    public async assignDataOfLandingDefault(trademarkID: String) {
        try {
            let createDataLanding
            const defaultLanding = await landingsServices.getLandingDefault()
            if (defaultLanding) {
                const dataOfLandingToCreate = new dataLandingModel({ trademarkID: trademarkID, landingID: defaultLanding.id, inUse: true })
                createDataLanding = await dataOfLandingToCreate.save();
            }
            return createDataLanding
        } catch (error) {
            console.log(error);
        }
    }
    //#endregion

    //#region use landing
    public async useLanding(obj: any) {
        try {
            let useLanding
            //const getBrand = await trademarksServices.getBrandByID(obj.trademarkID)
            const validateLanding = await this.getLandingByIDS(obj.trademarkID, obj.landingID)
            const getMyLanding = await this.getLandingByTrademarkID(obj.trademarkID)
            if (validateLanding && getMyLanding.length > 0) {
                for await (let landingU of getMyLanding) {
                    if (landingU.landingID.id == obj.landingID) {
                        useLanding = await this.updateLandingUse(landingU.id, true)
                        await trademarksServices.updateBrandDataBasicLanding({ id: obj.trademarkID, dataLandingID: landingU.id })
                    } else {
                        await this.updateLandingUse(landingU.id, false)
                    }
                }
            }
            return useLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async getDataLandingByID(id: String) {
        try {
            let getLanding
            const getDataLanding = await dataLandingModel.findOne({ _id: id })
                .populate('trademarkID')
                .populate('landingID')
            getDataLanding ? getLanding = getDataLanding : getLanding;
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async updateLandingUse(id: String, use: Boolean) {
        try {
            let updateLanding
            updateLanding = await dataLandingModel.findOneAndUpdate({ _id: id }, { inUse: use }, { new: true });
            return updateLanding
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    public async buyDataOfLandings(obj: any) {
        try {
            let createDataLanding    
            const validateLanding = await this.getLandingByIDS(obj.trademarkID, obj.landingID)
            console.log("validateLanding: ", validateLanding)
            if (!validateLanding) {
                const dataOfLandingToCreate = new dataLandingModel({ trademarkID: obj.trademarkID, landingID: obj.landingID, inUse: false })
                createDataLanding = await dataOfLandingToCreate.save();
                console.log("createDataLanding: ", createDataLanding)
            }
            return createDataLanding ? createDataLanding : ConstantsRS.ERROR_SAVING_RECORD
        } catch (error) {
            console.log(error);
        }
    }

    public async assignMeDataOfLandingsFree(obj: any) {
        try {
            let createDataLanding, landingsCreated = []
            for await (let landingU of obj.selectLandings) {
                const validateLanding = await this.getLandingByIDS(obj.trademarkID, landingU)
                if (!validateLanding) {
                    const dataOfLandingToCreate = new dataLandingModel({ trademarkID: obj.trademarkID, landingID: landingU, inUse: false })
                    createDataLanding = await dataOfLandingToCreate.save();
                    landingsCreated.push(createDataLanding)
                }
            }
            return landingsCreated
        } catch (error) {
            console.log(error);
        }
    }

    public async updateDataOfLandings(obj: any) {
        try {
            let updateLand
            const dataOfLandingsUpdate = await dataLandingModel.findOneAndUpdate({ _id: obj.dataLandingID }, obj, { new: true });
            dataOfLandingsUpdate ? updateLand = dataOfLandingsUpdate : updateLand
            return updateLand

        } catch (error) {
            console.log(error);
        }
    }

    public async getLandingByTrademarkID(id: String) {
        try {
            let getLanding
            const getDataLanding = await dataLandingModel.find({ trademarkID: id, isEnabled: true }).populate('landingID')
            getDataLanding ? getLanding = getDataLanding : getLanding;
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async getLandingByIDS(trademarkID: String, landingID: String) {
        try {
            let getLanding
            const getDataLanding = await dataLandingModel.findOne({ trademarkID: trademarkID, landingID: landingID, isEnabled: true })
            getDataLanding ? getLanding = getDataLanding : getLanding;
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteMyLanding(id: string) {
        try {
            let deleteMyL
            const dataOfLandingsUpdate = await dataLandingModel.findOneAndUpdate({ _id: id }, { isEnabled: false }, { new: true });
            dataOfLandingsUpdate ? deleteMyL = dataOfLandingsUpdate : deleteMyL
            return deleteMyL
        } catch (error) {
            console.log(error);
        }
    }

    public async removeMyLanding(id: string) {
        try {
            let deleteMyL
            const dataOfLandingsRemove = await dataLandingModel.findOneAndDelete({ _id: id }, { new: true });
            dataOfLandingsRemove ? deleteMyL = dataOfLandingsRemove : deleteMyL
            return deleteMyL
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllLandingsMovil(brandId: string) {
        try {
            let rta: any = [], flag = false;
            const getAllLandings = await landingsServices.getAllLandings()
            if (getAllLandings) {
                const getMyLandings = await this.getLandingByTrademarkID(brandId)
                if (getMyLandings) {
                    getAllLandings.forEach((landing: any) => {
                        flag = false
                        getMyLandings.forEach((datalanding: any) => {
                            if (landing.id == datalanding.landingID.id) {
                                rta.push(datalanding)
                                flag = true
                            }
                        });
                        if (flag == false) {
                            rta.push(landing)
                        }
                    });
                } else {
                    rta = getAllLandings
                }
            }
            return rta
        } catch (error) {
            console.log(error);
        }
    }

    public async getDataLandingByLanding(id: String) {
        try {
            const getDataLanding = await dataLandingModel.find({ landingID: id, isEnabled: true })
            return getDataLanding
        } catch (error) {
            console.log(error);
        }
    }
}

export const dataOfLandingsServices = new DataOfLandingsServices();