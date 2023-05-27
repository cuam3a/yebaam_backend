const ProfessionalCommunitiesModel = require("../../models/communitiesprofessionales/ProfessionalCommunities.model");
const ProfessionalCommunityUsersModel = require("../../models/communitiesprofessionales/ProfessionalCommunityUsers.model");
const CategoriesOfCommunitiesProfessionalModel = require("../../models/communitiesprofessionales/CategoriesOfCommunitiesProfessional.model");
const requestProfessionalCommunity = require('../../models/communitiesprofessionales/RequestToTheCommunity.model')
import { ConstantsRS } from "../../utils/constants";
import { categoriesOfCommunitiesProfessionalServices } from './categoriesofcommunitiesprofessional.service';
import { professionalCommunityUsersService } from './professionalcommunityusers.service';
import { requestToTheCommunityService } from './requeststothecommunity.service';
import { awsServiceS3 } from '../aws/aws.services';

let objCommunities = { name: 1, description: 1, CategoriesOfCommunitiesIDS: 1, profilePicture: 1 }

class ProfessionalCommunitiesServices {
    public async getCommunityByID(body: any) {
        // try {
        const { id, professionalId } = body;
        let infoUserOnCommunty, members = null;
        let communityInfo = await ProfessionalCommunitiesModel.findOne({ _id: id })
            .populate([
                {
                    path: "CategoriesOfCommunitiesIDS",
                    model: "CategoriesOfCommunitiesProfessional",
                    select: "name description",
                    match: { isEnabled: true }
                }
            ])

        if (!communityInfo) throw ConstantsRS.NO_COMMUNITIES_FOUND

        if (professionalId) {
            infoUserOnCommunty = await requestToTheCommunityService.getInfoUserOnCommunityByProfessionalId(professionalId, id);
        }

        members = await professionalCommunityUsersService.getMembersCommunity({ communityId: id });

        const foundator = await this.getfoundatorCommunity(id);
        members.push(foundator);

        return { communityInfo, members: members.length, infoUserOnCommunty };

        // } catch (error) {
        // console.log(error);
        // }
    }
    public async getCommunityByName(name: string) {
        try {
            let getCommunity = await ProfessionalCommunitiesModel.findOne({ name: name });
            if (getCommunity) {
                return getCommunity;
            } else {
                return getCommunity = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async createCommunity(obj: any, files: any) {
        // try {
        let createCommunity;
        const getCategoryCommunity = await categoriesOfCommunitiesProfessionalServices.getCategoryByIDAndIsEnable(obj.CategoriesOfCommunitiesIDS);

        if (getCategoryCommunity) {
            let fileSaved
            if (files != undefined) {
                console.log(files)
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.professionalId,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }
            const saveCommunity = new ProfessionalCommunitiesModel(obj);
            saveCommunity.profilePicture = fileSaved
            createCommunity = await saveCommunity.save();
            if (createCommunity) {

                // const saveIDCommunityToManager = new CommunityManagersModel({ professionalId: obj.professionalId, communityId: createCommunity.id });
                // await saveIDCommunityToManager.save();

                await professionalCommunityUsersService.createAdminProfessionalCommunityUser({ allocatorUserId: obj.professionalId, assignedUserId: obj.professionalId, communityId: createCommunity.id });
                return createCommunity;

            } else {
                return createCommunity;
            }
        } else {
            createCommunity = { ...ConstantsRS.THE_RECORD_DOES_NOT_EXIST, field: "CategoriesOfCommunitiesIDS" };
        }
        return createCommunity;

        // } catch (error) {
        //     console.log(error);
        // }
    }
    public async deleteCommunityByID(id: string) {
        try {
            let deleteResponse;
            let getCommunity = await this.getCommunityByID({ id });
            if (getCommunity) {
                await requestProfessionalCommunity.deleteMany({ communityId: id });
                deleteResponse = await ProfessionalCommunitiesModel.deleteOne({ _id: id });
                return deleteResponse;
            } else {
                return deleteResponse;
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async updateCommunity(obj: any, files: any) {
        try {

            let updateCommunity, fileSaved, dataToUpdate: any;
            if (files != undefined) {
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.professionalId,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }
            if (fileSaved) {
                dataToUpdate = {
                    ...obj,
                    profilePicture: fileSaved
                };
            } else {
                dataToUpdate = obj
            }
            await ProfessionalCommunitiesModel.findOne({ _id: obj.id }).then(async (res: any) => {
                if (res) {
                    if (obj.name != undefined) {
                        updateCommunity = await ProfessionalCommunitiesModel.findOneAndUpdate({ _id: obj.landingID }, dataToUpdate, { new: true });
                    } else {
                        const validateName = await this.getCommunityByName(res.name)
                        if (validateName) {
                            updateCommunity = ConstantsRS.THIS_NAME_ALREADY_EXISTS
                        } else {
                            updateCommunity = await ProfessionalCommunitiesModel.findOneAndUpdate({ _id: obj.landingID }, dataToUpdate, { new: true });
                        }
                    }
                }
            })
            return updateCommunity
        } catch (error) {
            console.log(error);
        }
    }

    public async getCommunitiesByCategory(body: any) {
        let { limit, nextSkip, skip, professionalId, categoryId } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }
        const communitiesCat = await ProfessionalCommunitiesModel.find({ CategoriesOfCommunitiesIDS: categoryId, isEnabled: true })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        //communities where i belong
        const communitiesIdIBelong = await requestToTheCommunityService.communitiesIBelong(professionalId);

        let communitiesNotBelong = await this.getCommunitiesNotBelongOther(communitiesIdIBelong, communitiesCat);
        return { communitiesNotBelong, nextSkip };
    }

    public async searchCommunityByNameEnabled(bodySearch: { search: string, limit: number, nextSkip: number, skip: number }) {

        let { limit, nextSkip, skip, search } = bodySearch;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (!search) limit = 5;

        const results = await ProfessionalCommunitiesModel.find({ name: { $regex: `.*${search}`, $options: "i" } })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }

    public async getCommunityByProfessionalId(professionalId: string) {
        const myCommunities = await ProfessionalCommunitiesModel.find({ professionalId: professionalId, isEnabled: true }, objCommunities)
            .populate('CategoriesOfCommunitiesIDS', { name: 1, description: 1 });

        //communities where i belong
        const iBelong = await requestToTheCommunityService.communitiesIBelong(professionalId);

        return { myCommunities, iBelong };
    }

    public async getCommunityByNotProfessionalId(body: any) {

        let { limit, nextSkip, skip, professionalId } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }
        //communities not belong
        const notInCommunities = await ProfessionalCommunitiesModel.find({ professionalId: { $ne: professionalId }, isEnabled: true }, objCommunities)
            .populate('CategoriesOfCommunitiesIDS', { name: 1, description: 1 })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) :
            (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        //communities where i am blocked
        const communitiesIdIamBlocked = await requestToTheCommunityService.communitiesIAmBlocked(professionalId);
        //comparation blocked vs not blocked
        let communitiesNotBelong = await this.getCommunitiesNotBelong(communitiesIdIamBlocked, notInCommunities);


        return { communitiesNotBelong, nextSkip };
    }

    public getCommunitiesNotBelong(communitiesIamBlocked: [any], communitiesNotMine: [any]) {
        return new Promise((resolve, reject) => {

            if (!communitiesIamBlocked.length) resolve(communitiesNotMine);
            let communities = [];

            for (let indexBlocked = 0; indexBlocked < communitiesIamBlocked.length; indexBlocked++) {
                const elementBlocked = communitiesIamBlocked[indexBlocked];

                for (let indexNotMine = 0; indexNotMine < communitiesNotMine.length; indexNotMine++) {
                    const elementNotMine = communitiesNotMine[indexNotMine];

                    if (elementBlocked.communityId._id.toString() !== elementNotMine._id.toString()) {
                        communities.push(elementNotMine)
                    }
                }

            }
            resolve(communities);
        });
    }

    public async getCommunitiesNotBelongOther(communitiesIdIBelong:any,communitiesCat:any,){
        let communities:any = [];
        if (!communitiesIdIBelong.length) {
            communities = communitiesCat
        }else{
            for await(let communityBelong of communitiesIdIBelong){
                for await(let communityCat of communitiesCat){
                    if (communityCat.id !== communityBelong.id) {
                        communities.push(communityCat)
                    }
                }
            }
        }
        return communities
    }

    public async searchCommunityByNameAndCategoryEnabled(bodySearch: any) {

        let { limit, nextSkip, skip, search } = bodySearch;
        let results

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (!search) limit = 5;

        if (bodySearch.categoryID != undefined) {
            results = await ProfessionalCommunitiesModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } },
                { CategoriesOfCommunitiesIDS: bodySearch.categoryID },
                { isEnabled: true }]
            })
                .limit(limit).skip(skip);
        } else {
            const resultsCommunities = await ProfessionalCommunitiesModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } }, { isEnabled: true }]
            })
                .limit(limit).skip(skip);

            const resultsCategories = await CategoriesOfCommunitiesProfessionalModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } }, { isEnabled: true }]
            })
                .limit(limit).skip(skip);

            results = {
                communities: resultsCommunities,
                categories: resultsCategories
            }
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }

    public async getfoundatorCommunity(communityId: string) {
        return await ProfessionalCommunitiesModel.findOne({ _id: communityId }, { professionalId: 1 })
            .populate('professionalId', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });
    }

    public async getInformationVisitor(body:any){
        try {
            let getUser, visitor, members, request, members2
            //info of the community
            const getCommunty = await ProfessionalCommunitiesModel.findOne({ _id: body.communityId})
            .populate([
                {
                    path: "CategoriesOfCommunitiesIDS",
                    model: "CategoriesOfCommunitiesProfessional",
                    select: "name description",
                    match: { isEnabled: true }
                }
            ])

            //members on community
            members = await professionalCommunityUsersService.getMembersCommunity({ communityId: body.communityId });

            //rol of user in community
            if (getCommunty.professionalId == body.professionalId) {
                const memberComplete = await ProfessionalCommunityUsersModel.findOne({
                    $and: [{ communityId: body.communityId }, { allocatorUserId: body.professionalId },{assignedUserId:body.professionalId}]
                })
                    .populate('allocatorUserId', {birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
                    .populate([
                        {
                            path: 'roleCommunityId',
                            model: 'UserRolesInTheCommunity',
                            select: 'code permissions name description',
                            populate: {
                                path: 'permissions',
                                model: 'CommunitymanagerPermissions',
                            }
                        }
                    ])
                if (memberComplete) visitor = memberComplete 
                else visitor = 'User Not in community'
            } else {
                getUser = await requestToTheCommunityService.getByProfessionalsIdAndCommunityIdAccepted(body);
    
                if (getUser) {
                    const memberComplete = await ProfessionalCommunityUsersModel.findOne({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.professionalId }]
                    })
                        .populate('assignedUserId', {birthday:1, email:1,profilePicture:1,name:1,_id:1,score:1,gender:1,phone:1,alias:1,relationshipStatus:1})
                        .populate([
                            {
                                path: 'roleCommunityId',
                                model: 'UserRolesInTheCommunity',
                                select: 'code permissions name description',
                                populate: {
                                    path: 'permissions',
                                    model: 'CommunitymanagerPermissions',
                                }
                            }
                        ])
                    if (memberComplete) visitor = memberComplete 
                    else visitor = 'User Not in community'
                }else{
                    visitor = 'User Not in community'
                }
            }

            request = await requestToTheCommunityService.getByProfessionalsIdAndCommunityId(body)

            members ? members2 = members.length + 1 : members2 = 1

            return {community: getCommunty, members: members2, rolInCommunity: visitor, request:request};

        } catch (error) {
            console.log(error);            
        }
    }

    public async getCommunityByIDNotify(communityId: any) {
        try {
            let communityInfo = await ProfessionalCommunitiesModel.findOne({ 
                $and:[{_id: communityId },{isEnabled:true}]}).populate('professionalId')
            return communityInfo
        } catch (error) {
         console.log(error);
        }
    }

    public async getCommunitiesByCategoryId(body: any) {
        const communitiesCat = await ProfessionalCommunitiesModel.find({
             $and:[{CategoriesOfCommunitiesIDS: body.categoryId}, {isEnabled: true}]
            })
        return communitiesCat;
    }
}

export const professionalCommunitiesServices = new ProfessionalCommunitiesServices();