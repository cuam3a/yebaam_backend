import { Request, Response } from 'express';
import { colorsServices } from '../../services/colors/colors.service';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class ColorsController {
    public async createColor(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const saveColor = await colorsServices.createColor(body)
            responses.success(req, res, saveColor)
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async getColorByAnyField(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const getColor = await colorsServices.getColorByAnyField(body)
            responses.success(req, res, getColor)
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
        }
    }

    public async getAllColors(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const getColor = await colorsServices.getAllColors()
            responses.success(req, res, getColor)
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
        }
    }

    public async updateColorById(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const updateColor = await colorsServices.updateColorById(body)
            responses.success(req, res, updateColor)
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
        }
    }

    public async deleteColor(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
            const deleteColor = await colorsServices.deleteColor(body)
            responses.success(req, res, deleteColor)
            } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
        }
    }
}

export const colorsController = new ColorsController()