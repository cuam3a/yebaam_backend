import { Request, Response } from 'express';
import { storiesServices } from '../../services/stories/stories.services';
import { ConstantsRS } from "../../utils/constants";
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class StoriesController {
    public async getStoryByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const story = await storiesServices.getStoryByID(body.id, body.visitorID);
            responses.success(req, res, story);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }
    public async createStories(req: any, res: Response) {
        try {
            const body = req.body;
            const files = req.files;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const storiesSaved = await storiesServices.createStories(body, files.files);
            if (!storiesSaved.code) {
                responses.success(req, res, storiesSaved);
            } else {
                responses.error(req, res, storiesSaved);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }
    public async deleteStories(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const storyToDelete = await storiesServices.deleteStories(body.id);
            if (!storyToDelete.code) {
                responses.success(req, res, storyToDelete);
            } else {
                responses.error(req, res, storyToDelete);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
    public async getHomeStoriesByEntityId(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const homeStories = await storiesServices.getHomeStories(body);
            responses.success(req, res, homeStories);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async setViewToStory(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const view = await storiesServices.setView(body);
            if (!view.code) {
                responses.success(req, res, view);
            } else {
                responses.error(req, res, view);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async toArchiveStory(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const archivedStory = await storiesServices.toArchiveStory(body);
            if (!archivedStory.code) {
                responses.success(req, res, archivedStory);
            } else {
                responses.error(req, res, archivedStory);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async getAarchivedStoriesByEntityId(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const archivedStories = await storiesServices.getArchivedStoriesByEntityID(body);
            if (!archivedStories.code) {
                responses.success(req, res, archivedStories);
            } else {
                responses.error(req, res, archivedStories);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const storiesController = new StoriesController();