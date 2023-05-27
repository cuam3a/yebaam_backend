import { ConstantsRS } from '../../utils/constants';
import { notificationsServices } from '../../services/notifications/notifications.services';
import { similarServices } from '../similarservices/similar.services';
const socialProfessionalModel = require('../../models/socialprofessional/SocialProfessional.model')
const professionalProfileModel = require("../../models/professionalprofile/ProfessionalProfiles.model");
const notificationModel = require('../../models/notifications/NotificationsRequestsProfessionals.model')

class SocialProfessionalServices {
    //#region actions
    public async getSocialConnectionByIDSWithOutRes(req: any) {
        try {
            const SocialConnection = await socialProfessionalModel.findOne(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.firstID },
                                { secondID: req.secondID }
                            ]
                        },
                        {
                            $and: [
                                { firstID: req.secondID },
                                { secondID: req.firstID }
                            ]
                        }
                    ]
                }
            )

            return SocialConnection
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async sendFriendRequest(obj: any) {
        try {

            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (socialConnection.sendRequestFirst || socialConnection.sendRequestSecond) {
                    if (socialConnection.requestStatus) {
                        error = ConstantsRS.YOUR_APPLICATION_HAS_ALREADY_BEEN_ACCEPTED
                    } else {
                        error = ConstantsRS.I_ALREADY_SEND_REQUEST
                    }
                } else {
                    if (obj.firstID == socialConnection.firstID) {
                        const socialToSave = new socialProfessionalModel(socialConnection)
                        socialToSave.sendRequestFirst = true
                        socialToSave.cancelRequest = false
                        socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                        const notificationSend = new notificationModel()
                        notificationSend.senderID = socialConnection.firstID
                        notificationSend.addresseeID = socialConnection.secondID
                        notificationSend.socialProfessionalId = socialConnection.id
                        notificationSend.notification = 'Notificaciones por solicitud de contacto'
                        notificationSend.whoIsNotified = 'P14'
                        await notificationsServices.generateNotification(notificationSend)
                    } else {
                        const socialToSave = new socialProfessionalModel(socialConnection)
                        socialToSave.sendRequestSecond = true
                        socialToSave.cancelRequest = false
                        socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                        const notificationSend = new notificationModel()
                        notificationSend.senderID = socialConnection.secondID
                        notificationSend.addresseeID = socialConnection.firstID
                        notificationSend.socialProfessionalId = socialConnection.id
                        notificationSend.notification = 'Notificaciones por solicitud de contacto'
                        notificationSend.whoIsNotified = 'P14'
                        await notificationsServices.generateNotification(notificationSend)
                    }

                    if (socialSave.nModified == 1) {
                        message = "Solicitud de contactos enviada correctamente"
                        social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                    } else {
                        error = ConstantsRS.FAILED_ACTION
                    }
                }
            } else {
                const socialToSave = new socialProfessionalModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.sendRequestFirst = true
                socialSave = await socialToSave.save()
                const notificationSend = new notificationModel()
                notificationSend.senderID = obj.firstID
                notificationSend.addresseeID = obj.secondID
                notificationSend.socialProfessionalId = socialSave.id
                notificationSend.notification = 'Notificaciones por solicitud de contacto'
                notificationSend.whoIsNotified = 'P14'
                await notificationsServices.generateNotification(notificationSend)

                if (socialSave) {
                    message = "Solicitud de contactos enviada correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async acceptRequest(obj: any) {
        try {

            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.areContacts = true
                    socialToSave.requestStatus = true
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                    const notificationSend = new notificationModel()
                    notificationSend.senderID = socialConnection.secondID
                    notificationSend.addresseeID = socialConnection.firstID
                    notificationSend.socialProfessionalId = socialConnection.id
                    notificationSend.notification = 'Notificaciones por solicitud de contacto aceptada'
                    notificationSend.whoIsNotified = 'P15'
                    await notificationsServices.generateNotification(notificationSend)
                } else {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.areContacts = true
                    socialToSave.requestStatus = true
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                    const notificationSend = new notificationModel()
                    notificationSend.senderID = socialConnection.secondID
                    notificationSend.addresseeID = socialConnection.firstID
                    notificationSend.socialProfessionalId = socialConnection.id
                    notificationSend.notification = 'Notificaciones por solicitud de contacto aceptada'
                    notificationSend.whoIsNotified = 'P15'
                    await notificationsServices.generateNotification(notificationSend)
                }

                if (socialSave.nModified == 1) {
                    message = "Solicitud de contactos aceptada correctamente"
                    social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async cancelRequest(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = true
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                } else {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = true
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                }

                if (socialSave.nModified == 1) {
                    message = "Solicitud de contactos cancelada correctamente"
                    social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async removeContact(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                if (obj.firstID == socialConnection.firstID) {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.areContacts = false
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = false
                    socialToSave.requestStatus = false
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                } else {
                    const socialToSave = new socialProfessionalModel(socialConnection)
                    socialToSave.areContacts = false
                    socialToSave.sendRequestFirst = false
                    socialToSave.sendRequestSecond = false
                    socialToSave.cancelRequest = false
                    socialToSave.requestStatus = false
                    socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })
                }

                if (socialSave.nModified == 1) {
                    message = "Amigo eliminado correctamente"
                    social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                error = ConstantsRS.YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async blockContact(obj: any) {
        try {
            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                const socialToSave = new socialProfessionalModel(socialConnection)
                if (obj.firstID == socialConnection.firstID) {
                    socialToSave.isBlockerFirst = true
                } else {
                    socialToSave.isBlockerSecond = true
                }
                socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })

                if (socialSave.nModified == 1) {
                    message = "Usuario bloqueado correctamente"
                    social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                const socialToSave = new socialProfessionalModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.isBlockerFirst = true
                socialSave = await socialToSave.save()

                if (socialSave) {
                    message = "Usuario bloqueado correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async unblockContact(obj: any) {
        try {

            let socialSave, response = {}, message = null, error = null, social = null
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(obj)
            if (socialConnection) {
                const socialToSave = new socialProfessionalModel(socialConnection)
                if (obj.firstID == socialConnection.firstID) {
                    socialToSave.isBlockerFirst = false
                } else {
                    socialToSave.isBlockerSecond = false
                }
                socialSave = await socialProfessionalModel.updateOne({ _id: socialConnection.id }, socialToSave, { new: true })

                if (socialSave.nModified == 1) {
                    message = "Usuario desbloqueado correctamente"
                    social = await socialProfessionalModel.findById({ _id: socialConnection.id })
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            } else {
                const socialToSave = new socialProfessionalModel()
                socialToSave.firstID = obj.firstID
                socialToSave.secondID = obj.secondID
                socialToSave.isBlockerFirst = true
                socialSave = await socialToSave.save()

                if (socialSave) {
                    message = "Usuario desbloqueado correctamente"
                    social = socialSave
                } else {
                    error = ConstantsRS.FAILED_ACTION
                }
            }

            return response = {
                error: error,
                message: message,
                social: social
            }
        } catch (error) {
            console.log(error);
        }
    }
    //#endregion

    //#region connections socialprofessional
    public async getSocialConnections(req: any) {
        let rta, rtaError, success = false, response = {}
        switch (req.type) {
            case 1: // Contacts
                const socialFriends = await this.getSocialContacts(req)
                if (socialFriends.length > 0) {
                    rta = await this.separateUsers(socialFriends, req.idUser)
                    success = true
                    rta = await this.obtainSocialData(rta);
                    if (Object.keys(rta).length === 0) {
                        rtaError = ConstantsRS.NO_CONTACTS_FOUND
                    }
                } else {
                    rtaError = ConstantsRS.NO_CONTACTS_FOUND
                }
                break;
            case 2: // Bloqueados
                const socialBlocked = await this.getSocialBlocked(req)
                if (socialBlocked.length > 0) {
                    rta = await this.separateUsers(socialBlocked, req.idUser)
                    success = true
                    rta = await this.obtainSocialData(rta);
                    if (Object.keys(rta).length === 0) {
                        rtaError = ConstantsRS.NO_BLOCKED_FOUND
                    }
                } else {
                    rtaError = ConstantsRS.NO_BLOCKED_FOUND
                }
                break;
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        }
    }

    public async getSocialContacts(req: any) {
        try {
            const socialContacs = await socialProfessionalModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { areContacts: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { areContacts: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false }
                            ]
                        }
                    ]
                }
            )
            return socialContacs
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async getSocialBlocked(req: any) {
        try {
            const socialBlocked = await socialProfessionalModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { isBlockerFirst: true }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { isBlockerSecond: true }
                            ]
                        }
                    ]
                }
            )
            return socialBlocked
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async separateUsers(socialConnections: any, idUser: any) {
        let usersIDS: any = []
        socialConnections.filter((obj: any) => {
            if (obj.firstID == idUser) {
                usersIDS.push({ userID: obj.secondID, socialData: obj })
            } else if (obj.secondID == idUser) {
                usersIDS.push({ userID: obj.firstID, socialData: obj })
            }
        })
        return usersIDS
    }

    public async separateUsersPostsHome(socialConnections: any, id: string) {
        let iDS: any = []
        socialConnections.filter((obj: any) => {
            if (obj.firstID == id) {
                iDS.push(obj.secondID)
            } else if (obj.secondID == id) {
                iDS.push(obj.firstID)
            }
        })
        return iDS
    }

    public async obtainSocialData(socialUsers: any) {
        let obj: any = {}
        for await (let item of socialUsers) {
            let entityData = await professionalProfileModel.findOne({ $and: [{ _id: item.userID }, { isEnabled: true }] });
            if (entityData) {
                if (!entityData.code) {
                    let key = item.userID
                    obj[key] = { user: entityData, social: item.socialData }
                }
            }
        }
        return obj
    }
    //#endregion

    //#region get contacts request
    public async getContactsRequests(req: any) {
        const contactsRequests = await this.getContactsRequestsByID(req)
        let rta, rtaError, success = false, response = {}
        if (contactsRequests) {
            rta = await this.separateApplicants(contactsRequests, req.idUser)
            success = true
            rta = await this.obtainApplicantsData(rta);
            if (Object.keys(rta).length === 0) {
                rtaError = ConstantsRS.NO_CONTACTS_REQUEST
            }
        } else {
            success = true
            rtaError = ConstantsRS.NO_FRIEND_REQUEST
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        }
    }

    public async getContactsRequestsByID(req: any) {
        try {
            const friendRequests = await socialProfessionalModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.idUser },
                                { sendRequestSecond: true },
                                { requestStatus: false },
                                { cancelRequest: false }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.idUser },
                                { sendRequestFirst: true },
                                { requestStatus: false },
                                { cancelRequest: false }
                            ]
                        }
                    ]
                }
            )
            return friendRequests
        } catch (error) {
            console.log(error);
            return []
        }
    }

    public async obtainApplicantsData(socialUsers: any) {
        let obj: any = {}
        for await (let item of socialUsers) {
            let entityData = await similarServices.identifyUserBrandOrCommunity(item.userID)
            if (entityData) {
                if (!entityData.code) {
                    let key = item.userID
                    obj[key] = { _id: entityData._id, name: entityData.name, profilePicture: entityData.profilePicture }
                }
            }
        }
        return obj
    }

    public async separateApplicants(friendRequests: any, idUser: any) {
        let usersIDS: any = []
        friendRequests.filter((obj: any) => {
            if (obj.firstID == idUser) {
                usersIDS.push({ userID: obj.secondID })
            } else if (obj.secondID == idUser) {
                usersIDS.push({ userID: obj.firstID })
            }
        })
        return usersIDS
    }
    //#endregion

    //#region get connections count
    public async getSocialConnectionsCount(req: any) {
        let rta, rtaError, success = false

        const countFriends = await this.getCountContacts(req)
        success = true;

        rta = {
            "countContacts": countFriends,
        }

        return rta
        /* return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        } */
    }

    public async getCountContacts(req: any) {
        try {
            const countContacts = await socialProfessionalModel.find(
                {
                    $or: [
                        {
                            $and: [
                                { firstID: req.id },
                                { areContacts: true },
                                { isBlockerSecond: false }
                            ]
                        },
                        {
                            $and: [
                                { secondID: req.id },
                                { areContacts: true },
                                { isBlockerFirst: false }
                            ]
                        }
                    ]
                }
            )
            let cont = 0
            const ids = await this.separateUsersPostsHome(countContacts, req.id)
            for await (let user of ids) {
                const userIsEnabled = await similarServices.identifyUserBrandOrCommunity(user)
                if (userIsEnabled) {
                    cont += 1;
                }
            }
            return cont
        } catch (error) {
            console.log(error);
            return []
        }
    }

    //#endregion

    //#region methods for posts
    public async getSocialContactsForPosts(id: string) {
        try {
            const socialFriends = await socialProfessionalModel.find(
                {
                    $or: [
                        {
                            //Friendship connections
                            $and: [
                                { firstID: id },
                                { areContacts: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        },
                        {
                            //Friendship connections
                            $and: [
                                { secondID: id },
                                { areContacts: true },
                                { isBlockerFirst: false },
                                { isBlockerSecond: false },
                                { isEnabled: true }
                            ]
                        }

                    ]
                }
            )
            return socialFriends
        } catch (error) {
            console.log(error);
            return []
        }
    }
    //#endregion

    public async searchContacts(bodySearch: any) {

        let results: any = [], ids: any = [], entityId: any, contacts

        const entity = await similarServices.identifyUserBrandOrCommunity(bodySearch.entityId)

        if (entity) {
            entityId = entity.id
            contacts = await this.getSocialContacts({ idUser: entity.id })
            if (contacts.length > 0) {
                contacts.filter((obj: any) => {
                    if (obj.firstID == entityId) {
                        ids.push(obj.secondID)
                    } else if (obj.secondID == entityId) {
                        ids.push(obj.firstID)
                    }
                })

                for await (let id of ids) {
                    const getData = await similarServices.identifyUserOrBrandSearch(id, bodySearch.search)
                    if (getData) {
                        results.push(getData)
                    }
                }
            }
        }

        return results
    }

    public async getSocialConnectionsByEntityID(entityID: any) {
        let res, resError;

        const socialConnections = await socialProfessionalModel.find(
            {
                $or: [
                    { firstID: entityID },
                    { secondID: entityID }
                ]
            }
        );

        if (socialConnections) {
            res = socialConnections;
        } else {
            resError = ConstantsRS.NO_RECORDS;
        }

        return res ? res : resError;
    }

    public async disableSocialConnections(socialConnections: any) {
        socialConnections.forEach(async (social: any) => {
            await socialProfessionalModel.findOneAndUpdate({ _id: social.id }, { isEnabled: false }, { new: true })
        });
    }

    public async enableSocialConnections(socialConnections: any) {
        socialConnections.forEach(async (social: any) => {
            await socialProfessionalModel.findOneAndUpdate({ _id: social.id }, { isEnabled: true }, { new: true })
        });
    }

    public async getSocialConnectionByIDS(firstID: any, secondID: any) {

        let res, resError;
        const SocialConnection = await socialProfessionalModel.findOne(
            {
                $or: [
                    {
                        $and: [
                            { firstID: firstID },
                            { secondID: secondID },
                            { isEnabled: true }
                        ]
                    },
                    {
                        $and: [
                            { firstID: secondID },
                            { secondID: firstID },
                            { isEnabled: true }
                        ]
                    }
                ]
            }
        );

        if (SocialConnection) {
            res = SocialConnection;
        } else {
            resError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
        }

        return res ? res : resError;
    }

    public async canINotify(body: any){
        try {
            let rta = false
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    rta = socialConnection.disableNotificationsSecond
                } else {
                    rta = socialConnection.disableNotificationsFirst
                }
            }
            return rta
        } catch (error) {
            console.log(error);            
        }
    }

    public async disableNotificationsProfesional(body: any){
        try {
            let socialSave
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    if (socialConnection.disableNotificationsFirst != undefined && 
                        socialConnection.disableNotificationsSecond != undefined) { 
                            socialSave = await socialProfessionalModel.findOneAndUpdate({ _id: socialConnection.id }, {disableNotificationsFirst : body.enableOrDisable}, { new: true })                       
                    } else {
                        const socialToSave = new socialProfessionalModel(socialConnection)
                        socialToSave.disableNotificationsFirst = body.enableOrDisable
                        socialSave = await socialProfessionalModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    }
                } else {
                    if (socialConnection.disableNotificationsFirst != undefined && 
                        socialConnection.disableNotificationsSecond != undefined) { 
                            socialSave = await socialProfessionalModel.findOneAndUpdate({ _id: socialConnection.id }, {disableNotificationsSecond : body.enableOrDisable}, { new: true })                       
                    } else {
                        const socialToSave = new socialProfessionalModel(socialConnection)
                        socialToSave.disableNotificationsSecond = body.enableOrDisable
                        socialSave = await socialProfessionalModel.findOneAndUpdate({ _id: socialConnection.id }, socialToSave, { new: true })
                    }
                }
            }
            return socialSave
        } catch (error) {
            console.log(error);            
        }
    }

    public async getProfessionalNotificationsOptions(body: any){
        try {
            let rta = false
            const socialConnection = await this.getSocialConnectionByIDSWithOutRes(body)
            if (socialConnection) {
                if (body.firstID == socialConnection.firstID) {
                    rta = socialConnection.disableNotificationsFirst
                } else {
                    rta = socialConnection.disableNotificationsSecond
                }
            }
            return rta
        } catch (error) {
            console.log(error);            
        }
    }
}

export const socialProfessionalServices = new SocialProfessionalServices();