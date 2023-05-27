import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../../controllers/utils/response/response';
import { middlewares } from '../../middlewares/middleware';

// Services
import { vendorBlockingServices } from '../../services/vendorblocking/vendorblocking.service';

class VendorBlockingController {
    public async createOrDeleteVendorBlocking(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let body = req.body
            const saveLock = await vendorBlockingServices.saveOrCancelVendorBlocking(body);
            if (!saveLock.code) {
                responses.success(req, res, saveLock);
            } else {
                responses.error(req, res, saveLock);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async getVendorBlocksByBlockerID(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let body = req.body
            const locks = await vendorBlockingServices.getaAllLocksByBlockerID(body);
            if (!locks.code) {
                responses.success(req, res, locks);
            } else {
                responses.error(req, res, locks);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async deleteVendorBlockingByID(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let body = req.body
            const lockDeleted = await vendorBlockingServices.deleteLockById(body.id);
            if (!lockDeleted.code) {
                responses.success(req, res, lockDeleted);
            } else {
                responses.error(req, res, lockDeleted);
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

export const vendorBlockingController = new VendorBlockingController();