import { Request, Response } from 'express';
import { contentSavedServices } from '../../services/savedcontents/savedcontents.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ConstentSavedController {
    public async createSavedContent(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const contentSaved = await contentSavedServices.saveContent(body);
            if (!contentSaved.code) {
                responses.success(req, res, contentSaved);
            } else {
                responses.error(req, res, contentSaved);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async getSavedContentByUserNTypeID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const contents = await contentSavedServices.getContentsByUserIDNType(body);
            responses.success(req, res, contents.response, 200, contents.nextSkip);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async deleteSavedContentByID(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const contentSavedDeleted = await contentSavedServices.deleteContentSaved(body.id);
            if (!contentSavedDeleted.code) {
                responses.success(req, res, contentSavedDeleted);
            } else {
                responses.error(req, res, contentSavedDeleted);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
}

export const contentSavedController = new ConstentSavedController();