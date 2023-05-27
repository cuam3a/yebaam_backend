import { Request, Response } from "express";
import { ConstantsRS } from "../../../utils/constants";
import { middlewares } from "../../../middlewares/middleware";
import { responses } from "../../utils/response/response";
import { administratorRolesServices } from "../../../services/Admin/usersManagement/administratorRoles.service";

class AdminRolesController {
  public async createRole(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminRoleSaved = await administratorRolesServices.createRole(
            body
          );
          adminRoleSaved
            ? responses.success(req, res, adminRoleSaved)
            : responses.error(req, res, adminRoleSaved);
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

  public async geRoleByName(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await administratorRolesServices.geRoleByName(
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

  public async getRoleById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await administratorRolesServices.getRoleById(
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

  public async getAllRoles(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await administratorRolesServices.getAllRoles();
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

  public async searchRoles(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await administratorRolesServices.searchRoles(
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

  public async updateRole(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminRoleUpdate = await administratorRolesServices.updateRole(
            body
          );
          adminRoleUpdate
            ? responses.success(req, res, adminRoleUpdate)
            : responses.error(req, res, adminRoleUpdate);
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

  public async deleteRole(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminRoleDelete = await administratorRolesServices.deleteRole(
            body
          );

          if (adminRoleDelete.code == undefined) {
            responses.success(req, res, adminRoleDelete);
          } else {
              responses.error(req, res, adminRoleDelete);
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

export const adminRolesController = new AdminRolesController();
