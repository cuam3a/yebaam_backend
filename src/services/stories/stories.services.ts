const storiesModel = require("../../models/stories/Stories.model");
var _ = require("lodash");
import moment from 'moment';
import { ConstantsRS } from '../../utils/constants';
import { awsServiceS3 } from '../aws/aws.services';
import { socialServices } from '../social/social.services';
import { similarServices } from '../similarservices/similar.services';
import { userChallengeServices } from '../userchallenges/userchallenges.services';
import { userRankServices } from '../userranks/userranks.service';
import { brandRankingServices } from '../brandranking/brandranking.service';

class StoriesServices {
    public async getStoryByID(id: string, visitorID: string = "") {
        let validateView
        let getStory = await storiesModel.findById(id)
            .populate({
                path: 'userId',
                model: 'Users',
                populate: {
                    path: 'rankID',
                    model: 'Ranks',
                }
            })
        if (getStory) {
            if (getStory.views != undefined) {
                validateView = getStory.views.find((x: string) => x == visitorID);
                if (validateView) {
                    getStory.itWasSeen = true
                }
            }
        }

        return getStory;
    }

    public async createStories(obj: any, files: any) {
        let rta, rtaError, infoFileUrl: any = [], storySaved
        const entityId = obj.userId || obj.trademarkId;

        if (files != undefined) {
            if (files.length) {
                //TODO many files
                const file = files;
                let filesUplaoded = 0;
                for await (let fileOne of file) {
                    if (fileOne.mimetype.indexOf('image') >= 0 || fileOne.mimetype.indexOf('video') >= 0 || fileOne.mimetype.indexOf('audio') >= 0) {
                        const dataToSave = { entityId, file: fileOne };
                        const fileSaved = await awsServiceS3.UploadFile(dataToSave);
                        infoFileUrl.push(fileSaved);
                        filesUplaoded += 1;
                    }
                }
                if (filesUplaoded == file.length) {
                    let date = moment();
                    var returned_endate = moment(date).add(ConstantsRS.DURATION_STORY_IN_HOURS, 'hours');
                    const storieToSave = new storiesModel({ ...obj, multimedia: infoFileUrl, expirationDate: returned_endate });
                    storySaved = await storieToSave.save();

                    if (storySaved) {
                        rta = storySaved

                        if (obj.userId != undefined) { // Usuario
                            // User challenges
                            await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, entityId, rta.id)
                            // Sumar avance de ranking
                            await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, entityId, rta.id)
                        } else if (obj.trademarkId != undefined) { // Marca
                            // Sumar avance de ranking
                            await brandRankingServices.saveBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, entityId, rta.id)
                        }
                    } else {
                        rtaError = ConstantsRS.ERROR_SAVING_RECORD
                    }

                    return rta ? rta : rtaError
                }

            } else {
                infoFileUrl.push(await awsServiceS3.UploadFile({ entityId, file: files }))
            }
        }

        //TODO expirationDate
        let date = moment();
        var returned_endate = moment(date).add(ConstantsRS.DURATION_STORY_IN_HOURS, 'hours');
        const storieToSave = new storiesModel({ ...obj, multimedia: infoFileUrl, expirationDate: returned_endate });
        storySaved = await storieToSave.save();

        if (storySaved) {
            if (obj.userId != undefined) {
                // User challenges
                await userChallengeServices.saveUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, entityId, storySaved.id)
                // Sumar avance de ranking
                await userRankServices.saveUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, entityId, storySaved.id)
            }

            rta = storySaved
        } else {
            rtaError = ConstantsRS.ERROR_SAVING_RECORD
        }

        return rta ? rta : rtaError
    }

    public async deleteStories(id: string) {
        try {
            let rta, rtaError
            let storyExist = await this.getStoryByID(id);
            if (storyExist) {
                let storyToDelete = await storiesModel.deleteOne({ _id: id });
                if (storyToDelete) {
                    if (storyExist.userId.id != undefined) {
                        // Restar avance de ranking
                        await userChallengeServices.cancelAdvanceUserChallenge(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, storyExist.userId.id, storyExist.id)
                        // Restar avance de ranking
                        await userRankServices.cancelAdvanceUserRank(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, storyExist.userId.id, storyExist.id)
                    } else if (storyExist.trademarkId != undefined) {
                        // Restar avance de ranking
                        await brandRankingServices.cancelAdvanceBrandRanking(ConstantsRS.SYSTEM_ACTION_UPLOAD_STORY.code, storyExist.trademarkId, storyExist.id)
                    }

                    rta = "Historia eliminada correctamente"
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
            }
            return rta ? rta : rtaError
        } catch (error) {
            console.log(error);
        }
    }

    public async getHomeStories(body: any) {
        let stories, friendStories: any = [], entitiesIDS, ownStories, actualDate = moment(), seenStories: any = [], unseenStories: any = []

        const socialFriends = await socialServices.getSocialFriendsForPosts(body.entityID);

        if (socialFriends.length > 0) {
            entitiesIDS = await socialServices.separateUsersPostsHome(socialFriends, body.entityID);
            for await (let id of entitiesIDS) { // Recorre los ids de todos los amigos
                let getStories = await this.getStoriesForHome(id, body);
                let userStories: any = {}, dataUser

                if (getStories.length > 0) { // Recorre las historias de los amigos
                    let stories: any = []
                    for await (let item of getStories) {
                        dataUser = item.userId ? item.userId : item.trademarkId
                        if (item.views != undefined) {
                            let validateView = undefined
                            validateView = item.views.find((x: any) => x.id == body.entityID);
                            if (validateView) {
                                item.itWasSeen = true
                            }
                        }

                        delete item.userId
                        if (stories.length > 0) {
                            stories = stories.concat(item);
                        } else {
                            stories.push(item)
                        }
                    }
                    var sortedStories = _.orderBy(stories, ["creationDate"], ["asc"]);

                    userStories.user = dataUser
                    userStories.stories = sortedStories

                    let viewCounter = 0
                    for await (let story of sortedStories) { // Recorre hitorias con propiedad de vista por usuario
                        if (story.itWasSeen) viewCounter++
                    }
                    if (sortedStories.length == viewCounter) { // Si la cantidad de historias por usuario son todas vistas por el consumidor
                        userStories.userStorySeen = true
                        seenStories.push(userStories)
                    } else {
                        userStories.userStorySeen = false
                        unseenStories.push(userStories)
                    }

                    // friendStories.push(userStories)
                }
            }
        }
        friendStories = unseenStories.concat(seenStories)

        ownStories = await storiesModel.find({
            $or: [
                { $and: [{ userId: body.entityID }, { expirationDate: { $gte: actualDate } }] },
                { $and: [{ trademarkId: body.entityID }, { expirationDate: { $gte: actualDate } }] },
            ]
        }).populate([
            {
                path: 'userId',
                model: 'Users',
                populate: {
                    path: 'rankID',
                    model: 'Ranks',
                }
            },
            {
                path: 'trademarkId',
                model: 'Trademarks',
            },
            {
                path: 'taggedUsers',
                model: 'Users',
            }
        ])

        stories = {
            ownStories,
            friendStories
        }

        return stories
    }

    public async getStoriesForHome(entityID: string, body: any) {
        let { limit, nextSkip, skip } = body;
        let stories, actualDate = moment()

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        const entity = await similarServices.identifyUserBrandOrCommunity(entityID)

        if (entity.code == undefined && entity.isEnabled == true) {
            stories = await storiesModel.find({
                $or: [
                    { $and: [{ userId: entityID }, { expirationDate: { $gte: actualDate } }] },
                    { $and: [{ trademarkId: entityID }, { expirationDate: { $gte: actualDate } }] },
                ]
            }).populate([
                {
                    path: 'userId',
                    model: 'Users',
                    populate: {
                        path: 'rankID',
                        model: 'Ranks',
                    }
                },
                {
                    path: 'trademarkId',
                    model: 'Trademarks',
                },
                {
                    path: 'taggedUsers',
                    model: 'Users',
                },
                {
                    path: 'views',
                    model: 'Users',
                    select: 'id name profilePicture'
                }
            ]).limit(limit).skip(skip)
                .sort('-creationDate')
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        return stories;
    }

    public async setView(body: any) {
        let rta, rtaError

        const storyExist = await storiesModel.findById(body.id)
        if (storyExist) {
            let userViewExist = await storiesModel.findOne({
                $and: [{ _id: body.id }, { views: { $in: [body.userID] } }]
            })

            if (!userViewExist) {
                let dataStiryToUpdate = new storiesModel(storyExist);
                dataStiryToUpdate.views.push(body.userID)
                const postReportToUpdate = await storiesModel.findOneAndUpdate({ _id: body.id }, dataStiryToUpdate, { new: true })

                if (postReportToUpdate) {
                    rta = postReportToUpdate
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async toArchiveStory(body: any) {
        let rta, rtaError

        const storyExist = await storiesModel.findById(body.id)
        if (storyExist) {
            let archivedStory = await storiesModel.findOne({
                $and: [{ _id: body.id }, { archived: true }]
            })

            if (!archivedStory) {
                let dataStoryToUpdate = new storiesModel(storyExist);
                dataStoryToUpdate.archived = true
                const storyArchived = await storiesModel.findOneAndUpdate({ _id: body.id }, dataStoryToUpdate, { new: true })

                if (storyArchived) {
                    rta = storyArchived
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getArchivedStoriesByEntityID(body: any) {
        let rta, rtaError
        let { limit, nextSkip, skip, entityID } = body;
        let stories

        if (!limit) {
            limit = ConstantsRS.PACKAGE_LIMIT;
        }

        const entity = await similarServices.identifyUserBrandOrCommunity(entityID)

        if (entity.code == undefined && entity.isEnabled == true) {
            stories = await storiesModel.find({
                $or: [
                    { $and: [{ userId: entityID }, { archived: true }] },
                    { $and: [{ trademarkId: entityID }, { archived: true }] },
                ]
            }).populate([
                {
                    path: 'userId',
                    model: 'Users',
                },
                {
                    path: 'trademarkId',
                    model: 'Trademarks',
                },
                {
                    path: 'taggedUsers',
                    model: 'Users',
                },
                {
                    path: 'views',
                    model: 'Users',
                    select: 'id name profilePicture'
                }
            ]).limit(limit).skip(skip)
                .sort('-creationDate')
        }

        nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

        if (stories.length > 0) {
            rta = stories
        } else {
            rtaError = ConstantsRS.NO_RECORDS
        }

        return rta ? rta : rtaError
    }
}
export const storiesServices = new StoriesServices();