import { Request, Response } from "express";
import { ConstantsRS } from "../../../utils/constants";
import { adminUsersServices } from "../../../services/Admin/usersManagement/adminUsers.service";
import { responses } from "../../utils/response/response";
import { middlewares } from "../../../middlewares/middleware";
import { similarServices } from "../../../services/similarservices/similar.services";

class AdminController {
  public async createAdminUser(req: any, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const file = req.files;

          const emaliToVerify = await similarServices.identifyUserOrBrandByEmail(body.email)
          if (emaliToVerify.code) {
            const adminUserSave = await adminUsersServices.createAdminUser(
              body,
              file
            );
            responses.success(req, res, adminUserSave);
          } else {
            responses.error(req, res, ConstantsRS.MAIL_IN_USE);
          }
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

  public async getAdminUserByName(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminUser = await adminUsersServices.getAdminUserByName(
            body
          );
          getAdminUser
            ? responses.success(req, res, getAdminUser)
            : responses.error(req, res, getAdminUser);
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

  public async getAdminUserById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminUser = await adminUsersServices.getAdminUserById(body);
          getAdminUser
            ? responses.success(req, res, getAdminUser)
            : responses.error(req, res, getAdminUser);
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

  public async getAllAdminUsers(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminUser = await adminUsersServices.getAllAdminUsers();
          getAdminUser
            ? responses.success(req, res, getAdminUser)
            : responses.error(req, res, getAdminUser);
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

  public async getAdminUsersByRole(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminUser = await adminUsersServices.getAdminUsersByRole(
            body
          );
          getAdminUser
            ? responses.success(req, res, getAdminUser)
            : responses.error(req, res, getAdminUser);
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

  public async getAdminUsersByCodeOfRole(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminUser = await adminUsersServices.getAdminUsersByCodeOfRole(
            body
          );
          getAdminUser
            ? responses.success(req, res, getAdminUser)
            : responses.error(req, res, getAdminUser);
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

  public async searchAdminUsers(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const getAdminRole = await adminUsersServices.searchAdminUsers(body);
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

  public async updateAdminUser(req: any, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const file = req.files;
          const adminUserUpdate = await adminUsersServices.updateAdminUser(
            body,
            file
          );
          adminUserUpdate
            ? responses.success(req, res, adminUserUpdate)
            : responses.error(req, res, adminUserUpdate);
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

  public async deleteAdminUser(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";
      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const adminUserDelete = await adminUsersServices.deleteAdminUser(
            body
          );
          adminUserDelete
            ? responses.success(req, res, adminUserDelete)
            : responses.error(req, res, adminUserDelete);
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

export const adminController = new AdminController();
