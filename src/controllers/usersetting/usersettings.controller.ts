
import { Request, Response } from 'express';
import { userSettingsServices } from "../../services/usersettings/usersettings.service";
import { responses } from '../utils/response/response';
import { middlewares } from '../../middlewares/middleware';
import { ConstantsRS } from '../../utils/constants';

class UserSettingsController {
  public async createUserSettings(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
            const body = req.body
            const saveUserSettings = await userSettingsServices.createUserSettings(body)
            responses.success(req,res,saveUserSettings)
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
        responses.error(req, res, {
            message: ConstantsRS.ERROR_SAVING_RECORD,
            error: error,
          });
    }
  }

  public async modifyUserSettings(req: Request, res: Response) {
    try {
        let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
            const body = req.body
            const updateUserSettings = await userSettingsServices.modifyUserSettings(body)
            responses.success(req,res,updateUserSettings)
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
        responses.error(req, res, {
            message: ConstantsRS.ERROR_UPDATING_RECORD,
            error: error,
          });
    }
  }

  public async deleteUserSettings(req: Request, res: Response) {
    try {
        let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
            const body = req.body
            const deleteUserSettings = await userSettingsServices.deleteUserSettings(body)
            responses.success(req,res,deleteUserSettings)
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
        responses.error(req, res, {
            message: ConstantsRS.ERROR_TO_DELETE_REGISTER,
            error: error,
          });
    }
  }

  public async getUserSettingsByEntityId(req: Request, res: Response) {
    try {
        let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
            const body = req.body
            const getUserSettings = await userSettingsServices.getUserSettingsByEntityId(body)
            responses.success(req,res,getUserSettings)
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
        responses.error(req, res, {
            message: ConstantsRS.ERROR_FETCHING_RECORD,
            error: error,
          });
    }
  }
}

export const userSettingsController = new UserSettingsController();
