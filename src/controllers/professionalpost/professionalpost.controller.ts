import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { professionalPostServices } from '../../services/professionalpost/professionalpost.services';
import { middlewares } from '../../middlewares/middleware';
import { similarServices } from '../../services/similarservices/similar.services';
import { notificationsServices } from '../../services/notifications/notifications.services';
import { responses } from '../utils/response/response';
import { socialProfessionalServices } from '../../services/social/socialprofessional.services';
const savedContentsModel = require('../../models/savedcontents/SavedContents.model');

const profesionalPostModel = require('../../models/professionalpost/ProfessionalPosts.model');

class ProfessionalPostController {
    public async createPost(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let imgAndOrVideosGif = body.imgAndOrVideosGif, rtaSave, rtaError, rta, success = false
            if (body.postIDContent != undefined) {
                rtaSave = await professionalPostServices.savePost(body, 4)
                if (rtaSave) {
                    rta = await professionalPostServices.postByIDForShare(rtaSave.id)
                    const getPostPro = await profesionalPostModel.findOne({ _id: body.postIDContent });
                    if (getPostPro) {
                        await profesionalPostModel.updateOne({ _id: getPostPro.id }, { shareds: (getPostPro.shareds + 1) });
                        if (getPostPro.disableNotifications != undefined && getPostPro.disableNotifications == false) {
                            const canInotifyValidate = await socialProfessionalServices.canINotify({firstID : body.professionalProfileID, secondID : getPostPro.professionalProfileID })
                            if (canInotifyValidate == false) {
                                await notificationsServices.sendNotificationSharePostProfessional(getPostPro, body.professionalProfileID)
                            }    
                        }
                    }
                }
            } else {
                if (imgAndOrVideosGif.length == 0) { // ningún contenido multimedia
                    rta = await professionalPostServices.savePost(body, 3)
                    await similarServices.changeLastPost("professional", body.professionalProfileID)
                    rta ? success = true : success = false
                } else if (imgAndOrVideosGif.length == 1) { // solo 1 contenido multimedia
                    let isGifValidate = body.imgAndOrVideosGif.find((gif: any) => gif.type === 'Gif')
                    if (isGifValidate) {
                        rta = await professionalPostServices.savePost(body, 0)
                        await similarServices.changeLastPost("professional", body.professionalProfileID)
                        rta ? success = true : success = false
                    } else {
                        body.imgAndOrVideos = imgAndOrVideosGif[0]
                        rta = await professionalPostServices.savePost(body, 0)
                        if (rta) {
                            await similarServices.changeLastPost("professional", body.professionalProfileID)
                            rta ? success = true : success = false
                        } else {
                            rtaError = ConstantsRS.ERROR_SAVING_RECORD;
                        }
                    }
                } else { // varios contenidos multimedia
                    let ids = []
                    for (let index = 0; index < imgAndOrVideosGif.length; index++) {
                        const postToSaved = new profesionalPostModel(body);
                        postToSaved.imgAndOrVideosGif = []
                        postToSaved.imgAndOrVideos = imgAndOrVideosGif[index]
                        //postToSaved.description = imgAndOrVideosGif[index].description
                        /* postToSaved.taggedUsers = []
                        if (imgAndOrVideosGif[index].taggedUsers.length > 0) {
                            postToSaved.taggedUsers.push(imgAndOrVideosGif[index].taggedUsers)
                        } else {
                            postToSaved.taggedUsers = []
                        } */
                        postToSaved.typePost = 1
                        rta = await postToSaved.save();
                        if (rta) {
                            ids.push(rta.id)
                        } else {
                            rtaError = ConstantsRS.ERROR_SAVING_RECORD;
                        }
                    }
                    rta = await professionalPostServices.savePostTypeTwo(body, ids, 2)
                    await similarServices.changeLastPost("professional", body.professionalProfileID)
                    rta ? success = true : success = false
                }
            }
            res.send({
                error: rtaError ? rtaError : null,
                success: success,
                data: rta
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        }
        catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }

    }

    public async getPostByProfessionalID(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const posts = await professionalPostServices.getPostsByUserID(body.professionalProfileID, body.visitorID)
            if (body.visitorID != undefined && posts) {
                posts.filter((obj: any) => {
                    if (obj.reactionsIDS.length > 0) {
                        obj.reactionsIDS.filter((reacts: any) => {
                            if (reacts.professionalProfileID != undefined) {
                                if (reacts.professionalProfileID._id == body.visitorID) {
                                    obj.myReaction = {
                                        professionalProfileID: reacts.professionalProfileID._id,
                                        value: reacts.value
                                    }
                                }
                            }
                        })
                    }

                    if (obj.postIDContent != undefined) {
                        if (obj.postIDContent.reactionsIDS.length > 0) {
                            obj.postIDContent.reactionsIDS.filter((reacts: any) => {
                                if (reacts.userID != undefined) {
                                    if (reacts.userID._id == body.visitorID) {
                                        obj.myReaction = {
                                            userID: reacts.userID._id,
                                            value: reacts.value
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            }

            responses.success(req, res, posts);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async updatePostByID(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updatePost = await professionalPostServices.updatePost(body);
            return res.send({
                error: updatePost ? null : ConstantsRS.ERROR_SAVING_RECORD,
                success: updatePost ? true : false,
                data: updatePost ? updatePost : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deletePostByID(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deletePost = await professionalPostServices.deletePost(body);
            return res.send({
                error: deletePost ? null : ConstantsRS.ERROR_SAVING_RECORD,
                success: deletePost ? true : false,
                data: deletePost ? deletePost : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async getPostsHomeProfessionalById(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let getPosts: any = await similarServices.getPostsHomeProfessionalById(body)

            if (!getPosts.code) {
                if (getPosts.data != undefined && getPosts.data.length > 0) {
                    body.visitorID = body.entityID
                    getPosts = await professionalPostServices.setReactionsNReports(body, getPosts.data)

                    for (let i = 0; i < getPosts.length; i++) {
                        const post = getPosts[i];
                        let contentSavedExist = await savedContentsModel.findOne({
                            $and: [
                                { professionalPostID: post.id },
                                { professionalProfileID: body.visitorID }
                            ]
                        })
                        if (contentSavedExist) {
                            post.iSaveIt = true
                        }
                    }

                    responses.success(req, res, getPosts)
                } else {
                    responses.error(req, res, ConstantsRS.NO_RECORDS);
                }
            } else {
                responses.error(req, res, getPosts);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getPostsByCommunityID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let posts = await professionalPostServices.getPostsByCommunityID(body)

            if (body.visitorID != undefined && posts) {
                posts = await professionalPostServices.setReactionsNReports(body, posts)
            }

            responses.success(req, res, posts);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async getProfessionalPostByID(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let getPost = await professionalPostServices.postByID(body.postID, body.visitorID)

            if (body.visitorID != undefined && getPost) {
                if (getPost.reactionsIDS.length > 0) {
                    getPost.reactionsIDS.filter((reacts: any) => {
                        if (reacts.professionalProfileID._id == body.visitorID) {
                            getPost.myReaction = {
                                professionalProfileID: reacts.professionalProfileID._id,
                                value: reacts.value
                            }
                        }
                    })
                }

                if (getPost.postIDS.length > 0) {
                    getPost.postIDS.filter((post: any) => {
                        post.reactionsIDS.filter((reacts: any) => {
                            if (reacts.professionalProfileID._id == body.visitorID) {
                                post.myReaction = {
                                    professionalProfileID: reacts.professionalProfileID._id,
                                    value: reacts.value
                                }
                            }
                        })
                    })
                }

                if (getPost.reportID != undefined) {
                    if (getPost.reportID.reportingEntitiesIDS.length > 0) {
                        getPost.reportID.reportingEntitiesIDS.filter((reportingUser: any) => {
                            if (reportingUser == body.visitorID) {
                                getPost.myReport = true
                            }
                        })
                    }
                }
            }

            responses.success(req, res, getPost);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }
}

export const professionalPostController = new ProfessionalPostController();