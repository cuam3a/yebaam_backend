import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { responses } from '../utils/response/response';
const skillModel = require('../../models/skills/skill.model');
import { skillService } from '../../services/Admin/skill/skill.service';
import { middlewares } from '../../middlewares/middleware';

class SkillCotroller {

    public async getAllSkill(req: Request, res: Response) {
        try {
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skills = await skillModel.find({});

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

    public async getSkillById(req: Request, res: Response) {
        try {
            const { id } = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skill = await skillService.getSkillById(id);
            responses.success(req, res, skill);
            /* } else {
                    responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
                }
            }); */
        } catch (error) {
            responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error })
        }

    }

    public async createSkill(req: Request, res: Response) {
        try {
            const { body } = req.body ? req : req;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillToSave = new skillModel(body);
            const skillSaved = await skillToSave.save();

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
            responses.error(req, res, { message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT, error: error })
        }

    }

    public async UpdateSkillById(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            await skillModel.updateOne({ _id: body.id }, body);
            const skillSaved = await skillModel.findOne({ _id: body.id });

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

    public async DeleteSkillById(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillSaved = await skillModel.findOneAndUpdate({ _id: body.id }, { isEnabled: false });

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

    public async DeleteSkillByIdAdmin(req: Request, res: Response) {
        try {
            const body = req.body;
            let token = req.headers.authorization ? req.headers.authorization : ''

            /* await middlewares.verifyToken(token).then(async rta => {
                if (rta.success) { */
            const skillSaved = await skillModel.deleteOne({ _id: body.id });

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

export const skillController = new SkillCotroller();