import PqrsCreator from "../pqrs.creator";
import PQRS from './pqres.interface';

const suggestionUserModel = require('../../../models/pqrsuser/SuggestionUser.model');
const suggestionBrandModel = require('../../../models/pqrsbrand/SuggestionBrand.model');
const suggestionProfessionalModel = require('../../../models/pqrsprofessional/SuggestionProfessional.model');

class Suggestions {
    public models(): any {
        return {
            user: suggestionUserModel,
            brand: suggestionBrandModel,
            professional: suggestionProfessionalModel,
        }
    }
}

export class SuggestionsCreator extends PqrsCreator {
    public pqrs(): PQRS {
        return new Suggestions();
    }
}