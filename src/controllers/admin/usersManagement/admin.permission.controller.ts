import { Request, Response } from "express";
import { ConstantsRS } from "../../../utils/constants";
import { middlewares } from "../../../middlewares/middleware";
import { administratorRolePermissionsServices } from "../../../services/Admin/usersManagement/administratorRolePermissions.service";
import { responses } from "../../utils/response/response";

class AdminPermissionsController {
  public async createPermission(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminPermissionSaved = await administratorRolePermissionsServices.createPermission(
            body
          );
          adminPermissionSaved
            ? responses.success(req, res, adminPermissionSaved)
            : responses.error(req, res, adminPermissionSaved);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, {
        message: ConstantsRS.ERROR_SAVING_RECORD,
        error: error,
      });
    }
  }

  public async getPermissionByName(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminPermission = await administratorRolePermissionsServices.getPermissionByName(
            body
          );
          getAdminPermission
            ? responses.success(req, res, getAdminPermission)
            : responses.error(req, res, getAdminPermission);
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

  public async getPermissionById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminPermission = await administratorRolePermissionsServices.getPermissionById(
            body
          );
          getAdminPermission
            ? responses.success(req, res, getAdminPermission)
            : responses.error(req, res, getAdminPermission);
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

  public async getAllPermission(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const getAdminPermission = await administratorRolePermissionsServices.getAllPermission();
          getAdminPermission
            ? responses.success(req, res, getAdminPermission)
            : responses.error(req, res, getAdminPermission);
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

  public async searchPermission(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await administratorRolePermissionsServices.searchPermission(
            body
          );
          getAdminRole
            ? responses.success(req, res, getAdminRole)
            : responses.error(req, res, getAdminRole);
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

  public async updatePermission(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminPermissionUpdate = await administratorRolePermissionsServices.updatePermission(
            body
          );
          adminPermissionUpdate
            ? responses.success(req, res, adminPermissionUpdate)
            : responses.error(req, res, adminPermissionUpdate);
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

  public async deletePermission(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminPermissionDelete = await administratorRolePermissionsServices.deletePermission(
            body
          );
          if (adminPermissionDelete.code == undefined) {
            responses.success(req, res, adminPermissionDelete);
          } else {
              responses.error(req, res, adminPermissionDelete);
          }
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
}

export const adminPermissionsController = new AdminPermissionsController();
