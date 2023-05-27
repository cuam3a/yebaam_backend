import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../aws/aws.services';
import { dataOfLandingsServices } from './dataOfLandings.services';
const landingModel = require('../../models/landings/Landings.model')
const dataLandingModel = require('../../models/landings/DataOfLandings.model')
var _ = require("lodash");

class LandingsServices {
    public async createLanding(obj: any, files:any) {
        try {
            let createLanding, fileSaved
            if (files != undefined) {
                console.log(files)
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.id,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }
            const landingToCreate = new landingModel(obj)
            landingToCreate.preview = fileSaved
            const validateName = await this.getLandingByName(obj.name)
            if (validateName) {
                createLanding = ConstantsRS.THIS_NAME_ALREADY_EXISTS
            } else {
                createLanding = await landingToCreate.save();
            }
            return createLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllLandings() {
        try {
            let getAllLandings
            const getAll = await landingModel.find({ isEnabled: true })
            getAll ? getAllLandings = getAll : getAllLandings
            return getAllLandings
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllLandingsMovil(body:any) {
        try {
            let getAllLandings: any = []
            const getAll = await landingModel.find({ isEnabled: true })
            const getAllMylandings = await dataOfLandingsServices.getLandingByTrademarkID(body.brandId)
            if (getAllMylandings.length > 0) {       
                for (var i = 0; i < getAll.length; i++) {
                    var igual=false;
                     for (var j = 0; j < getAllMylandings.length && !igual; j++) {
                         if(getAll[i]['id'] == getAllMylandings[j]['landingID']['id']) 
                                 igual=true;
                     }
                    if(!igual)getAllLandings.push(getAll[i]);
                }
            }else{
                getAllLandings = getAll
            }
            return getAllLandings
        } catch (error) {
            console.log(error);
        }
    }

    public async getLandingByID(id: String) {
        try {
            let getLanding
            const getLa = await landingModel.findOne({ _id: id, isEnabled: true })
            getLa ? getLanding = getLa : getLanding
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async getLandingByName(name: String) {
        try {
            let getLanding
            const getLa = await landingModel.findOne({ name: name })
            getLa ? getLanding = getLa : getLanding
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async getLandingDefault() {
        try {
            let getLanding
            const getLa = await landingModel.findOne({ isDefault: true })
            getLa ? getLanding = getLa : getLanding
            return getLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async updateLanding(obj: any, files:any) {
        try {
            let updateLanding, fileSaved, dataToUpdate:any;
            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.id,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }
            if (fileSaved) {
                dataToUpdate = {
                    ...obj,
                    preview: fileSaved
                };
            } else {
                dataToUpdate = obj
            }
            await landingModel.findOne({ _id: obj.landingID }).then(async (res: any) => {
                if (res) {
                    if (obj.name != undefined) {
                        updateLanding = await landingModel.findOneAndUpdate({ _id: obj.landingID }, dataToUpdate, { new: true });
                    } else {
                        const validateName = await this.getLandingByName(res.name)
                        if (validateName) {
                            updateLanding = ConstantsRS.THIS_NAME_ALREADY_EXISTS
                        } else {
                            updateLanding = await landingModel.findOneAndUpdate({ _id: obj.landingID }, dataToUpdate, { new: true });
                        }
                    }
                }
            })
            return updateLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteLanding(id: String) {
        try {
            let deleteLanding
            const uselanding = await dataOfLandingsServices.getDataLandingByLanding(id)
            if (!uselanding) {
                deleteLanding = await landingModel.findOneAndDelete({ _id: id }, { isEnabled: false }, { new: true });
            } else {
                deleteLanding = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
            return deleteLanding
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteLandingAdmin(id: String) {
        try {
            let deleteLanding
            await dataLandingModel.deleteMany({ landingID: id });
            const deleteL = await landingModel.deleteOne({ _id: id });
            deleteL ? deleteLanding = deleteL : deleteLanding
            return deleteLanding
        } catch (error) {
            console.log(error);
        }
    }
}

export const landingsServices = new LandingsServices();