import { Request, Response } from 'express';
import { awardServices } from '../../../services/Admin/awards/awards.service';
import { ConstantsRS } from '../../../utils/constants';
import { responses } from '../../utils/response/response';
import { middlewares } from '../../../middlewares/middleware';

class AwardController {
    public async createAward(req: any, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const body = req.body
                    const file = req.files
                    const awardToSave = await awardServices.saveAward(body, file)
                    if (!awardToSave.code) {
                        responses.success(req, res, awardToSave);
                    } else {
                        responses.error(req, res, awardToSave);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async updateAwardByID(req: any, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const body = req.body
                    const file = req.files
                    const awardToUpdate = await awardServices.updateAwardByID(body, file)
                    if (!awardToUpdate.code) {
                        responses.success(req, res, awardToUpdate);
                    } else {
                        responses.error(req, res, awardToUpdate);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deleteAwardByID(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const awardToDelete = await awardServices.deleteAwardByID(body)
                    if (!awardToDelete.code) {
                        responses.success(req, res, awardToDelete);
                    } else {
                        responses.error(req, res, awardToDelete);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async getAllAwards(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const awards = await awardServices.getAll()
                    if (!awards.code) {
                        responses.success(req, res, awards);
                    } else {
                        responses.error(req, res, awards);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getAwardByID(req: Request, res: Response) {
        try {
            let body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const award = await awardServices.getByID(body.id)
                    if (!award.code) {
                        responses.success(req, res, award);
                    } else {
                        responses.error(req, res, award);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }
}
export const awardController = new AwardController();