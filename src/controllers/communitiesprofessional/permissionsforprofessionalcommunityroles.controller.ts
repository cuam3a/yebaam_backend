import { Request, Response } from "express";
import { permissionForProfessionalCommunityRolesService } from "../../services/communitiesprofessionales/permissionsforprofessionalcommunityroles.service";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class PermissionsForProfessionalCommunityrolesController {
  public async createPermission(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissioncreated = await permissionForProfessionalCommunityRolesService.createPermission(
            body
          );
          responses.success(req, res, permissioncreated);
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

  public async updatePermission(req: Request, res: Response) {
    try {
      const body = req.body;
      const { id } = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissionupdated = await permissionForProfessionalCommunityRolesService.updatePermission(
            id,
            body
          );
          responses.success(req, res, permissionupdated);
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

  public async deletePermission(req: Request, res: Response) {
    try {
      const { id } = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissiondelete = await permissionForProfessionalCommunityRolesService.deletePermission(
            id
          );
          if (permissiondelete.code == undefined) {
            responses.success(req, res, permissiondelete);
          } else {
              responses.error(req, res, permissiondelete);
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

  public async getPermissionbyId(req: Request, res: Response) {
    try {
      const { id } = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissionupdated = await permissionForProfessionalCommunityRolesService.getPermissionById(
            id
          );
          responses.success(req, res, permissionupdated);
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

  public async getAllPermissionActive(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissionupdated = await permissionForProfessionalCommunityRolesService.getAllActivePermission();
          responses.success(req, res, permissionupdated);
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

  public async getAllPermissionInavtive(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const permissionupdated = await permissionForProfessionalCommunityRolesService.getAllInActivePermission();
          responses.success(req, res, permissionupdated);
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

export const permissionsForProfessionalCommunityrolesController = new PermissionsForProfessionalCommunityrolesController();
