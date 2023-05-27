import PqrsCreator from "../pqrs.creator";
import PQRS from './pqres.interface';

const complaintsUserModel = require('../../../models/pqrsuser/ComplaintUser.model');
const complaintsBrandModel = require('../../../models/pqrsbrand/ComplaintBrand.model');
const complaintsProfessionalModel = require('../../../models/pqrsprofessional/ComplaintProfessional.model');

class Complaints implements PQRS {

    public models(): any {
        return {
            user: complaintsUserModel,
            brand: complaintsBrandModel,
            professional: complaintsProfessionalModel,
        }
    }
}

export class ComplaintsCreator extends PqrsCreator {
    public pqrs(): PQRS {
        return new Complaints();
    }
}