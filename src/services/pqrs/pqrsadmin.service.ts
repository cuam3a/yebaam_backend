import { brandPqrs, professionalPqrs, userPqrs } from './models';
import { ConstantsRS } from "../../utils/constants";
import PqrsCreator from "./pqrs.creator";
import { PetitionCreator } from "./types/petitions";
import { ClaimCreator } from "./types/claims";
import { ComplaintsCreator } from "./types/complaints";
import { SuggestionsCreator } from "./types/suggestions";

class PqrsadminService {

    private ClaimC = new ClaimCreator();
    private PetitionC = new PetitionCreator();
    private CompleintsC = new ComplaintsCreator();
    private SuggestionC = new SuggestionsCreator();

    public async responsePQRS(body: any) {

        let res, resError, pqrs;

        switch (parseInt(body.type)) {
            case 0:
                pqrs = await this.PetitionC.responsePQRS(body);
                break;
            case 1:
                pqrs = await this.ClaimC.responsePQRS(body);
                break;
            case 2:
                pqrs = await this.CompleintsC.responsePQRS(body);
                break;
            case 3:
                pqrs = await this.SuggestionC.responsePQRS(body);
                break;
        }

        if (!pqrs.code) {
            res = pqrs;
        } else {
            resError = pqrs;
        }

        return res ? res : resError;
    }

    public async getAll() {
        await this.getAllClaims().then(res => {
            console.log(res);
        }).catch(error => console.log(error));


        let claims = await this.getAllClaims();
        let petitions = await this.getAllPetitions();
        let compleints = await this.getAllCompleints();
        let suggestion = await this.getAllSuggestions();

        const pqrs = [];
        pqrs.push(...claims, ...petitions, ...compleints, ...suggestion);

        return pqrs
    }

    public async getByType(body: any) {
        let pqrs;

        switch (parseInt(body.type)) {
            case 0:
                pqrs = await this.getAllPetitions();
                break;
            case 1:
                pqrs = await this.getAllClaims();
                break;
            case 2:
                pqrs = await this.getAllCompleints();
                break;
            case 3:
                pqrs = await this.getAllSuggestions();
                break;
        }

        return pqrs
    }

    public async getAllPetitions() {
        let brand: any = [], user: any = [], professional: any = []
        let petitions: any = [];

        brand = await brandPqrs.petition.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        user = await userPqrs.petition.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        professional = await professionalPqrs.petition.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")

        petitions.push(...brand, ...user, ...professional);

        return petitions
    }

    public async getAllClaims() {
        let brand: any = [], user: any = [], professional: any = [];
        let claims = [];

        brand = await brandPqrs.claim.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        user = await userPqrs.claim.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        professional = await professionalPqrs.claim.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")

        claims.push(...brand, ...user, ...professional);

        return claims
    }

    public async getAllCompleints() {
        let res, resError;
        let brand: any = [], user: any = [], professional: any = [];
        let compleints = [];

        brand = await brandPqrs.complaint.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        user = await userPqrs.complaint.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        professional = await professionalPqrs.complaint.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")

        compleints.push(...brand, ...user, ...professional);

        return compleints
    }

    public async getAllSuggestions() {
        let brand: any = [], user: any = [], professional: any = [];
        let suggestions = [];

        brand = await brandPqrs.suggestion.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        user = await userPqrs.suggestion.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")
        professional = await professionalPqrs.suggestion.find({ $and: [{ isEnabled: true }, { reply: null }] }).populate("entityId")

        suggestions.push(...brand, ...user, ...professional);

        return suggestions
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

export const pqrsAdminService = new PqrsadminService();