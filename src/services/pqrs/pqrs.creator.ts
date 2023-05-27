import { similarServices } from "../similarservices/similar.services";
import { notificationsServices } from "../notifications/notifications.services";
import { ConstantsRS } from "../../utils/constants";
import PQRS from "./types/pqres.interface";
import { notification } from '../../sockets/socket';

abstract class PqrsCreator {

    public abstract pqrs(): PQRS;

    public async createPQRS(body: any) {

        let res, resError;

        const models = this.pqrs().models();

        console.log(body.entityId);

        const sender = await similarServices.identifyUserBrandOrCommunity(body.entityId);

        let model, notify;

        switch (sender.type) {

            case 'user':
                model = models.user;
                break;

            case 'marks':
                model = models.brand;
                break;

            case 'professional':
                model = models.professional;
                break;

        }

        const pqrsToSave = new model(body);
        const pqrsSaved = await pqrsToSave.save();

        if (pqrsSaved) {
            const pqrsInfo = await model.findById(pqrsSaved.id);
            res = pqrsInfo;
        } else {
            resError = ConstantsRS.ERROR_SAVING_RECORD;
        }

        return res ? res : resError;


    }

    public async responsePQRS(body: any) {

        let res, resError, pqrsToUpdate, admin;

        const models = this.pqrs().models();

        try {

            const sender = await similarServices.identifyUserBrandOrCommunity(body.entityId);
            if (body.adminId != undefined) {
                admin = await similarServices.identifyUserBrandOrCommunity(body.adminId);
            }

            let model, notify, whoIsNotified, notification;

            switch (sender.type) {

                case 'user':
                    model = models.user;
                    whoIsNotified = 'U11'
                    notification = 'Notificaciones pqrs usuarios'
                    break;

                case 'marks':
                    model = models.brand;
                    whoIsNotified = 'M11'
                    notification = 'Notificaciones pqrs marcas'
                    break;

                case 'professional':
                    model = models.professional;
                    whoIsNotified = 'P11'
                    notification = 'Notificaciones pqrs profesionales'
                    break;
            }

            let pqrs = await model.findById(body.id);

            if (pqrs) {

                const filter = {
                    _id: body.id
                };

                const update = {
                    reply: body.reply,
                    status: 'Resolved',
                };

                pqrsToUpdate = await model.findOneAndUpdate(filter, update, {
                    new: true,
                });

                if (pqrsToUpdate) {

                    const pqrsInfo = await model.findById(pqrsToUpdate.id).populate('entityId');
                    res = pqrsInfo;

                    if (admin) {
                        notify = {
                            addressee: sender,
                            pqrs: res,
                            admin: admin,
                            notification: notification,
                            whoIsNotified: whoIsNotified
                        }
                        await notificationsServices.sendPqrsNotificationsAnyUser(notify);
                    }

                } else {
                    resError = ConstantsRS.ERROR_UPDATING_RECORD;
                }

            } else {
                resError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }

            return res ? res : resError;

        } catch (e) {
            console.log(e);
        }
    }

    public async disablePQRS(body: any) {
        let res, resError, pqrsToUpdate;

        const models = this.pqrs().models();

        try {

            const sender = await similarServices.identifyUserBrandOrCommunity(body.entityId);

            let model, notify;

            switch (sender.type) {

                case 'user':
                    model = models.user;
                    break;

                case 'marks':
                    model = models.brand;
                    break;

                case 'professional':
                    model = models.professional;
                    break;
            }

            let pqrs = await model.findById(body.id);

            if (pqrs) {

                pqrsToUpdate = await model.findOneAndUpdate(
                    { _id: body.id },
                    { isEnabled: false, status: 'Disabled', reply: body.reply },
                    { new: true }
                );

                if (pqrsToUpdate) {

                    const pqrsInfo = await model.findById(pqrsToUpdate.id).populate('entityId');
                    res = pqrsInfo;
                } else {
                    resError = ConstantsRS.ERROR_UPDATING_RECORD;
                }

            } else {
                resError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }

            return res ? res : resError;

        } catch (e) {
            console.log(e);
        }
    }

    public async getPQRSbyId(body: any) {
        let res, resError, pqrs;

        const models = this.pqrs().models();

        try {

            const sender = await similarServices.identifyUserBrandOrCommunity(body.entityId);

            switch (sender.type) {

                case 'user':
                    pqrs = models.user.find({ _id: body._id }).populate('entityId');
                    break;

                case 'marks':
                    pqrs = models.brand.find({ _id: body._id }).populate('entityId');
                    break;

                case 'professional':
                    pqrs = models.professional.find({ _id: body._id }).populate('entityId');
                    break;
            }

            if (pqrs) {
                res = pqrs;
            } else {
                resError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
            }

            return res ? res : resError;

        } catch (e) {

        }

    }

    public async getPQRSbyEntity(body: any) {
        let pqrs;

        const models = this.pqrs().models();

        try {
            const sender = await similarServices.identifyUserBrandOrCommunity(body.entityId);

            switch (sender.type) {

                case 'user':
                    pqrs = await models.user.find({ $and: [{ entityId: body.entityId }, { isEnabled: true }] }).populate('entityId');
                    break;

                case 'marks':
                    pqrs = await models.brand.find({ $and: [{ entityId: body.entityId }, { isEnabled: true }] }).populate('entityId');
                    break;

                case 'professional':
                    pqrs = await models.professional.find({ $and: [{ entityId: body.entityId }, { isEnabled: true }] }).populate('entityId');
                    break;
            }

            return pqrs
        } catch (e) {
            console.log(e);
        }
    }
}

export default PqrsCreator;