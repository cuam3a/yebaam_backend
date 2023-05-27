import { Request, Response } from "express";
import { permissionRankService } from "../../../services/Admin/permissionRanks/permissionRank.service";
import { ConstantsRS } from "../../../utils/constants";
import { responses } from "../../utils/response/response";
import { middlewares } from "../../../middlewares/middleware";

class PermissionRankController {
  public async createPermissionRank(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const permissionSave = await permissionRankService.createPermissionRank(
            body
          );
          responses.success(req, res, permissionSave);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT,
        error: error,
      });
    }
  }

  public async updatePermissionRankById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const body = req.body;

          const permissionSave = await permissionRankService.updatePermiisionRankById(
            id,
            body
          );
          responses.success(req, res, permissionSave);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_UPDATING_RECORD,
        error: error,
      });
    }
  }

  public async deletePermissionRankById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const permissionDeleted = await permissionRankService.deletePermiisionRankById(
            id
          );
          responses.success(req, res, permissionDeleted);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_TO_DELETE_REGISTER,
        error: error,
      });
    }
  }

  public async getPermissionRankById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const permiision = await permissionRankService.getPermiisionRankById(
            id
          );
          responses.success(req, res, permiision);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_FETCHING_RECORD,
        error: error,
      });
    }
  }

  public async getAllPermissionRank(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const permissions = await permissionRankService.getAllPermiisionRank();
          responses.success(req, res, permissions);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_FETCHING_RECORD,
        error: error,
      });
    }
  }
}

export const permissionRankController = new PermissionRankController();
