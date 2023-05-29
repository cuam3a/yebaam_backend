import { Request, Response } from 'express';
import moment from 'moment';
import { ConstantsRS } from '../../utils/constants';
import { InfotoEmail } from '../utils/interfaces/infoToEmail.interface';
import { verificationCodeGenerator } from '../utils/functions/verificationCode';
import { middlewares } from '../../middlewares/middleware';
const userModel = require('../../models/user/Users.model');
const usersAdministratorsModel = require('../../models/admin/usersManagement/UserAdministrators.model');
const trademarksModel = require('../../models/trademarks/Trademarks.model');
const bcrypt = require('bcrypt');
import { similarServices } from '../../services/similarservices/similar.services';
import { loginServices } from '../../services/login/login.services';
import { responses } from '../utils/response/response';
import { userServices } from '../../services/users/users.services';
import { trademarksServices } from '../../services/trademarks/trademarks.services';
import { socialServices } from '../../services/social/social.services';

class LoginController {
    public async loginEmailValidation(req: Request, res: Response) {
        try {
            const body = req.body
            let rta, rtaError, success = false, model, entityUpdated
            const users = await userModel.findOne({ email: body.email })
            if (users) {
                rta = users
                success = true
                model = userModel
            } else {
                const mark = await trademarksModel.findOne({ email: body.email }).populate({
                    path: 'currentLanding',
                    model: 'DataOfLandings',
                    match: { isEnabled: true },
                    populate: {
                        path: 'landingID',
                        model: 'Landings',
                        match: { isEnabled: true }
                    }
                })
                if (mark) {
                    rta = mark
                    success = true
                    model = trademarksModel
                } else {
                    const admin = await usersAdministratorsModel.findOne({ email: body.email })
                    if (admin) {
                        rta = admin
                        success = true
                        model = usersAdministratorsModel
                    } else {
                        rtaError = ConstantsRS.USER_DOES_NOT_EXIST
                    }
                }
            }

            if (rta != undefined) {
                if (rta.isBanned == false) { // Si no está baneado
                    if (rta.isEnabled) {
                        if (!rta.password) {
                            if (rta.externalRegister != undefined) { // Cuenta es externa sin una contraseña aún
                                let domain = rta.externalRegister.domain
                                if (rta.verification_code == undefined && rta.isEmailVerified == false) { // Cuenta sin propiedad de verificación y sin cuenta verificada
                                    switch (domain) {
                                        case 1:
                                            rtaError = ConstantsRS.ACCOUNT_FACEBOOK_PENDING
                                            break;
                                        case 2:
                                            rtaError = ConstantsRS.ACCOUNT_GOOGLE_PENDING
                                            break;
                                        case 3:
                                            rtaError = ConstantsRS.ACCOUNT_BOTH_PENDING
                                            break;
                                    }
                                } else if (rta.verification_code == undefined && rta.isEmailVerified == true) {
                                    switch (domain) {
                                        case 1:
                                            rtaError = ConstantsRS.ACCOUNT_FACEBOOK_REGISTER
                                            break;
                                        case 2:
                                            rtaError = ConstantsRS.ACCOUNT_GOOGLE_REGISTER
                                            break;
                                        case 3:
                                            rtaError = ConstantsRS.ACCOUNT_BOTH_REGISTER
                                            break;
                                    }
                                } else if (rta.verification_code != undefined && rta.isEmailVerified) {
                                    rtaError = ConstantsRS.EMAIL_WITH_PASS_CODE
                                }
                                res.status(200).send({
                                    error: rtaError ? rtaError : null,
                                    success: rtaError ? false : true,
                                    data: rta ? rta : null
                                });
                            } else { // Cuenta convencional sin contraseña aún
                                let params = {
                                    email: body.email,
                                    model: rta.type
                                }
                                const codeSent = await loginServices.sendCode(params)
                                res.send(codeSent)
                            }
                        }
                    } else {
                        entityUpdated = await model.findOneAndUpdate({ _id: rta.id }, { isEnabled: true }, { new: true })
                        if (entityUpdated) {
                            switch (entityUpdated.type) {
                                case "user":
                                    await userServices.actionsWhenRestoreUser(entityUpdated.id)
                                    break;
                                case "marks":
                                    await trademarksServices.actionsWhenRestoreBrand(entityUpdated.id)
                                    break;
                            }

                            rta = entityUpdated
                        }
                    }
                } else {
                    if (rta.isBanned == true && rta.isEnabled == true) {
                        let currentDate = moment()

                        if (rta.banEndDate != undefined) { // Si tiene baneo provisional
                            let banEndDate = rta.banEndDate

                            let stillBanned = currentDate.isBefore(banEndDate); // Determina si aún conserva el baneo
                            if (stillBanned == true) { // Sigue baneado
                                let remainingDays = currentDate.diff(banEndDate, 'days')
                                let remainingLeft = currentDate.diff(banEndDate, 'hours')
                                let minutesRemaining = currentDate.diff(banEndDate, 'minutes')
                                rta.banRemaining = {
                                    days: Math.abs(remainingDays),
                                    hours: Math.abs(remainingLeft),
                                    minutes: Math.abs(minutesRemaining)
                                }
                            } else { // Si el baneo ha culminado se habilita nuevamente la cuenta
                                entityUpdated = await model.findOneAndUpdate({ _id: rta.id }, { $unset: { banStartDate: null, banEndDate: null }, isBanned: false, bannedPosts: 0 }, { new: true })
                                if (entityUpdated) {
                                    switch (entityUpdated.type) {
                                        case "user":
                                            await userServices.actionsWhenRestoreUser(entityUpdated.id)
                                            break;
                                        case "marks":
                                            await trademarksServices.actionsWhenRestoreBrand(entityUpdated.id)
                                            break;
                                    }

                                    rta = entityUpdated
                                }
                            }
                        }

                    }
                }
                res.send({
                    error: rtaError ? rtaError : null,
                    success: success,
                    data: rta ? rta : []
                });
            } else {
                responses.error(req, res, rtaError)
            }
        } catch (error) {
            res.send({
                error: ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: false,
                data: []
            });
        }
    }

    public async loginPassswordValidation(req: Request, res: Response) {
        try {
            const body = req.body
            let rta, rtaError, token, success = false, socialConnectionsCount
            const users = await userModel.findOne({ email: body.email }).populate("rankID")
            if (users) {
                bcrypt.compareSync(body.password, users.password) ? rta = users : rtaError = ConstantsRS.INCORRECT_PASSWORD
                rtaError ? success = false : success = true
                rta ? token = await middlewares.createOnlyToken(users) : token
            } else {
                const mark = await trademarksModel.findOne({ email: body.email }).populate({
                    path: 'currentLanding',
                    model: 'DataOfLandings',
                    match: { isEnabled: true },
                    populate: {
                        path: 'landingID',
                        model: 'Landings',
                        match: { isEnabled: true }
                    }
                })
                if (mark) {
                    bcrypt.compareSync(body.password, mark.password) ? rta = mark : rtaError = ConstantsRS.INCORRECT_PASSWORD
                    rtaError ? success = false : success = true
                    socialConnectionsCount = await socialServices.getSocialConnectionsCount({id:mark.id})
                    rta ? token = await middlewares.createOnlyToken(mark) : token
                } else {
                    const admin = await usersAdministratorsModel.findOne({ email: body.email })
                    if (admin) {
                        //TODO encriptar password
                        bcrypt.compareSync(body.password, admin.password) ? rta = admin : rtaError = ConstantsRS.INCORRECT_PASSWORD
                        rtaError ? success = false : success = true
                        rta ? token = await middlewares.createOnlyToken(admin) : token
                    } else {
                        rtaError = ConstantsRS.USER_DOES_NOT_EXIST
                    }
                }
            }

            /* let hoy = new Date();
            let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
            let manana = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);
            if (token) {
                res.cookie('rsj', token?.refreshToken, { expires: manana, httpOnly: true, sameSite: 'none', secure: true })
            } */

            res.send({
                error: rtaError ? rtaError : null,
                success: success,
                token: token ? token.token : null,
                counters: socialConnectionsCount,
                data: rta ? rta : []
            });

        } catch (error) {
            res.send({
                error: ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: false,
                data: []
            });
        }
    }

    public async sendCodeToEmail(req: Request, res: Response) {
        try {
            const body = req.body;
            const codeSent = await loginServices.sendCode(body)
            res.send(codeSent)
        } catch (error) {
            console.log(error)
            res.status(404).send({
                error: { ...ConstantsRS.ERROR_TO_SEND_EMAIL, error },
                success: false,
                data: null
            });
        }
    }

    public async sendCodeToEmailResetPassword(req: Request, res: Response) {
        try {
            const body = req.body;
            if (body.email) {
                const emaliToVerify = await similarServices.identifyUserOrBrandByEmail(body.email)
                if (!emaliToVerify.code) {
                    let model
                    switch (emaliToVerify.type) {
                        case "user":
                            model = userModel
                            break;
                        case "marks":
                            model = trademarksModel
                            break;
                        case "admin":
                            model = usersAdministratorsModel
                            break;
                        default:
                            model = userModel
                            break;
                    }

                    // validar si el usuario existe 
                    const existUser = await model.findOne({ email: body.email }).exec();

                    //generate a verification code duration in minutes
                    const verificationCodeToUser = verificationCodeGenerator.createCode(5);

                    // info to send Email
                    const infoVerificationToEmail: InfotoEmail = {
                        email: body.email,
                        code: verificationCodeToUser.code
                    }

                    if (existUser) {

                        if (existUser.isEmailVerified) {

                            if (existUser.verification_code && existUser.verification_code.resendCode >= 2) {

                                if (existUser.verification_code.nextSend && existUser.verification_code.nextSend < moment().unix()) {

                                    await model.updateOne({ email: body.email }, {
                                        verification_code: { ...verificationCodeToUser }
                                    })

                                    const sendedEmail = await loginServices.sendEmailLocal(infoVerificationToEmail);
                                    res.send(sendedEmail)
                                } else {

                                    const nextSend = moment().add(3, 'minutes').unix();

                                    await model.updateOne({ email: body.email }, {
                                        verification_code: { ...existUser.verification_code, nextSend }
                                    })

                                    res.status(200).send({
                                        error: ConstantsRS.EXCEEDED_EMAIL_SENDED,
                                        success: false,
                                        data: { nextSend }
                                    });
                                }

                            } else if (existUser.verification_code && existUser.verification_code.nextSend && existUser.verification_code.nextSend > moment().unix()) {
                                res.status(200).send({
                                    error: ConstantsRS.WAIT_A_MOMENT_TO_SEND_EMAIL,
                                    success: false,
                                    data: {
                                        nextSend: existUser.verification_code.nextSend
                                    }
                                });
                            } else {

                                let emailSended = 1;

                                if (existUser.verification_code) {
                                    emailSended = existUser.verification_code.resendCode ? existUser.verification_code.resendCode + 1 : 1;
                                }
                                await model.updateOne({ email: body.email }, {
                                    verification_code: { ...verificationCodeToUser, resendCode: emailSended }
                                })

                                const sendedEmail = await loginServices.sendEmailLocal(infoVerificationToEmail);
                                res.send(sendedEmail)
                            }

                        } else {
                            res.status(200).send({
                                error: ConstantsRS.VERIFICATION_PROBLEMS,
                                success: false,
                                data: null
                            });
                        }
                    }
                    else {
                        res.status(200).send({
                            error: ConstantsRS.USER_DOES_NOT_EXIST,
                            success: false,
                            data: null
                        });

                    }
                } else {
                    res.status(200).send({
                        error: ConstantsRS.USER_DOES_NOT_EXIST,
                        success: false,
                        data: null
                    });
                }
            } else {
                res.status(200).send({
                    error: ConstantsRS.EMAIL_IS_NECESSARY,
                    success: false,
                    data: ''
                });
            }


        } catch (error) {
            res.status(404).send({
                error: { ...ConstantsRS.ERROR_TO_SEND_EMAIL, error },
                success: false,
                data: null
            });
        }
    }

    public async codeVerification(req: Request, res: Response) {
        try {
            console.log(req.body)
            const body = req.body;

            if (body.email) {
                const emaliToVerify = await similarServices.identifyUserOrBrandByEmail(body.email)
                if (!emaliToVerify.code) {
                    let model
                    switch (emaliToVerify.type) {
                        case "user":
                            model = userModel
                            break;
                        case "marks":
                            model = trademarksModel
                            break;
                        case "admin":
                            model = usersAdministratorsModel
                            break;
                        default:
                            model = userModel
                            break;
                    }

                    const codeVerification = await similarServices.validateCodeFromEmail(body, emaliToVerify)
                    if (codeVerification.success) {
                        await model.updateOne({ email: body.email }, {
                            verification_code: { ...emaliToVerify.verification_code, isVerified: true }
                        })

                        res.status(200).send({
                            error: null,
                            success: true,
                            data: "Verificación existosa"
                        });
                    } else {
                        res.status(200).send(codeVerification);
                    }
                } else {
                    res.status(200).send({
                        error: ConstantsRS.THERE_IS_NO_VERIFICATION_CODE,
                        success: false,
                        data: null
                    });
                }

            } else {

                res.status(200).send({
                    error: ConstantsRS.EMAIL_IS_NECESSARY,
                    success: false,
                    data: ''
                });
            }

        } catch (error) {

            res.status(404).send({
                error: { ...ConstantsRS.SERVER_ERROR, error },
                success: false,
                data: null
            });
        }

    }

    // change password
    public async changePassword(req: Request, res: Response) {
        try {
            const body = req.body
            let rta, rtaError, success = false;
            let model = userModel;

            let userToModificate = await userModel.findOne({ email: body.email });

            if (!userToModificate) { //if not exist user
                userToModificate = await trademarksModel.findOne({ email: body.email }); //search on mark
                model = trademarksModel;

                if (!userToModificate) { //if not exist on mark
                    userToModificate = await usersAdministratorsModel.findOne({ email: body.email }); //search user admin
                    model = usersAdministratorsModel;

                    if (!userToModificate) { //if not exist user admin user not exist
                        rtaError = ConstantsRS.USER_DOES_NOT_EXIST;
                    }
                }
            }

            if (userToModificate && bcrypt.compareSync(body.password, userToModificate.password)) {

                //create object to update
                const update = await model.updateOne({ _id: userToModificate._id }, { password: bcrypt.hashSync(body.newPassword, 10) });
                if (update) {
                    success = true;
                    rta = `usuario actualizado correctamente ${body.email}`
                }

            } else {
                rtaError = ConstantsRS.INCORRECT_PASSWORD
            }

            if (rta) {
                responses.success(req, res, rta);
            } else {
                responses.error(req, res, rtaError);
            }
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_SAVING_RECORD, error: error });
        }
    }

    public async otherchangePassword(req: Request, res: Response) {
        try {
            const body = req.body
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let rta, rtaError, success = false;
            let model = userModel;

            let userToModificate = await userModel.findOne({ _id: body.entityID });

            if (!userToModificate) { //if not exist user
                userToModificate = await trademarksModel.findOne({ _id: body.entityID }); //search on mark
                model = trademarksModel;

                if (!userToModificate) { //if not exist on mark
                    userToModificate = await usersAdministratorsModel.findOne({ _id: body.entityID }); //search user admin
                    model = usersAdministratorsModel;

                    if (!userToModificate) { //if not exist user admin user not exist
                        rtaError = ConstantsRS.USER_DOES_NOT_EXIST;
                    }
                }
            }

            if (userToModificate && bcrypt.compareSync(body.password, userToModificate.password)) {

                //create object to update
                const update = await model.updateOne({ _id: userToModificate._id }, { password: bcrypt.hashSync(body.newPassword, 10) });
                if (update) {
                    success = true;
                    rta = `usuario actualizado correctamente ${body.email}`
                }

            } else {
                rtaError = ConstantsRS.INCORRECT_PASSWORD
            }

            if (rta) {
                responses.success(req, res, rta);
            } else {
                responses.error(req, res, rtaError);
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            res.send({
                error: ConstantsRS.FAILED_TO_FETCH_RECORDS,
                success: false,
                data: []
            });
        }
    }

    public async sendEmailLocal(req: Request, res: Response, infoVerificationToEmail: InfotoEmail) {
        try {
            const emailSent = await loginServices.sendCode(infoVerificationToEmail)
            res.send(emailSent)
        } catch (error) {
            console.log(error)
        }
    }

    public async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const login = await loginServices.loginUserService({email,password});
            console.log(login)
            res.send(login)
        } catch (error) {
            console.log(error)
        }
    }
}

/* const sendEmailLocal = (req: Request, res: Response, infoVerificationToEmail: InfotoEmail) => {
    try {
        const emailSent = await loginServices.sendCode(infoVerificationToEmail)
    } catch (error) {
        console.log(error)
    }

    sendEmail.sendMail(infoVerificationToEmail)
        .then(() => {

            res.status(200).send({
                error: null,
                success: true,
                data: `Se ha enviado un código de verificación al correo ${infoVerificationToEmail.email} `
            });

        }).catch((err) => {

            res.status(404).send({
                error: { ...ConstantsRS.ERROR_TO_SEND_EMAIL, err },
                success: false,
                data: null
            });
        });
} */

export const loginController = new LoginController();