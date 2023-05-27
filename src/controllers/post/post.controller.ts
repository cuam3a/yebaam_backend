import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { postSevices } from '../../services/post/post.services';
import { similarServices } from '../../services/similarservices/similar.services';
import { pointsByPostService } from '../../services/Admin/pointsByPost/pointsByPost.service';
import { responses } from '../utils/response/response';

const postModel = require('../../models/post/Posts.model');
const savedContentsModel = require('../../models/savedcontents/SavedContents.model');

class PostController {
    public async createPost(req: Request, res: Response) {
        try {
            let body = req.body, rta;
            if (body.dataToPoints && !body.dataToPoints.likePoints) throw ConstantsRS.DATAPOINTS_NOT_VALID;

            let token = req.headers.authorization ? req.headers.authorization : ''
            /* await middlewares.verifyToken(token).then(async rta => {
                 if (rta.success) { */
            let postSave = await postSevices.createPost(body);

            if (postSave && body.dataToPoints) {
                // send body to servide create post points
                let pointsByPostSaved = await pointsByPostService.createPointsToPost(body, postSave._id);
                postSave.pointsByPostID = pointsByPostSaved
            }

            if (postSave.code == undefined) {
                responses.success(req, res, postSave);
            } else {
                responses.error(req, res, postSave);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        }
        catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }

    }

    public async getPostByUserID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let posts = await postSevices.getPostsByUserID(body.entityID, body.visitorID)

            if (body.visitorID != undefined && posts) {
                posts = await postSevices.setReactionsNReports(body, posts)
            }

            res.send({
                error: posts ? null : ConstantsRS.ERROR_FETCHING_RECORD,
                success: posts ? true : false,
                data: posts ? posts : []
            });
        } catch (error) {
            res.send({
                error: ConstantsRS.ERROR_FETCHING_RECORD,
                success: false,
                data: []
            });
        }
    }

    public async getPostsByCommunityID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */

            let posts = await postSevices.getPostsByCommunityID(body)

            if (body.visitorID != undefined && posts) {
                posts = await postSevices.setReactionsNReports(body, posts)
            }

            responses.success(req, res, posts);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            console.log(error);
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async deletePostByIdOnlyDev(req: Request, res: Response) {
        try {
            const id = req.body.id;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            await postModel.deleteOne({ _id: id }, (error: any) => {
                if (error) {
                    responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
                } else {
                    responses.success(req, res, 'Post eliminado satisfactoriamente');
                }
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async getGeneralPost(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let { limit, nextSkip, skip } = req.body;

            if (!limit) {
                limit = ConstantsRS.PACKAGE_LIMIT;
            }

            const postsFromDatabase = await postModel.find({}).limit(limit).skip(skip);

            nextSkip = skip !== undefined ? skip + (limit ? limit : ConstantsRS.PACKAGE_LIMIT) : (limit ? limit : ConstantsRS.PACKAGE_LIMIT);

            res.status(200).send({
                error: null,
                success: true,
                data: postsFromDatabase,
                nextSkip
            });
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }

    }

    public async getPostsForHome(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let getPosts: any = await similarServices.getPostsHomeById(body)
            if (!getPosts.code) {
                body.visitorID = body.entityID
                getPosts = await postSevices.setReactionsNReports(body, getPosts.data)
                for (let i = 0; i < getPosts.length; i++) {
                    const post = getPosts[i];
                    let contentSavedExist = await savedContentsModel.findOne({
                        $and: [
                            { postID: post.id },
                            { userID: body.visitorID }
                        ]
                    })
                    if (contentSavedExist) {
                        post.iSaveIt = true
                    }
                }

                responses.success(req, res, getPosts)
            } else {
                responses.error(req, res, getPosts);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            console.log("E: ", error)
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async updatePost(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const updatePost = await postSevices.updatePostID(body);
            responses.success(req, res, updatePost)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deletePost(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const deletePost = await postSevices.deletePostID(body);
            if (!deletePost.code) {
                responses.success(req, res, deletePost);
            } else {
                responses.error(req, res, deletePost);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async postByID(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let getPost = await postSevices.postByID(body.postID, body.visitorID)

            if (body.visitorID != undefined && getPost) {
                if (getPost.reactionsIDS.length > 0) {
                    getPost.reactionsIDS.filter((reacts: any) => {
                        if (reacts.userID != undefined) {
                            if (reacts.userID._id == body.visitorID) {
                                getPost.myReaction = {
                                    userID: reacts.userID._id,
                                    value: reacts.value
                                }
                            }
                        }
                    })
                }

                if (getPost.postIDS.length > 0) {
                    getPost.postIDS.filter((post: any) => {
                        post.reactionsIDS.filter((reacts: any) => {
                            if (reacts.userID != undefined) {
                                if (reacts.userID._id == body.visitorID) {
                                    post.myReaction = {
                                        userID: reacts.userID._id,
                                        value: reacts.value
                                    }
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

                if (getPost.postIDContent != undefined) {
                    if (getPost.postIDContent.reactionsIDS.length > 0) {
                        getPost.postIDContent.reactionsIDS.filter((reacts: any) => {
                            if (reacts.userID != undefined) {
                                if (reacts.userID._id == body.visitorID) {
                                    getPost.myReaction = {
                                        userID: reacts.userID._id,
                                        value: reacts.value
                                    }
                                }
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

    public async movePosts(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const moveToPost = await postSevices.movePosts(body)
            res.send({
                error: moveToPost.code != undefined ? moveToPost : moveToPost ? null : ConstantsRS.ERROR_MOVING_POST,
                success: moveToPost.code != undefined ? false : moveToPost ? true : false,
                data: moveToPost.code != undefined ? [] : moveToPost ? moveToPost : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async copyPosts(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const copyToPost = await postSevices.copyPosts(body)
            res.send({
                error: copyToPost ? null : ConstantsRS.ERROR_WHEN_COPYING_THE_POST,
                success: copyToPost ? true : false,
                data: copyToPost ? copyToPost : []
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }
}
export const postController = new PostController();