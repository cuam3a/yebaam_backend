import { Request, Response } from "express";
import { ConstantsRS } from "../../utils/constants";
import { classifiedSubcategoriesServices } from "../../services/classifieds/classifiedsubcategories.services";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class ClassifiedSubcategoriesController {
  public async createSubcategoryClassified(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const subcategorySaved = await classifiedSubcategoriesServices.saveClassifiedSubcategory(
            body
          );
          if (!subcategorySaved.code) {
            responses.success(req, res, subcategorySaved);
          } else {
            responses.error(req, res, subcategorySaved);
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

  public async updateStatusClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const subcategoryUpdated = await classifiedSubcategoriesServices.updateClassifiedSubcategory(
            body
          );
          if (!subcategoryUpdated.code) {
            responses.success(req, res, subcategoryUpdated);
          } else {
            responses.error(req, res, subcategoryUpdated);
          }
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

  public async getSubcategoryClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const getSubCategory = await classifiedSubcategoriesServices.getSubcategoryClassifiedByID(
        body.id
      );
      if (!getSubCategory.code) {
        responses.success(req, res, getSubCategory);
      } else {
        responses.error(req, res, getSubCategory);
      }
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

  public async getSubcategoryClassifiedByCategoryID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
      const getSubCategory = await classifiedSubcategoriesServices.getSubcategoriesByCategoryID(body);
      responses.success(req, res, getSubCategory);
      /* } else {
        responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
      }
    }); */
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_FETCHING_RECORD, error: error, });
    }
  }

  public async deleteSubcategoryClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const subcategoryDeleted = await classifiedSubcategoriesServices.deleteSubcategoryClassifiedByID(body);
          if (!subcategoryDeleted.code) {
            responses.success(req, res, subcategoryDeleted);
          } else {
            responses.error(req, res, subcategoryDeleted);
          }
        } else {
          responses.error(req, res, ConstantsRS.UNAUTHORIZED_ACCESS);
        }
      });
    } catch (error) {
      responses.error(req, res, { message: ConstantsRS.ERROR_TO_DELETE_REGISTER, error: error });
    }
  }
}

export const classifiedSubcategoriesController = new ClassifiedSubcategoriesController();
