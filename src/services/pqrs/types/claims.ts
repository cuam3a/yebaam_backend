import PqrsCreator from "../pqrs.creator";
import PQRS from './pqres.interface';

const claimsUserModel = require('../../../models/pqrsuser/ClaimUser.model');
const claimsBrandModel = require('../../../models/pqrsbrand/ClaimBrand.model');
const claimsProfessionalModel = require('../../../models/pqrsprofessional/ClaimProfessional.model');

class Claims implements PQRS{

    public models(): any {
        return {
            'user': claimsUserModel,
            'brand': claimsBrandModel,
            'professional': claimsProfessionalModel,
        }
    }
}

export class ClaimCreator extends PqrsCreator {
    public pqrs(): PQRS {
        return new Claims();
    }
}