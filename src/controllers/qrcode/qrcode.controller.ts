import { Request, Response } from 'express';
import { qrCodeServices } from '../../services/qrcode/qrcode.services';
import { responses } from '../utils/response/response';
import { ConstantsRS } from '../../utils/constants';
const qrCodeModel = require('../../models/qrcode/qrcode.model');
import { middlewares } from '../../middlewares/middleware';

class QRCodeController {
    public async createQRCode(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const qrToCreate = await qrCodeServices.createQRCode(body, file)
            if (qrToCreate) {
                responses.success(req, res, qrToCreate);
            } else {
                responses.error(req, res, { ...ConstantsRS.CANNOT_CREATE_QR_CODE })
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CANNOT_CREATE_QR_CODE, error: error })
        }
    }

    public async getCodeQR(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const qrToCreate = await qrCodeServices.getCodeQR(body)
            if (qrToCreate) {
                responses.success(req, res, qrToCreate);
            } else {
                responses.success(req, res, [])
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async deleteCodeQR(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const qrToCreate = await qrCodeServices.deleteCodeQR(body)
            if (qrToCreate) {
                responses.success(req, res, qrToCreate);
            } else {
                responses.error(req, res, ConstantsRS.CANNOT_DELETE_RECORD)
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CANNOT_DELETE_RECORD, error: error })
        }
    }
}
export const qrCodeController = new QRCodeController()