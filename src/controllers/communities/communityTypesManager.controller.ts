import { Request, Response } from "express";
import { communityTypeManagerService } from "../../services/communities/communityTypeManager.service";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class CommunityTypesManagerController {
  public async createTypeCommunityManager(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeManager = await communityTypeManagerService.createManagerName(
            body
          );
          responses.success(req, res, typeManager);
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT,
        error: error,
      });
    }
  }

  public async updateTypeCommunityManager(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const updateManager = await communityTypeManagerService.editManagerName(
            id,
            body
          );
          responses.success(req, res, updateManager);
       /*  } else {
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

  public async deleteTypeCommunityManager(req: Request, res: Response) {
    try {
      const { id } = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const managerDelete = await communityTypeManagerService.deleteManagerName(
            id
          );
          if (managerDelete.code == undefined) {
            responses.success(req, res, managerDelete);
          } else {
              responses.error(req, res, managerDelete);
          }
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

  public async getTypeCommunityManagerById(req: Request, res: Response) {
    try {
      const { id } = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeManager = await communityTypeManagerService.getManagerNameById(
            id
          );
          responses.success(req, res, typeManager);
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

  public async getAllActiveTypeCommunityManager(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeManager = await communityTypeManagerService.getAllManagerName();
          responses.success(req, res, typeManager);
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.FAILED_TO_FETCH_RECORDS,
        error: error,
      });
    }
  }

  public async getAllInActiveTypeCommunityManager(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const typeManager = await communityTypeManagerService.getAllInactiveManagerName();
          responses.success(req, res, typeManager);
        /* } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.FAILED_TO_FETCH_RECORDS,
        error: error,
      });
    }
  }
}
export const communityTypesManagerController = new CommunityTypesManagerController();
