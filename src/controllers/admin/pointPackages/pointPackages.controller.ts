import { Request, Response } from "express";
import { responses } from "../../utils/response/response";
import { pointPackagesService } from "../../../services/Admin/pointPackage/pointPackage.service";
import { ConstantsRS } from "../../../utils/constants";
import { middlewares } from "../../../middlewares/middleware";

class PointPackageController {
  public async createPointPackage(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const packageSave = await pointPackagesService.createPointPackage(
            body
          );
          responses.success(req, res, packageSave);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.CAN_NOT_CREATE_DOCUMENT, error: error });
    }
  }

  public async updatePointPackage(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const body = req.body;
          const packageUpdated = await pointPackagesService.editPointPackage(
            body
          );
          responses.success(req, res, packageUpdated);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_UPDATING_RECORD, error: error });
    }
  }

  public async getAllPointPackage(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const pointsPackages = await pointPackagesService.getAllPointPackage();
          responses.success(req, res, pointsPackages);
       /*  } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.FAILED_TO_FETCH_RECORDS, error: error });
    }
  }

  public async getPointPackageById(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const pointsPackages = await pointPackagesService.getPointPackageById(
            id
          );
          responses.success(req, res, pointsPackages);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error });
    }
  }

  public async DeletePointPackage(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const deletePackage = await pointPackagesService.deletePointPackageById(id);
          if (!deletePackage.code) {
            responses.success(req, res, deletePackage);
          } else {
            responses.error(req, res, deletePackage);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async DeactivatePointPackage(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const { id } = req.body;
          const deletePackage = await pointPackagesService.deactivatePointPackageById(id);
          responses.success(req, res, deletePackage);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }

  public async getAllPointPackageDeactivate(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const pointsPackages = await pointPackagesService.getAllPointPackageDeactivate();
          responses.success(req, res, pointsPackages);
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { ...ConstantsRS.FAILED_TO_FETCH_RECORDS, error });
    }
  }
}

export const pointPackageController = new PointPackageController();
