import { ConstantsRS } from "../../../utils/constants";

const skillModel = require('../../../models/skills/skill.model');

class SkillService {

    public async getSkillById(id: string) {

        const skill = await skillModel.findOne({ _id: id });
        if(!skill) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return skill;
    }

}

export const skillService = new SkillService();