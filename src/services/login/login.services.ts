import moment from 'moment';
import { ConstantsRS } from '../../utils/constants';
import { similarServices } from '../similarservices/similar.services';
import { verificationCodeGenerator } from '../../controllers/utils/functions/verificationCode';
import { InfotoEmail } from '../../controllers/utils/interfaces/infoToEmail.interface';
import { sendEmail } from '../../controllers/utils/functions/sendEmail';
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');
const adminModel = require('../../models/admin/usersManagement/UserAdministrators.model');

class LoginServices {
    public async sendCode(body: any) {
        try {
            let model, otherModel, otherAccount, adminAccount

            switch (body.model) {
                case "user":
                    model = userModel
                    otherModel = trademarkModel
                    break;
                case "marks":
                    model = trademarkModel
                    otherModel = userModel
                    break;
                default:
                    model = userModel
                    otherModel = trademarkModel
                    break;
            }
            // validar si el registro existe
            const existEntity = await model.findOne({ email: body.email }).exec();

            //generate a verification code duration in minutes
            const verificationCodeToUser = verificationCodeGenerator.createCode(5);

            // info to send Email
            const infoVerificationToEmail: InfotoEmail = {
                email: body.email,
                code: verificationCodeToUser.code
            }

            if (existEntity) {
                if (existEntity.verification_code && existEntity.isEmailVerified) {
                    return {
                        error: {
                            ...ConstantsRS.THE_RECORD_ALREDY_EXISTS, email: body.email
                        },
                        success: false,
                        data: null
                    }
                } else {
                    if (existEntity.verification_code) { // Cuenta con propiedad de verificación
                        if (existEntity.verification_code && existEntity.verification_code.resendCode >= 2) {

                            if (existEntity.verification_code.nextSend && existEntity.verification_code.nextSend < moment().unix()) {

                                await model.updateOne({ email: body.email }, {
                                    verification_code: { ...verificationCodeToUser }
                                })

                                return this.sendEmailLocal(infoVerificationToEmail);

                            } else {

                                const nextSend = moment().add(3, 'minutes').unix();

                                await model.updateOne({ email: body.email }, {
                                    verification_code: { ...existEntity.verification_code, nextSend }
                                })

                                return {
                                    error: ConstantsRS.EXCEEDED_EMAIL_SENDED,
                                    success: false,
                                    data: { nextSend }
                                }
                            }

                        } else if (existEntity.verification_code.nextSend && existEntity.verification_code.nextSend > moment().unix()) {
                            return {
                                error: ConstantsRS.WAIT_A_MOMENT_TO_SEND_EMAIL,
                                success: false,
                                data: {
                                    nextSend: existEntity.verification_code.nextSend
                                }
                            }
                        } else {
                            let emailSended = 1;

                            if (existEntity.verification_code) {
                                emailSended = existEntity.verification_code.resendCode ? existEntity.verification_code.resendCode + 1 : 1;
                            }
                            await model.updateOne({ email: body.email }, {
                                verification_code: { ...verificationCodeToUser, resendCode: emailSended }
                            })

                            return this.sendEmailLocal(infoVerificationToEmail);
                        }
                    } else if (existEntity.verification_code == undefined && !existEntity.isEmailVerified) { // Cuenta sin propiedad de verificación y sin cuenta verificada
                        if (!existEntity.password) {
                            let rtaError, domain = existEntity.externalRegister.domain

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

                            return {
                                error: rtaError ? rtaError : null,
                                success: false,
                                data: null
                            }
                        }
                    } else if (existEntity.verification_code == undefined && existEntity.isEmailVerified) { // Cuenta sin propiedad de verificación y con cuenta verificada
                        let rtaError, domain = existEntity.externalRegister.domain

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

                        return {
                            error: rtaError ? rtaError : null,
                            success: false,
                            data: null
                        }
                        /* let emailSended = 1;

                        if (existEntity.verification_code) {
                            emailSended = existEntity.verification_code.resendCode ? existEntity.verification_code.resendCode + 1 : 1;
                        }
                        await model.updateOne({ email: body.email }, {
                            verification_code: { ...verificationCodeToUser, resendCode: emailSended }
                        })

                        sendEmailLocal(req, res, infoVerificationToEmail); */
                    }
                }
            } else {
                otherAccount = await otherModel.findOne({ email: body.email }).exec();
                adminAccount = await adminModel.findOne({ email: body.email }).exec();

                if (!otherAccount && !adminAccount) {
                    // Register to save
                    const userToSave = new model({
                        email: body.email,
                        verification_code: verificationCodeToUser
                    });

                    const userSaved = await userToSave.save();
                    if (userSaved) {
                        return this.sendEmailLocal(infoVerificationToEmail);
                    } else {
                        return {
                            error: ConstantsRS.ERROR_TO_SEND_EMAIL,
                            success: false,
                            data: null
                        }
                    }
                } else {
                    let rtaError
                    if (otherAccount != undefined) {
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
                    } else if (adminAccount != undefined) {
                        rtaError = ConstantsRS.MAIL_IN_USE
                    }

                    return {
                        error: rtaError,
                        success: false,
                        data: null
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return {
                error: { ...ConstantsRS.ERROR_TO_SEND_EMAIL, error },
                success: false,
                data: null
            }
        }
    }

    public async sendEmailLocal(infoVerificationToEmail: InfotoEmail) {
        let error: any = null, message: any = null, data: any = null
        const entity = await similarServices.identifyUserOrBrandByEmail(infoVerificationToEmail.email)
        if (entity) {
            message = `Se ha enviado un código de verificación al correo ${infoVerificationToEmail.email}`
            data = entity
        } else {
            error = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }
        return sendEmail.sendMail(infoVerificationToEmail)
            .then(() => {
                let dataReturn = {
                    error: error,
                    message: message,
                    data: data
                }

                return {
                    error: null,
                    success: true,
                    data: dataReturn
                }
            }).catch((err) => {
                return {
                    error: { ...ConstantsRS.ERROR_TO_SEND_EMAIL, err },
                    success: false,
                    data: null
                }
            });
    }
}

export const loginServices = new LoginServices()