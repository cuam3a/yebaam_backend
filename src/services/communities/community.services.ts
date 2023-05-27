const CommunitiesModel = require("../../models/communities/Communities.model");
const CommunityManagerModel = require("../../models/communities/CommunityManagers.model");
const categoriesOfCommunitiesModel = require("../../models/communities/CategoriesOfCommunities.model");
const userRequestCommunityModel = require('../../models/communities/userRequestToCommunity.model')
import { ConstantsRS } from "../../utils/constants";
import { categoriesCommunityServices } from "../communities/categoriescommunity.services";
import { communityManagerService } from "./communityManager.service";
import { userRequestCommunityService } from "./userRequestCommunity.service";
import { awsServiceS3 } from '../aws/aws.services';

let objCommunities = { name: 1, description: 1, CategoriesOfCommunitiesIDS: 1, profilePicture: 1 }

class CommunitiesServices {
    public async getCommunityByID(body: any) {
        // try {
        const { id, userId } = body;
        let infoUserOnCommunty, members = null;
        let communityInfo = await CommunitiesModel.findOne({ _id: id })
            .populate([
                {
                    path: "CategoriesOfCommunitiesIDS",
                    model: "CategoriesOfCommunities",
                    select: "name description",
                    match: { isEnabled: true }
                }
            ])

        if (!communityInfo) throw ConstantsRS.NO_COMMUNITIES_FOUND

        if (userId) {
            infoUserOnCommunty = await userRequestCommunityService.getInfoUserOnCommunityByUserId(userId, id);
        }

        members = await communityManagerService.getMembersCommunity({ communityId: id });

        const foundator = await this.getfoundatorCommunity(id);
        members.push(foundator);

        return { communityInfo, members: members.length, infoUserOnCommunty };

        // } catch (error) {
        // console.log(error);
        // }
    }

    public async getCommunityByName(name: string) {
        try {
            let getCommunity = await CommunitiesModel.findOne({ name: name });
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
        const getCategoryCommunity = await categoriesCommunityServices.getCategoryByIDAndIsEnable(obj.CategoriesOfCommunitiesIDS);

        if (getCategoryCommunity) {
            let fileSaved
            if (files != undefined) {
                console.log(files)
                if (files.files) {
                    const file = files.files;
                    const objSaveFile = {
                        entityId: obj.userID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveFile);
                }
            }
            const saveCommunity = new CommunitiesModel(obj);
            saveCommunity.profilePicture = fileSaved
            createCommunity = await saveCommunity.save();
            if (createCommunity) {

                // const saveIDCommunityToManager = new CommunityManagersModel({ userId: obj.userID, communityId: createCommunity.id });
                // await saveIDCommunityToManager.save();

                await communityManagerService.createAdminManager({ allocatorUserId: obj.userID, assignedUserId: obj.userID, communityId: createCommunity.id });
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
                await userRequestCommunityModel.deleteMany({ communityId: id });
                deleteResponse = await CommunitiesModel.deleteOne({ _id: id });
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
                        entityId: obj.userID,
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
            await CommunitiesModel.findOne({ _id: obj.id }).then(async (res: any) => {
                if (res) {
                    if (obj.name != undefined) {
                        updateCommunity = await CommunitiesModel.findOneAndUpdate({ _id: obj.id }, dataToUpdate, { new: true });
                    } else {
                        const validateName = await this.getCommunityByName(res.name)
                        if (validateName) {
                            updateCommunity = ConstantsRS.THIS_NAME_ALREADY_EXISTS
                        } else {
                            updateCommunity = await CommunitiesModel.findOneAndUpdate({ _id: obj.id }, dataToUpdate, { new: true });
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
        let { limit, nextSkip, skip, userId, categoryId } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }
        const communitiesCat = await CommunitiesModel.find({ CategoriesOfCommunitiesIDS: categoryId, isEnabled: true })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        //communities where i belong
        const communitiesIdIBelong = await userRequestCommunityService.communitiesIBelong(userId);

        let communitiesNotBelong = await this.getCommunitiesNotBelongOther(communitiesIdIBelong, communitiesCat);
        return { communitiesNotBelong, nextSkip };
    }

    public async searchCommunityByNameEnabled(bodySearch: { search: string, limit: number, nextSkip: number, skip: number }) {

        let { limit, nextSkip, skip, search } = bodySearch;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (!search) limit = 5;

        const results = await CommunitiesModel.find({ name: { $regex: `.*${search}`, $options: "i" } })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }

    public async getCommunityByUserId(userId: string) {
        const myCommunities = await CommunitiesModel.find({ userID: userId, isEnabled: true }, objCommunities)
            .populate('CategoriesOfCommunitiesIDS', { name: 1, description: 1 });

        //communities where i belong
        const iBelong = await userRequestCommunityService.communitiesIBelong(userId);

        return { myCommunities, iBelong };
    }

    public async getCommunityByNotUserId(body: any) {

        let { limit, nextSkip, skip, userId } = body;

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }
        //communities not belong
        const notInCommunities = await CommunitiesModel.find({ userID: { $ne: userId }, isEnabled: true }, objCommunities)
            .populate('CategoriesOfCommunitiesIDS', { name: 1, description: 1 })
            .limit(limit).skip(skip);

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) :
            (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        //communities where i am blocked
        const communitiesIdIamBlocked = await userRequestCommunityService.communitiesIAmBlocked(userId);
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

    public async getCommunitiesNotBelongOther(communitiesIdIBelong: any, communitiesCat: any,) {
        let communities: any = [];
        if (!communitiesIdIBelong.length) {
            communities = communitiesCat
        } else {
            for await (let communityBelong of communitiesIdIBelong) {
                for await (let communityCat of communitiesCat) {
                    if (communityCat.id !== communityBelong.id) {
                        communities.push(communityCat)
                    }
                }
            }
        }
        return communities
    }

    public async searchCommunityByNameAndCategoryEnabled(body: any) {

        let { limit, nextSkip, skip, search } = body;
        let results

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        if (!search) limit = 5;

        if (body.categoryID != undefined) {
            results = await CommunitiesModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } },
                { CategoriesOfCommunitiesIDS: body.categoryID },
                { isEnabled: true }]
            })
                .populate({
                    path: "reportID",
                    model: "CommunityReports",
                    match: { isEnabled: true }
                })
                .limit(limit).skip(skip);

            if (body.visitorID != undefined && results.length > 0) {
                results = await this.setReports(body, results)
            }
        } else {
            let resultsCommunities = await CommunitiesModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } }, { isEnabled: true }]
            })
                .populate({
                    path: "reportID",
                    model: "CommunityReports",
                    match: { isEnabled: true }
                })
                .limit(limit).skip(skip);

            const resultsCategories = await categoriesOfCommunitiesModel.find({
                $and: [{ name: { $regex: `.*${search}`, $options: "i" } }, { isEnabled: true }]
            })
                .limit(limit).skip(skip);

            if (body.visitorID != undefined && resultsCommunities.length > 0) {
                resultsCommunities = await this.setReports(body, resultsCommunities)
            }

            results = {
                communities: resultsCommunities,
                categories: resultsCategories
            }
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return { results, nextSkip };
    }

    public async getfoundatorCommunity(communityId: string) {
        return await CommunitiesModel.findOne({ _id: communityId }, { userID: 1 })
            .populate('userID', {
                name: 1, birthday: 1, email: 1, profilePicture: 1, roleInTheCommunityID: 1, alias: 1
            });
    }

    public async getInformationVisitor(body: any) {
        try {
            let getUser, visitor, members, request, members2
            //info of the community
            const getCommunty = await CommunitiesModel.findOne({ _id: body.communityId })
                .populate([
                    {
                        path: "CategoriesOfCommunitiesIDS",
                        model: "CategoriesOfCommunities",
                        select: "name description",
                        match: { isEnabled: true }
                    },
                    {
                        path: "reportID",
                        model: "CommunityReports",
                        match: { isEnabled: true }
                    }
                ])

            //members on community
            members = await communityManagerService.getMembersCommunity({ communityId: body.communityId });

            //rol of user in community
            if (getCommunty.userID == body.userId) {
                const memberComplete = await CommunityManagerModel.findOne({
                    $and: [{ communityId: body.communityId }, { allocatorUserId: body.userId }, { assignedUserId: body.userId }]
                })
                    .populate('allocatorUserId', { birthday: 1, email: 1, profilePicture: 1, name: 1, _id: 1, score: 1, gender: 1, phone: 1, alias: 1, relationshipStatus: 1 })
                    .populate([
                        {
                            path: 'typeId',
                            model: 'CommunityTypeManager',
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
                getUser = await userRequestCommunityService.getByUserIdAndCommunityIdAccepted(body);

                if (getUser) {
                    const memberComplete = await CommunityManagerModel.findOne({
                        $and: [{ communityId: body.communityId }, { assignedUserId: body.userId }]
                    })
                        .populate('assignedUserId', { birthday: 1, email: 1, profilePicture: 1, name: 1, _id: 1, score: 1, gender: 1, phone: 1, alias: 1, relationshipStatus: 1 })
                        .populate([
                            {
                                path: 'typeId',
                                model: 'CommunityTypeManager',
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
                    visitor = 'User Not in community'
                }
            }

            request = await userRequestCommunityService.getByUserIdAndCommunityId(body)

            members ? members2 = members.length + 1 : members2 = 1

            return { community: getCommunty, members: members2, rolInCommunity: visitor, request: request };

        } catch (error) {
            console.log(error);
        }
    }

    public async getCommunityByIDNotify(communityId: any) {
        try {
            let communityInfo = await CommunitiesModel.findOne({
                $and: [{ _id: communityId }, { isEnabled: true }]
            }).populate('userID')
            return communityInfo
        } catch (error) {
            console.log(error);
        }
    }

    public async setReports(body: any, communities: any) {
        communities.filter((obj: any) => {
            if (obj.reportID != undefined) {
                if (obj.reportID.reportingEntitiesIDS.length > 0) {
                    obj.reportID.reportingEntitiesIDS.filter((reportingUser: any) => {
                        if (reportingUser == body.visitorID) {
                            obj.myReport = true
                        }
                    })
                }
            }
        })

        return communities
    }

    public async getCommunityByCategory(body: any) {
        try {
            const myCommunities = await CommunitiesModel.find({ CategoriesOfCommunitiesIDS: body.categoryCommunityId, isEnabled: true })
            return  myCommunities;
        } catch (error) {
            console.log(error);            
        }
    }
}

export const communitiesServices = new CommunitiesServices();