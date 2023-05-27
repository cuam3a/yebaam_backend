import { postSevices } from '../post/post.services';
// import { uploadMedia } from '../../controllers/utils/functions/uploadFiles';
import { awsServiceS3 } from '../../services/aws/aws.services';
import { dataOfLandingsServices } from '../landings/dataOfLandings.services';
const trademarksModel = require('../../models/trademarks/Trademarks.model');
const typeOfBrandModel = require('../../models/typeofmarks/TypeOfMarks.model');
const bcrypt = require('bcrypt');
import { socialServices } from '../social/social.services';
import { userSettingsServices } from '../usersettings/usersettings.service';
const seedrandom = require('seedrandom');

class TrademarksServices {
    public async createBrandDataBasic(obj: any, files: any) {
        try {
            let fileSaved, brandUpdate, landingUseDefault
            if (files != undefined) {
                console.log(files)
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.id,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                    console.log(fileSaved);

                }
            }
            const trademark = await trademarksModel.findOne({ email: obj.email }).exec();
            /* var str = trademark.id; 
            var res = str.replace(/[a-z]/g, ''); */
            let rng = new seedrandom();
            const code = (rng()).toString().substring(3, 10);
            let res = Number(code)
            let numericIdentifier = res
            let bodySettings = { entityId: trademark.id }
            const getUserSettings = await userSettingsServices.getUserSettingsByEntityId({ entityId: trademark.id })
            if (!getUserSettings) {
                await userSettingsServices.createUserSettings(bodySettings)
            }
            obj.profilePicture && obj.profilePicture != undefined ? fileSaved = obj.profilePicture : fileSaved
            if (trademark) {
                /* const landingDefault = await dataOfLandingsServices.assignDataOfLandingDefault(trademark.id)
                if (landingDefault) {
                    landingUseDefault = landingDefault.id
                } */
                brandUpdate = await trademarksModel.findOneAndUpdate({ _id: trademark.id }, {
                    profilePicture: fileSaved,
                    name: obj.name,
                    nitOrCedule: obj.nitOrCedule,
                    description: obj.description,
                    codeEconomicActivity: obj.codeEconomicActivity,
                    nameEconomicActivity: obj.nameEconomicActivity,
                    typetypeOfMarkID: obj.typetypeOfMarkID,
                    typeOfProfile: obj.typeOfProfile,
                    currentLanding: null,
                    numericIdentifier: numericIdentifier
                }, { new: true })

                if (obj.typetypeOfMarkID != undefined && brandUpdate) {
                    await typeOfBrandModel.updateOne({ _id: obj.typetypeOfMarkID }, { inUse: true })
                }

                if (fileSaved) {
                    fileSaved._doc['width'] = 1
                    fileSaved._doc['height'] = 1
                    const postToSave = {
                        trademarkID: trademark.id,
                        imgAndOrVideosGif: [fileSaved],
                        albumsIDS: [],
                        privacy: 1,
                        typeCat: 2
                    }
                    await postSevices.createPost(postToSave)
                }
            }
            return brandUpdate
        } catch (error) {
            console.log(error);

        }
    }

    public async updateBrandDataBasic(obj: any, files: any) {
        try {
            let fileSaved:any, dataToUpdate;
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
            if (obj.password && fileSaved) {
                dataToUpdate = {
                    ...obj, password: bcrypt.hashSync(obj.password, 10),
                    profilePicture: fileSaved,
                    verification_code: {}
                };
            } else if (obj.password) {
                dataToUpdate = {
                    ...obj, password: bcrypt.hashSync(obj.password, 10),
                    verification_code: {}
                };
            } else if (fileSaved) {
                dataToUpdate = {
                    ...obj,
                    profilePicture: fileSaved,
                    verification_code: {}
                };
            } else {
                dataToUpdate = obj
            }
            const trademarkUpdate = await trademarksModel.findOneAndUpdate({ _id: obj.id }, dataToUpdate, { new: true })
                .populate('typeOfMarkID')
                .populate({
                    path: 'currentLanding',
                    model: 'DataOfLandings',
                    populate: {
                        path: 'landingID',
                        model: 'Landings',
                    }
                })

            if (obj.typetypeOfMarkID != undefined && trademarkUpdate) {
                await typeOfBrandModel.updateOne({ _id: obj.typetypeOfMarkID }, { inUse: true })
            }

            if (fileSaved) {
                fileSaved._doc['width'] = 1
                fileSaved._doc['height'] = 1
                const postToSave = {
                    trademarkID: obj.id,
                    imgAndOrVideosGif: [fileSaved],
                    albumsIDS: [],
                    privacy: 1,
                    typeCat: 2
                }
                await postSevices.createPost(postToSave)
            }
            return trademarkUpdate

        } catch (error) {
            console.log(error);
        }
    }

    public async getAllBrands() {
        try {
            let getAllBrands
            const getAll = await trademarksModel.find({ isEnabled: true })
            getAll ? getAllBrands = getAll : getAllBrands
            return getAllBrands
        } catch (error) {
            console.log(error);
        }
    }

    public async getBrandByID(id: String) {
        try {
            let getBrand
            const getB = await trademarksModel.findOne({ _id: id, isEnabled: true }).populate('currentLanding')
            getB ? getBrand = getB : getBrand
            return getBrand
        } catch (error) {
            console.log(error);
        }
    }

    public async updateBrandDataBasicLanding(obj: any) {
        try {
            const trademarkUpdate = await trademarksModel.findOneAndUpdate({ _id: obj.id }, { currentLanding: obj.dataLandingID }, { new: true });
            return trademarkUpdate

        } catch (error) {
            console.log(error);
        }
    }

    public async actionsWhenDeletingBrand(trademarkID: any) {
        let socialConections = await socialServices.getSocialConnectionsByEntityID(trademarkID)
        if (!socialConections.code) {
            await socialServices.disableSocialConnections(socialConections)
        }
    }

    public async actionsWhenRestoreBrand(trademarkID: any) {
        let socialConections = await socialServices.getSocialConnectionsByEntityID(trademarkID)
        if (!socialConections.code) {
            await socialServices.enableSocialConnections(socialConections)
        }
    }
}

export const trademarksServices = new TrademarksServices()