import { Request, Response } from 'express';

const userModel = require('../../models/user/Users.model');
const trademarksModel = require('../../models/trademarks/Trademarks.model');
const adminModel = require('../../models/admin/usersManagement/UserAdministrators.model')
const bcrypt = require('bcrypt');

// interfaces
import { Credentials } from '../utils/interfaces/credentialType.interface';

// classes
import { ConstantsRS } from '../../utils/constants';
import { userServices } from '../../services/users/users.services';
import { similarServices } from '../../services/similarservices/similar.services';
import { middlewares } from '../../middlewares/middleware';
import { trademarksServices } from '../../services/trademarks/trademarks.services';
import { responses } from '../utils/response/response'

class UserController {
    public async manageExternalUser(req: any, res: Response) {
        try {
            const body = req.body
            const file = req.files
            let model, otherModel, adminExist, entityUpdated, login: any
            switch (body.model) {
                case "user":
                    model = userModel
                    otherModel = trademarksModel
                    break;
                case "marks":
                    model = trademarksModel
                    otherModel = userModel
                    break;
                default:
                    model = userModel
                    otherModel = trademarksModel
                    break;
            }

            let newDomain = parseInt(req.body.domain)
            let newID = null
            let newEmail = ""
            let userDomain = 0
            let credentials: Credentials = {
                type: 0,
                credential: ""
            }
            let hoy = new Date();
            let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
            let manana = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);

            if (body.email != null) {
                adminExist = await adminModel.findOne({ email: body.email })
            }

            if (adminExist == null) { // Si existe un administrador con el correo
                if (body.idCredential != null) { // Llega id pero no email
                    newID = body.idCredential
                    credentials = {
                        type: 2,
                        credential: newID
                    }
                    var registeredAccount = await model.findOne({ idCredential: newID }).exec();
                } else { // Llega email pero no id
                    newEmail = body.email
                    credentials = {
                        type: 1,
                        credential: newEmail
                    }
                    var registeredAccount = await model.findOne({ email: newEmail }).exec();
                }

                if (registeredAccount) { // Si existe un usuario o marca con alguna de las credenciales
                    if (registeredAccount.isEnabled) {
                        userDomain = registeredAccount.externalRegister != undefined ? registeredAccount.externalRegister.domain : 4
                        if ((userDomain !== newDomain) && (userDomain !== 3)) { // Si la cuenta existente no tiene el mismo dominio
                            const update = await similarServices.updateExternalAccount(newEmail, body.model)
                            res.send(update);
                        } else { // Si la cuenta existente y tiene el mismo dominio o ambos (Logueo inmediato)
                            if (registeredAccount.isDataVerified) {
                                login = await similarServices.loginExternalAccount(credentials, body.model)
                                if (login.token) {
                                    res.cookie('rsj', login.token?.refreshToken, {  expires: manana, httpOnly: true, sameSite: 'none', secure: true })
                                    login.token = login.token.token
                                }
                                res.send(login);
                            } else if (body.isDataVerified) { // Verificación de datos
                                try {
                                    await similarServices.updateAccountDataExternal(body, credentials)
                                        .then(async () => {
                                            if (registeredAccount.type == "marks") {
                                                const brandCreate = await trademarksServices.createBrandDataBasic(body, file)
                                            }
                                            login = await similarServices.loginExternalAccount(credentials, body.model)
                                            if (login.token) {
                                                res.cookie('rsj', login.token?.refreshToken, { expires: manana, httpOnly: true, sameSite: 'none', secure: true })
                                                login.token = login.token.token
                                            }
                                            res.send(login);
                                        })

                                } catch (error) {
                                    responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
                                }
                            } else {
                                res.send({
                                    error: ConstantsRS.ACCOUNT_DATA_PENDING,
                                    success: false,
                                    data: registeredAccount
                                })
                            }
                        }
                    } else {
                        entityUpdated = await model.findOneAndUpdate({ _id: registeredAccount.id }, { isEnabled: true }, { new: true })
                        if (entityUpdated) {
                            switch (entityUpdated.type) {
                                case "user":
                                    await userServices.actionsWhenRestoreUser(entityUpdated.id)
                                    break;
                                case "marks":
                                    await trademarksServices.actionsWhenRestoreBrand(entityUpdated.id)
                                    break;
                            }

                            login = await similarServices.loginExternalAccount(credentials, body.model)
                            if (login.token) {
                                res.cookie('rsj', login.token?.refreshToken, { expires: manana, httpOnly: true, sameSite: 'none', secure: true })
                                login.token = login.token.token
                            }
                            res.send(login);
                        }
                    }
                } else { // Si se crea un nuevo usuario
                    let otherAccount
                    if (body.idCredential != null) { // Llega id pero no email
                        otherAccount = await otherModel.findOne({ idCredential: newID }).exec();
                    } else { // Llega email pero no id
                        otherAccount = await otherModel.findOne({ email: newEmail }).exec();
                    }

                    if (!otherAccount) { // Si no existe cuenta en la otra colección 
                        const register: any = await similarServices.createExternalAccount(body)
                        res.send(register);
                    } else {
                        let rtaError
                        switch (otherAccount.type) {
                            case "user":
                                rtaError = ConstantsRS.EMAIL_WITH_USER
                                break;
                            case "marks":
                                rtaError = ConstantsRS.EMAIL_WITH_BRAND
                                break;
                            default:
                                rtaError = ConstantsRS.EMAIL_WITH_USER
                                break;
                        }

                        responses.error(req, res, rtaError);
                    }
                }
            } else {
                responses.error(req, res, ConstantsRS.MAIL_IN_USE);
            }
        } catch (error) {
            responses.error(req, res, ConstantsRS.ERROR_SAVING_RECORD);
        }
    }

    public async createUser(req: Request, res: Response) {
        try {
            let body = req.body, token
            const userToRegister = await userModel.findOne({ email: body.email }).exec();

            if (userToRegister) {
                if (userToRegister.verification_code) {
                    if (userToRegister.verification_code.isVerified) {
                        // save _id user to create albums default, profile photos
                        body = { ...body, userID: userToRegister._id }
                        const verify: any = await similarServices.verifyUpdPassAccount(body, userToRegister.type)
                        verify ? token = await middlewares.createOnlyToken(verify) : token
                        /* let hoy = new Date();
                        let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
                        let manana = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);
                        if (token) {
                            res.cookie('rsj', token?.refreshToken, { expires: manana, httpOnly: true, sameSite: 'none', secure: true })
                        } */
                        verify.token = token ? token.token : null
                        res.send(verify);

                    } else {
                        responses.error(req, res, ConstantsRS.EMAIL_IS_NOT_VERIFY);
                    }

                } else if (userToRegister.externalRegister && userToRegister.externalRegister.domain) { //si se registra con gmail o facebook
                    const verify = await similarServices.verifyUpdPassAccount(body, userToRegister.type)
                    res.send(verify);

                } else {
                    responses.error(req, res, ConstantsRS.REPEAT_PROCESS_CODE);
                }
            } else {
                responses.error(req, res, ConstantsRS.REPEAT_PROCESS_CODE);
            }

        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error })
        }
    }

    public async resetPassword(req: Request, res: Response) {
        try {
            const body = req.body
            let user
            const userToUpdate = await userModel.findOne({ email: req.body.email }).exec();
            if (userToUpdate) {
                user = userToUpdate
            } else {
                const userToUpdate2 = await trademarksModel.findOne({ email: req.body.email }).exec();
                if (userToUpdate2) {
                    user = userToUpdate2
                } else {
                    const userToUpdate3 = await adminModel.findOne({ email: req.body.email }).exec();
                    if (userToUpdate3) {
                        user = userToUpdate3
                    }
                }
            }

            if (user) {
                const codeVerification = await similarServices.validateCodeFromEmail(body, userToUpdate)
                if (codeVerification.success) {
                    if (userToUpdate.isEmailVerified) {
                        const update = await similarServices.changePassword(body, userToUpdate.type)
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
        } catch (error) {
            responses.error(req, res, ConstantsRS.ERROR_SAVING_RECORD);
        }
    }

    public async getallUsers(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const users = await userModel.find({})
            responses.success(req, res, users);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async updateUserByEmail(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const dataToUpdate = req.body.password ? {
                ...req.body, password: bcrypt.hashSync(req.body.password, 10),
                verification_code: {}
            } : req.body;

            const userUpdate = await userModel.updateOne({ email: body.email }, dataToUpdate);
            responses.success(req, res, userUpdate);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async updateUserById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body;
            const dataToUpdate = req.body.password ? {
                ...req.body, password: bcrypt.hashSync(req.body.password, 10),
                verification_code: {}
            } : req.body;

            const userUpdate = await userModel.updateOne({ _id: body.id }, dataToUpdate);
            responses.success(req, res, userUpdate);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async getUserByEmail(req: Request, res: Response) {
        try {
            const user = await userModel.findOne({ email: req.body.email }).exec()
            responses.success(req, res, user);
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getUserById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const body = req.body
            let infoUser = await userServices.getInfoUser(body)
            /* const user = await userModel.findOne({ _id: body.id })
                .populate('entityRankID')
                .populate('rankID')

            let socialConnectionsCount = await socialServices.getSocialConnectionsCount(body)

            response = {
                user: user,
                counters: socialConnectionsCount
            } */

            responses.success(req, res, infoUser);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getUserByIdPopulate(req: Request, res: Response) {

        try {

            const user = await userModel.findOne({ _id: req.params.idUser })
                .populate('professionalProfileID')
                .populate('albumsIDS')
                .populate('socialIDS')
                .populate('roleInTheCommunityID')
                .populate('entityRankID')
                .populate('rankID')
            res.send({
                error: null,
                success: true,
                data: user
            });

        } catch (error) {
            res.send({
                error: { ...ConstantsRS.FAILED_TO_FETCH_RECORDS, error },
                success: false,
                data: null
            });
        }
    }

    public async deleteUserById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const id = req.body.id;
            await userModel.updateOne({ _id: id }, { isEnabled: false }, async (error: any) => {
                if (error) {
                    responses.error(req, res, ConstantsRS.ERROR_TO_DELETE_REGISTER);
                } else {
                    await userServices.actionsWhenDeletingUser(req.body.id)
                    responses.success(req, res, 'Usuario eliminado satisfactoriamente');
                }
            })
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */

        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async deleteUserByIdOnlyDev(req: Request, res: Response) {
        try {
            const id = req.body.id;

            await userModel.deleteOne({ _id: id }, (error: any) => {
                if (error) {
                    res.send({
                        error: { ...ConstantsRS.ERROR_TO_DELETE_REGISTER, error },
                        success: false,
                        data: null
                    });
                } else {
                    res.status(200).send({
                        error: null,
                        success: true,
                        data: 'Usuario eliminado satisfactoriamente'
                    });
                }
            })
        } catch (error) {
            res.send({
                error: { ...ConstantsRS.FAILED_TO_FETCH_RECORDS, error },
                success: false,
                data: null
            });
        }
    }

    public async updateUserPrivacy(req: Request, res: Response) {

        try {
            const body = req.body;
            const userUpdate = await userServices.updatePrivacy(body);
            responses.success(req, res, userUpdate);
        } catch (error) {
            responses.error(req, res, { ...ConstantsRS.CANNOT_UPDATE_RECORD, error });
        }

    }

    // public async uploadimages(req: any, res: Response) {
    //     try {
    //         let token = req.headers.authorization ? req.headers.authorization : ''

    //         /* await middlewares.verifyToken(token).then(async rta => {
    //              if (rta.success) {*/
    //         uploadFiles.uploadimages(req, res)
    //         /*     } else {
    //                 res.send({
    //                     error: ConstantsRS.UNAUTHORIZED_ACCESS,
    //                     success: false,
    //                     data: []
    //                 })
    //             }
    //         }); */
    //     } catch (error) {
    //         res.send({
    //             error: { ...ConstantsRS.ERROR_UPLOAD_FILE, error },
    //             success: false,
    //             data: null
    //         });
    //     }
    // }
}


export const userController = new UserController();