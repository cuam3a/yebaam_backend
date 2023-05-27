import { Request, Response } from "express";
import { classifiedCategoriesServices } from "../../services/classifieds/classifiedcategories.services";
import { ConstantsRS } from "../../utils/constants";
import { responses } from "../../controllers/utils/response/response";
import { middlewares } from "../../middlewares/middleware";

class CategoryController {
  public async createClassifiedCategory(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const saveCategory = await classifiedCategoriesServices.saveClassifiedCategory(
            body
          );
          if (!saveCategory.code) {
            responses.success(req, res, saveCategory);
          } else {
            responses.error(req, res, saveCategory);
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

  public async updateCategoryClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const statusUpdated = await classifiedCategoriesServices.updateClassifiedCategory(
            body
          );
          if (!statusUpdated.code) {
            responses.success(req, res, statusUpdated);
          } else {
            responses.error(req, res, statusUpdated);
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

  public async getCategoryClasifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const getCategory = await classifiedCategoriesServices.getCategoryClassifiedByID(
            body
          );
          if (!getCategory.code) {
            responses.success(req, res, getCategory);
          } else {
            responses.error(req, res, getCategory);
          }
       /*  } else {
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

  public async deleteCategoryClassifiedByID(req: Request, res: Response) {
    try {
      const body = req.body;
      let token = req.headers.authorization ? req.headers.authorization : "";

      await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) {
          const deleteCategory = await classifiedCategoriesServices.deleteCategoryByID(
            body
          );
          if (!deleteCategory.code) {
            responses.success(req, res, deleteCategory);
          } else {
            responses.error(req, res, deleteCategory);
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

  public async getAllClasifiedCategories(req: Request, res: Response) {
    try {
      let token = req.headers.authorization ? req.headers.authorization : "";

      /* await middlewares.verifyToken(token).then(async (rta) => {
        if (rta.success) { */
          const categories = await classifiedCategoriesServices.getAll();
          if (!categories.code) {
            responses.success(req, res, categories);
          } else {
            responses.error(req, res, categories);
          }
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
export const categoryController = new CategoryController();
