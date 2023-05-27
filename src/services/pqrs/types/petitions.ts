import PqrsCreator from "../pqrs.creator";
import PQRS from './pqres.interface';

const petitionUserModel = require('../../../models/pqrsuser/PetitionUser.model');
const petitionBrandModel = require('../../../models/pqrsbrand/PetitionBrand.model');
const petitionProfessionalModel = require('../../../models/pqrsprofessional/PetitionProfessional.model');

class Petitions implements PQRS {

    public models(): any {
        return {
            user: petitionUserModel,
            brand: petitionBrandModel,
            professional: petitionProfessionalModel,
        }
    }
}

export class PetitionCreator extends PqrsCreator {
    public pqrs(): PQRS {
        return new Petitions();
    }
}
