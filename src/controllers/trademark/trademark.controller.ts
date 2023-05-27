import { Request, Response } from 'express';
import moment from 'moment'
const trademarksModel = require('../../models/trademarks/Trademarks.model');
const bcrypt = require('bcrypt');

// classes
import { ConstantsRS } from '../../utils/constants';
import { similarServices } from '../../services/similarservices/similar.services';
import { middlewares } from '../../middlewares/middleware';
import { typeofmarksServices } from '../../services/trademarks/typeofmarks.services';
import { trademarksServices } from '../../services/trademarks/trademarks.services';
import * as bodyParser from 'body-parser';
import { responses } from '../utils/response/response';

// services
import { socialServices } from '../../services/social/social.services';

class TrademarksController {
    public async getallTrademarks(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const trademarks = await trademarksModel.find({
                $and: [
                    { isEnabled: true },
                    { currentLanding: { $ne: undefined } }
                ]
            })
            responses.success(req, res, trademarks);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getTrademarkById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const trademark = await trademarksModel
                .findOne({ _id: req.body.id })
                .populate('typeOfMarkID')
                .populate({
                    path: 'currentLanding',
                    model: 'DataOfLandings',
                    match: { isEnabled: true },
                    populate: [
                        {
                            path: 'landingID',
                            model: 'Landings',
                        }
                    ]
                })

            let socialConnectionsCount = await socialServices.getSocialConnectionsCount(req.body)
            
            let rta = {
                brand: trademark,
                counters: socialConnectionsCount
            }

            responses.success(req, res, rta);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }

    public async createTradeMark(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let brandCreate
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const trademarkToRegister = await trademarksModel.findOne({ email: body.email }).exec();

            if (trademarkToRegister) {
                if (trademarkToRegister.verification_code) {
                    if (trademarkToRegister.verification_code.isVerified) {
                        const verify = await similarServices.verifyUpdPassAccount(body, trademarkToRegister.type)
                        if (verify) {
                            brandCreate = await trademarksServices.createBrandDataBasic(body, file)
                        }

                        if (brandCreate) {
                            responses.success(req, res, brandCreate);
                        } else {
                            responses.error(req, res, ConstantsRS.ERROR_SAVING_RECORD);
                        }
                    } else {
                        responses.error(req, res, ConstantsRS.EMAIL_IS_NOT_VERIFY);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.REPEAT_PROCESS_CODE);
                }
            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async resetPassword(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const trademarkToUpdate = await trademarksModel.findOne({ email: body.email }).exec();
            if (trademarkToUpdate) {
                const codeVerification = await similarServices.validateCodeFromEmail(body, trademarkToUpdate)
                if (codeVerification.success) {
                    if (trademarkToUpdate.isEmailVerified) {
                        const update = await similarServices.changePassword(body, trademarkToUpdate.type)
                        res.status(200).send(update);
                    } else {
                        responses.error(req, res, ConstantsRS.EMAIL_IS_NOT_VERIFY);
                    }
                } else {
                    res.status(200).send(codeVerification);
                }
            } else {
                responses.error(req, res, ConstantsRS.THERE_IS_NO_VERIFICATION_CODE);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async deleteTrademarkById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const trademark = await trademarksModel.findOne({ _id: body.id }).exec()
            if (trademark != null) {
                await trademarksModel.deleteOne({ _id: body.id }).then(async () => {
                    await trademarksServices.actionsWhenDeletingBrand(body.id)
                    responses.success(req, res, 'Registro eliminado satisfactoriamente');
                }).catch(() => {
                    responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER, 404);
                });

            } else {
                responses.error(req, res, ConstantsRS.THE_RECORD_DOES_NOT_EXIST);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }

    public async updateTrademarkById(req: any, res: Response) {
        try {
            const body = req.body;
            const file = req.files;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const trademarkUpdate = await trademarksServices.updateBrandDataBasic(body, file)
            if (trademarkUpdate) {
                responses.success(req, res, trademarkUpdate);
            } else {
                responses.error(req, res, ConstantsRS.ERROR_UPDATING_RECORD);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async createBrandDataBasic(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const brandCreate = await trademarksServices.createBrandDataBasic(body, file);
            if (brandCreate) {
                responses.success(req, res, brandCreate);
            } else {
                responses.error(req, res, ConstantsRS.ERROR_SAVING_RECORD);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    //#region TypeOfMark
    public async createTypeofmark(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const typeMark = await typeofmarksServices.createTypeofmark(body);
                    if (!typeMark.code) {
                        responses.success(req, res, typeMark);
                    } else {
                        responses.error(req, res, typeMark);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }
    public async getTypeofmarks(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /*  await middlewares.verifyToken(token).then(async rta => {
                 if (rta.success) { */
            const typeMark = await typeofmarksServices.getTypeofmarks();
            if (!typeMark.code) {
                responses.success(req, res, typeMark);
            } else {
                responses.error(req, res, []);
            }
            /*  } else {
                     responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                 }
             }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }
    public async getTypeofmarkByID(req: Request, res: Response) {
        try {
            const body = req.body.id;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const typeMark = await typeofmarksServices.getTypeofmarkByID(body);
            if (!typeMark.code) {
                responses.success(req, res, typeMark);
            } else {
                responses.error(req, res, typeMark);
            }
            /*  } else {
                     responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                 }
             }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }
    public async getTypeofmarkByName(req: Request, res: Response) {
        try {
            const body = req.body.name;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const typeMark = await typeofmarksServices.getTypeofmarkByName(body);
            if (!typeMark.code) {
                responses.success(req, res, typeMark);
            } else {
                responses.error(req, res, typeMark);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }
    }
    public async updateTypeofmark(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const typeMarkUpdated = await typeofmarksServices.updateTypeofmark(body);
                    if (!typeMarkUpdated.code) {
                        responses.success(req, res, typeMarkUpdated);
                    } else {
                        responses.error(req, res, typeMarkUpdated);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }
    public async deleteTypeofmark(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) {
                    const typeMark = await typeofmarksServices.deleteTypeofmark(body.id);
                    if (!typeMark.code) {
                        responses.success(req, res, typeMark);
                    } else {
                        responses.error(req, res, typeMark);
                    }
                } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            });
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
    //#endregion
}
export const trademarksController = new TrademarksController();