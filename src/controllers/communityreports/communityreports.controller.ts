import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { communityReportServices } from '../../services/communityreports/communityreport.service';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class CommunityReportController {
    public async createCommunityReport(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const communityReportToManage = await communityReportServices.saveCommunityReport(body)
            if (!communityReportToManage.code) {
                responses.success(req, res, communityReportToManage);
            } else {
                responses.error(req, res, communityReportToManage);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async deletePostReportById(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async rta => {
                      if (rta.success) { */
            const postReportToDelete = await communityReportServices.deleteReportById(body);
            if (!postReportToDelete.code) {
                responses.success(req, res, postReportToDelete);
            } else {
                responses.error(req, res, postReportToDelete);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }

    public async deleteCommunityReportByCommunityId(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async rta => {
                      if (rta.success) { */
            const communityReportToDelete = await communityReportServices.deleteReportByCommunityId(body);
            if (!communityReportToDelete.code) {
                responses.success(req, res, communityReportToDelete);
            } else {
                responses.error(req, res, communityReportToDelete);
            }
            /* } else {
                          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                      }
                  }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error, });
        }
    }

    public async getReportsByState(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async (rta) => {
                if (rta.success) { */
            const reports = await communityReportServices.getByState(body.reportState);
            if (!reports.code) {
                responses.success(req, res, reports);
            } else {
                responses.error(req, res, reports);
            }
            /* } else {
                responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
            }
        }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error, });
        }
    }

    public async changeReportStateByID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async (rta) => {
                if (rta.success) { */
            const reportState = await communityReportServices.changeReportState(body);
            if (!reportState.code) {
                responses.success(req, res, reportState);
            } else {
                responses.error(req, res, reportState);
            }
            /* } else {
                responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
            }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async changeReportStateForUserByID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async rta => {
                      if (rta.success) { */
            const reportState = await communityReportServices.changeReportStateForUser(body);
            if (!reportState.code) {
                responses.success(req, res, reportState);
            } else {
                responses.error(req, res, reportState);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async getReportsByUserID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async rta => {
                      if (rta.success) { */
            const reports = await communityReportServices.getByUser(body.entityID);
            responses.success(req, res, reports);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getReportsByUserReportedID(req: Request, res: Response) {
        try {
            let body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : "";

            /* await middlewares.verifyToken(token).then(async rta => {
                      if (rta.success) { */
            const reports = await communityReportServices.getByUserReported(body.entityID);
            responses.success(req, res, reports);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }
}

export const communityReportController = new CommunityReportController();