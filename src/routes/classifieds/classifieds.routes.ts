import { Router } from 'express';
import { categoryController } from "../../controllers/classifieds/classifiedcategories.controller";
import { classifiedStatusController } from '../../controllers/classifieds/classifiedstatus.controller';
import { classifiedSubcategoriesController } from "../../controllers/classifieds/classifiedsubcategories.controller";
import { classifiedController } from "../../controllers/classifieds/classified.controller";

const classifiedsRouter: Router = Router();

classifiedsRouter.post("/create", classifiedController.createClassified);
classifiedsRouter.post("/id", classifiedController.getClassifiedByID);
classifiedsRouter.post("/delete-id", classifiedController.deleteClassifiedByID);
classifiedsRouter.post("/update-id", classifiedController.updateClassifiedByID);
classifiedsRouter.post("/", classifiedController.getAllClassifieds);
classifiedsRouter.post("/delete-image", classifiedController.deleteClassifiedPictureByID);
classifiedsRouter.post("/search", classifiedController.getClassifiedByCriteria);
classifiedsRouter.post("/user-id", classifiedController.getClassifiedByUserID);

classifiedsRouter.post("/category-id", categoryController.getCategoryClasifiedByID);
classifiedsRouter.get("/categories", categoryController.getAllClasifiedCategories);
classifiedsRouter.post("/category-create", categoryController.createClassifiedCategory);
classifiedsRouter.post("/category-update-id", categoryController.updateCategoryClassifiedByID);
classifiedsRouter.post("/category-delete-id", categoryController.deleteCategoryClassifiedByID);

classifiedsRouter.post("/subcategory-id", classifiedSubcategoriesController.getSubcategoryClassifiedByID);
classifiedsRouter.post("/subcategories-category-id", classifiedSubcategoriesController.getSubcategoryClassifiedByCategoryID);
classifiedsRouter.post("/subcategory-create", classifiedSubcategoriesController.createSubcategoryClassified);
classifiedsRouter.post("/subcategory-update-id", classifiedSubcategoriesController.updateStatusClassifiedByID);
classifiedsRouter.post("/subcategory-delete-id", classifiedSubcategoriesController.deleteSubcategoryClassifiedByID);

classifiedsRouter.get("/status", classifiedStatusController.getAllClassifiedStatus);
classifiedsRouter.post("/status-id", classifiedStatusController.getClassifiedStatusByID);
classifiedsRouter.post("/status-create", classifiedStatusController.createClassifiedStatus);
classifiedsRouter.post("/status-delete-id", classifiedStatusController.deleteClassifiedStatusById);
classifiedsRouter.post("/status-update-id", classifiedStatusController.updateStatusClassifiedByID);

classifiedsRouter.post("/get-mx-states", classifiedController.getMxStates);
classifiedsRouter.post("/get-mx-municipalities", classifiedController.getMxMunicipalitiesByState);
classifiedsRouter.post("/get-co-departments-cities", classifiedController.getCoDepartmentsNCities);

export default classifiedsRouter;