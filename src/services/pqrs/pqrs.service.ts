import PqrsCreator from "./pqrs.creator";
import { ClaimCreator } from "./types/claims";
import { PetitionCreator } from "./types/petitions";
import { ComplaintsCreator } from "./types/complaints";
import { SuggestionsCreator } from "./types/suggestions";
import { ConstantsRS } from "../../utils/constants";
import { notificationsServices } from '../notifications/notifications.services';

class PqrsService {

    private ClaimC = new ClaimCreator();
    private PetitionC = new PetitionCreator();
    private CompleintsC = new ComplaintsCreator();
    private SuggestionC = new SuggestionsCreator();

    public async sendPqrs(body: any) {

        let res, resError;

        let type: any;

        let pqrs;

        switch (parseInt(body.type)) {
            case 0:
                pqrs = await this.PetitionC.createPQRS(body);
                break;
            case 1:
                pqrs = await this.ClaimC.createPQRS(body);
                break;
            case 2:
                pqrs = await this.CompleintsC.createPQRS(body);
                break;
            case 3:
                pqrs = await this.SuggestionC.createPQRS(body);
                break;
        }

        if (!pqrs.code) {
            res = pqrs;
            await notificationsServices.sendPqrsNotificationsAdmin(pqrs)
        } else {
            resError = pqrs;
        }

        return res ? res : resError;
    }

    public async getPqrs(body: any) {
        let claims = await this.ClaimC.getPQRSbyEntity(body);
        let petitions = await this.PetitionC.getPQRSbyEntity(body);
        let compleints = await this.CompleintsC.getPQRSbyEntity(body);
        let suggestions = await this.SuggestionC.getPQRSbyEntity(body);

        claims = claims.code ? [] : claims;
        petitions = petitions.code ? [] : petitions;
        compleints = compleints.code ? [] : compleints;
        suggestions = suggestions.code ? [] : suggestions;

        const pqrs = [];
        pqrs.push(...claims, ...petitions, ...compleints, ...suggestions);

        return pqrs
    }

    public async getPqrsByType(body: any) {

        let pqrs;

        switch (parseInt(body.type)) {
            case 0:
                pqrs = await this.PetitionC.getPQRSbyEntity(body);
                break;
            case 1:
                pqrs = await this.ClaimC.getPQRSbyEntity(body);
                break;
            case 2:
                pqrs = await this.CompleintsC.getPQRSbyEntity(body);
                break;
            case 3:
                pqrs = await this.SuggestionC.getPQRSbyEntity(body);
                break;
        }

        return pqrs

    }

    public async disablePQRS(body: any) {

        let res, resError;

        let type: PqrsCreator = new PetitionCreator();

        switch (parseInt(body.type)) {
            case 0:
                type = this.PetitionC;
                break;
            case 1:
                type = this.ClaimC;
                break;
            case 2:
                type = this.CompleintsC;
                break;
            case 3:
                type = this.SuggestionC;
                break;
        }

        const pqrs = await type.disablePQRS(body);

        if (!pqrs.code) {
            res = pqrs;
        } else {
            resError = pqrs;
        }

        return res ? res : resError;
    }
}

export const pqrsService = new PqrsService();