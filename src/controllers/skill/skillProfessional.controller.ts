import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
const skillProfessionalModel = require('../../models/skills/skillProfessional.model');
const skillModel = require('../../models/skills/skill.model');
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';

class SkillCotroller {

    public async getAllSkillProfessional(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skills = await skillProfessionalModel.find({});

            if (req.body) {
                responses.success(req, res, skills);
            } else {
                return skills;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getAllSkillProfessionalById(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let skills = await skillProfessionalModel.find({ professionalID: req.body.id, isEnabled: true }, { description: 1, skill: 1 });
            // .populate({ path: 'skills', select: 'name' });

            // skills = skills.map((skillObject: any) => {
            //     return { _id: skillObject._id, description: skillObject.description, name: skillObject.skills }
            // })

            if (req.body) {
                responses.success(req, res, skills);
            } else {
                return skills;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async getAllSkillProfessionalBySkillId(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            let skills = await skillProfessionalModel.find({ _id: req.body.skillId, isEnabled: true }, { description: 1, skill: 1 });
            // .populate({ path: 'skills', select: 'name' });

            // skills = skills.map((skillObject: any) => {
            //     return { _id: skillObject._id, description: skillObject.description, name: skillObject.skills }
            // })

            if (req.body) {
                responses.success(req, res, skills);
            } else {
                return skills;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error })
        }
    }

    public async createSkillProfessional(req: Request, res: Response) {
        try {
            const { body } = req.body ? req : req;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            // skill is saved
            let skillSaved = skillModel.find({ skill: body.skill, isEnabled: true })[0];
            let skillProfessionalSaved: any = {};

            if (!skillSaved) {
                // save the skill
                const skillToSave = new skillModel({ skill: body.skill });
                skillSaved = await skillToSave.save();
            }

            const skillProfessionalToSaved = new skillProfessionalModel({ ...body, skill: body.skill });
            skillProfessionalSaved = await skillProfessionalToSaved.save();

            if (req.body) {
                responses.success(req, res, skillProfessionalSaved);
            } else {
                return skillProfessionalSaved;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT, error: error })
        }
    }

    public async UpdateSkillProfessionalById(req: Request, res: Response) {
        try {
            const body = req.body ? req.body : req;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillSaved = await skillProfessionalModel.findOneAndUpdate({ _id: body.skillId }, body);

            if (req.body) {
                responses.success(req, res, skillSaved);
            } else {
                return skillSaved;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async DeleteSkillProfessionalById(req: Request, res: Response) {
        try {
            const { body } = req.body ? req : req;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillSaved = await skillProfessionalModel.findOneAndUpdate({ _id: body.id }, { isEnabled: false });

            if (req.body) {
                responses.success(req, res, skillSaved);
            } else {
                return skillSaved;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error })
        }
    }

    public async DeleteSkillProfessionalByIdAdmin(req: Request, res: Response) {
        try {
            const { body } = req.body ? req : req;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillSaved = await skillProfessionalModel.deleteOne({ _id: body.id });

            if (req.body) {
                responses.success(req, res, skillSaved);
            } else {
                return skillSaved;
            }
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error })
        }
    }
}

export const skillProfessionalController = new SkillCotroller();