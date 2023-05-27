const classifiedsModel = require("../../models/classifieds/Classifieds.model");
import { classifiedSubcategoriesServices } from "./classifiedsubcategories.services";
import { classifiedStatusServices } from "./classifiedstatus.services";
import { contentSavedServices } from "../savedcontents/savedcontents.service";
import { sellersRatingServices } from "../sellersrating/sellersrating.service";
import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../aws/aws.services';
import axios from 'axios';
import { GlobalConstants } from "../../config/GlobalConstants";
const savedContentsModel = require('../../models/savedcontents/SavedContents.model');
import { similarServices } from "../similarservices/similar.services";
const sellersRatingModel = require('../../models/sellersrating/SellersRating.model');
import { vendorBlockingServices } from "../vendorblocking/vendorblocking.service";
const classifiedSubcategoriesModel = require('../../models/classifieds/ClassifiedsSubcategories.model');
const classifiedStatusModel = require('../../models/classifieds/ClassifiedsStatus.model');

class ClassifiedServices {
    public async createClassified(body: any, files: any) {
        let rta, rtaError, infoFileUrl: any = [], pictures = files.files
        const entityId = body.userID

        const subcategoryExist = await classifiedSubcategoriesServices.getSubcategoryClassifiedByID(body.subcategoryID);
        if (!subcategoryExist.code) {
            if (pictures != undefined) {
                if (pictures.length) {
                    const file = pictures;
                    let filesUplaoded = 0;

                    for await (let fileOne of file) {
                        if (fileOne.mimetype.indexOf('image') >= 0) {
                            const dataToSave = { entityId, file: fileOne };
                            const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                            infoFileUrl.push(fileSaved);
                            filesUplaoded += 1;
                        }
                    }
                } else {
                    if (pictures.mimetype.indexOf('image') >= 0) {
                        infoFileUrl.push(await awsServiceS3.UploadFile({ entityId, file: pictures }))
                    }
                }
            }

            const firstStatus = await classifiedStatusServices.getFirstStatus();
            if (!firstStatus.code) {
                await classifiedStatusModel.updateOne({ _id: firstStatus._id }, { inUse: true })
                body.classifedsStatusID = firstStatus._id
            }

            body.categoryID = subcategoryExist.categoryID
            const saveClassified = new classifiedsModel({ ...body, multimedia: infoFileUrl });
            const createClassified = await saveClassified.save();
            if (createClassified) {
                await classifiedSubcategoriesModel.updateOne({ _id: subcategoryExist.id }, { inUse: true })
                rta = createClassified
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            return ConstantsRS.MUST_ASSOCIATE_SUBCATEGORIE;
        }

        return rta ? rta : rtaError
    }

    public async updateClassifiedByID(body: any, files: any) {
        let rta, rtaError, infoFileUrl: any = []

        let classifiedExist = await this.getClassifiedByID(body.id);

        if (classifiedExist) {
            const entityId = classifiedExist.userID.id

            if (files != undefined) {
                let pictures = files.files
                if (pictures != undefined) {
                    if (pictures.length) {
                        const file = pictures;

                        for await (let fileOne of file) {
                            if (fileOne.mimetype.indexOf('image') >= 0) {
                                const dataToSave = { entityId, file: fileOne };
                                const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                                infoFileUrl.push(fileSaved);
                            }
                        }
                        body.multimedia = body.multimedia.concat(infoFileUrl)
                    } else {
                        if (pictures.mimetype.indexOf('image') >= 0) {
                            infoFileUrl.push(await awsServiceS3.UploadFile({ entityId, file: pictures }))
                        }
                        body.multimedia = body.multimedia.concat(infoFileUrl)
                    }
                }
            }

            if (body.subcategoryID != undefined) {
                const subcategoryExist = await classifiedSubcategoriesServices.getSubcategoryClassifiedByID(body.subcategoryID);
                if (!subcategoryExist.code) {
                    await classifiedSubcategoriesModel.updateOne({ _id: subcategoryExist.id }, { inUse: true })
                    body.categoryID = subcategoryExist.categoryID
                }
            }

            if (body.classifedsStatusID != undefined) {
                const statusExist = await classifiedStatusServices.getClassifiedStatusByID(body.classifedsStatusID);
                if (!statusExist.code) {
                    await classifiedStatusModel.updateOne({ _id: statusExist._id }, { inUse: true })
                    body.classifedsStatusID = statusExist._id
                }
            }

            const classifiedToUpdate = await classifiedsModel.findOneAndUpdate({ _id: body.id }, body, { new: true });
            if (classifiedToUpdate) {
                rta = classifiedToUpdate
            } else {
                rtaError = ConstantsRS.ERROR_UPDATING_RECORD
            }
        } else {
            rtaError = ConstantsRS.ERROR_UPDATING_RECORD
        }

        return rta ? rta : rtaError
    }

    public async getClassifiedByID(id: string, visitorID: string = "") {
        let rta, rtaError

        let classified = await classifiedsModel.findOne({
            $and: [{ _id: id }, { isEnabled: true }]
        })
            .populate([
                {
                    path: 'userID',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                },
                {
                    path: 'classifedsStatusID',
                    model: 'ClassifiedsStatus',
                },
                {
                    path: 'categoryID',
                    model: 'ClassifiedCatregories',
                },
                {
                    path: 'subcategoryID',
                    model: 'ClassifiedSubcategories',
                },
                {
                    path: 'countryID',
                    model: 'Countries',
                },
                {
                    path: 'stateID',
                    model: 'States',
                },
                {
                    path: 'cityID',
                    model: 'Cities',
                }
            ])

        if (classified) {
            if (visitorID != "") {
                // Si el usuario ha guardado el clasificado
                let contentSavedExist = await savedContentsModel.findOne({
                    $and: [
                        { classifiedID: classified.id },
                        { userID: visitorID }
                    ]
                })
                if (contentSavedExist) {
                    classified.iSaveIt = true
                }

                // Si el usuario ha calificado al vendedor
                const sellerRatingExist = await sellersRatingModel.findOne({
                    $and: [{ sellerID: classified.userID }, { qualifierID: visitorID }]
                });
                if (sellerRatingExist) {
                    classified.mySellerRating = {
                        userID: sellerRatingExist.qualifierID,
                        value: sellerRatingExist.value
                    }
                }
            }

            rta = classified;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        return rta ? rta : rtaError
    }

    public async deleteClassifiedByID(id: string) {
        let rta, rtaError

        const classifiedToUpdate = await classifiedsModel.findOneAndUpdate({ _id: id }, { isEnabled: false }, { new: true });
        if (classifiedToUpdate) {
            rta = "Clasificado eliminado correctamente"
        } else {
            rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
        }

        return rta ? rta : rtaError
    }

    public async getMxStates() {
        const url = `${GlobalConstants.URL_BASE_API_MX}/get_estados`;

        try {
            console.log("creating request")
            const request = await axios.post(url, null, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias                
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `${GlobalConstants.ACCESS_TOKEN_MERCADO}`
                }
            });

            // console.log("R: ", request)
            return request.data;
        } catch (e) {
            console.log(e, "error");
            return e;
        }
    }

    public async getMxMunicipalitiesByState(state: String) {
        const url = `${GlobalConstants.URL_BASE_API_MX}/get_municipio_por_estado/${state}`;

        try {
            console.log("creating request")
            const request = await axios.post(url, null, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias                
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `${GlobalConstants.ACCESS_TOKEN_MERCADO}`
                }
            });

            // console.log("R: ", request)
            return request.data;
        } catch (e) {
            console.log(e, "error");
            return e;
        }
    }

    public async getCoDepartmentsNCities() {
        const url = `${GlobalConstants.URL_BASE_API_CO}`;

        try {
            console.log("creating request")
            const request = await axios.get(url, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias                
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `${GlobalConstants.ACCESS_TOKEN_MERCADO}`
                }
            });

            // console.log("R: ", request)
            return request.data;
        } catch (e) {
            console.log(e, "error");
            return e;
        }
    }

    public async getAllClassifieds(body: any) {
        let rta, rtaError
        let { limit, nextSkip, skip } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        let classifieds = await classifiedsModel.find({ isEnabled: true })
            .populate([
                {
                    path: 'userID',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                },
                {
                    path: 'classifedsStatusID',
                    model: 'ClassifiedsStatus',
                },
                {
                    path: 'categoryID',
                    model: 'ClassifiedCatregories',
                },
                {
                    path: 'subcategoryID',
                    model: 'ClassifiedSubcategories',
                },
                {
                    path: 'countryID',
                    model: 'Countries',
                },
                {
                    path: 'stateID',
                    model: 'States',
                },
                {
                    path: 'cityID',
                    model: 'Cities',
                }
            ]).limit(limit).skip(skip);

        if (classifieds) {
            rta = classifieds;
        } else {
            rtaError = ConstantsRS.NO_RECORDS;
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        let response = rta ? rta : rtaError
        return { response, nextSkip };
    }

    public async deletePictureByID(body: any) {
        let rta, rtaError

        const classifiedExist = await classifiedsModel.findOne({
            $and: [{ _id: body.classifiedID }, { isEnabled: true }]
        });

        if (classifiedExist) {
            let newImages = classifiedExist.multimedia.filter((image: any) => image._id != body.imageID)
            if (classifiedExist.multimedia.length > newImages.length) {
                if (classifiedExist.multimedia.length > 1) {
                    const classifiedToUpdate = await classifiedsModel.findOneAndUpdate({ _id: body.classifiedID }, { multimedia: newImages }, { new: true });
                    if (classifiedToUpdate) {
                        rta = classifiedToUpdate
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.CLASSIFIED_MUST_CONTAIN_AN_IMAGE
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getClassifiedsByCriteria(body: any) {
        let rta, rtaError, classifieds, conditionals, vendorsBlocked: any = []
        let { limit, nextSkip, skip } = body;
        let categoryID = body.categoryID ? body.categoryID : null
        let subcategoryID = body.subcategoryID ? body.subcategoryID : null
        let countryID = body.countryID ? body.countryID : null
        let stateID = body.stateID ? body.stateID : null
        let cityID = body.cityID ? body.cityID : null

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        const locks = await vendorBlockingServices.getLocksByBlockerID(body.visitorID)
        if (!locks.code) {
            if (locks.length > 0) {
                for (let i = 0; i < locks.length; i++) {
                    const lock = locks[i]
                    vendorsBlocked.push(lock.sellerID)
                }
            }
        }

        if (categoryID != null && subcategoryID == null && countryID == null && stateID == null && cityID == null) { // Categoría
            conditionals = [{ categoryID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID != null && countryID == null && stateID == null && cityID == null) { // Categoría y subcategoría
            conditionals = [{ categoryID }, { subcategoryID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID != null && countryID != null && stateID == null && cityID == null) { // Categoría, subcategoría y país
            conditionals = [{ categoryID }, { subcategoryID }, { countryID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID != null && countryID != null && stateID != null && cityID == null) { // Categoría, subcategoría, país y estado
            conditionals = [{ categoryID }, { subcategoryID }, { countryID }, { stateID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID != null && countryID != null && stateID != null && cityID != null) { // Categoría, subcategoría, país, estado y ciudad
            conditionals = [{ categoryID }, { subcategoryID }, { countryID }, { stateID }, { cityID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID == null && countryID != null && stateID == null && cityID == null) { // Categoría y país
            conditionals = [{ categoryID }, { countryID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID == null && countryID != null && stateID != null && cityID == null) { // Categoría, país y estado
            conditionals = [{ categoryID }, { countryID }, { stateID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID != null && subcategoryID == null && countryID != null && stateID != null && cityID != null) { // Categoría, país, estado y ciudad
            conditionals = [{ categoryID }, { countryID }, { stateID }, { cityID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID == null && subcategoryID == null && countryID != null && stateID == null && cityID == null) { // País
            conditionals = [{ countryID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID == null && subcategoryID == null && countryID != null && stateID != null && cityID == null) { // País y estado
            conditionals = [{ countryID }, { stateID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        } else if (categoryID == null && subcategoryID == null && countryID != null && stateID != null && cityID != null) { // País, estado y ciudad
            conditionals = [{ countryID }, { stateID }, { cityID }, { userID: { $ne: body.visitorID } }, { userID: { $nin: [vendorsBlocked] } }, { multimedia: { $ne: [] } }, { isEnabled: true }]
        }

        if (conditionals != undefined) {
            classifieds = await classifiedsModel.find({
                $and: conditionals
            }).populate([
                {
                    path: 'userID',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                },
                {
                    path: 'classifedsStatusID',
                    model: 'ClassifiedsStatus',
                },
                {
                    path: 'categoryID',
                    model: 'ClassifiedCatregories',
                },
                {
                    path: 'subcategoryID',
                    model: 'ClassifiedSubcategories',
                },
                {
                    path: 'countryID',
                    model: 'Countries',
                },
                {
                    path: 'stateID',
                    model: 'States',
                },
                {
                    path: 'cityID',
                    model: 'Cities',
                }
            ]).sort({ creationDate: -1 })
                .limit(limit).skip(skip);
        } else {
            classifieds = await classifiedsModel.find({
                $and: [
                    { userID: { $ne: body.visitorID } },
                    { userID: { $nin: [vendorsBlocked] } },
                    { isEnabled: true },
                    { multimedia: { $ne: [] } }
                ]
            })
                .populate([
                    {
                        path: 'userID',
                        model: 'Users',
                        populate: {
                            path: 'rankID',
                            model: 'Ranks',
                        }
                    },
                    {
                        path: 'classifedsStatusID',
                        model: 'ClassifiedsStatus',
                    },
                    {
                        path: 'categoryID',
                        model: 'ClassifiedCatregories',
                    },
                    {
                        path: 'subcategoryID',
                        model: 'ClassifiedSubcategories',
                    },
                    {
                        path: 'countryID',
                        model: 'Countries',
                    },
                    {
                        path: 'stateID',
                        model: 'States',
                    },
                    {
                        path: 'cityID',
                        model: 'Cities',
                    }
                ]).sort({ creationDate: -1 })
                .limit(limit).skip(skip);
        }

        if (classifieds) {
            for (let i = 0; i < classifieds.length; i++) {
                // Si el usuario ha guardado el clasificado
                const classified = classifieds[i];
                let contentSavedExist = await savedContentsModel.findOne({
                    $and: [
                        { classifiedID: classified.id },
                        { userID: body.visitorID }
                    ]
                })
                if (contentSavedExist) {
                    classified.iSaveIt = true
                }

                // Si el usuario ha calificado al vendedor
                const sellerRatingExist = await sellersRatingModel.findOne({
                    $and: [{ sellerID: classified.userID }, { qualifierID: body.visitorID }]
                });
                if (sellerRatingExist) {
                    classified.mySellerRating = {
                        userID: sellerRatingExist.qualifierID,
                        value: sellerRatingExist.value
                    }
                }
            }

            rta = classifieds;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        let response = rta ? rta : rtaError
        return { response, nextSkip };
    }

    public async getClassifiedsByUserID(body: any) {
        let rta, rtaError

        let classifieds = await classifiedsModel.find({
            $and: [{ userID: body.userID }, { isEnabled: true }]
        })
            .populate([
                {
                    path: 'userID',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                },
                {
                    path: 'classifedsStatusID',
                    model: 'ClassifiedsStatus',
                },
                {
                    path: 'categoryID',
                    model: 'ClassifiedCatregories',
                },
                {
                    path: 'subcategoryID',
                    model: 'ClassifiedSubcategories',
                },
                {
                    path: 'countryID',
                    model: 'Countries',
                },
                {
                    path: 'stateID',
                    model: 'States',
                },
                {
                    path: 'cityID',
                    model: 'Cities',
                }
            ])
        if (classifieds) {
            rta = classifieds;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        return rta ? rta : rtaError
    }
}

export const classifiedServices = new ClassifiedServices();