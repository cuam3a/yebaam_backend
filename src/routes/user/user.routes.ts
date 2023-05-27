import { Router } from 'express';
import { userController } from '../../controllers/user/user.controller';
import { userUploadFiles } from '../../controllers/user/userUploads.controller';
import { loginController } from '../../controllers/login/login.controller'
const userRoutes: Router = Router();

userRoutes.get('/', userController.getallUsers);
userRoutes.post('/create', userController.createUser);
userRoutes.post('/sendemail', loginController.sendCodeToEmail);
userRoutes.post('/sendcode', loginController.codeVerification);
userRoutes.post('/getcode-password', loginController.sendCodeToEmailResetPassword);

userRoutes.post('/email', userController.getUserByEmail);
userRoutes.post('/id', userController.getUserById);
userRoutes.post('/delete-id', userController.deleteUserById);
userRoutes.post('/update-email', userController.updateUserByEmail);
userRoutes.post('/update-id', userController.updateUserById);
userRoutes.get('/:idUser', userController.getUserByIdPopulate);
userRoutes.post('/new-password', userController.resetPassword);
userRoutes.post('/update-privacy', userController.updateUserPrivacy);

userRoutes.post('/upload', userUploadFiles.uploadimages);
userRoutes.post('/upload/media', userUploadFiles.uploadMedia);
userRoutes.post('/upload/documents', userUploadFiles.uploadDocuments);

userRoutes.post('/manage-external-user', userController.manageExternalUser);
userRoutes.post('/change-password', loginController.changePassword);
userRoutes.post('/other-change-password', loginController.otherchangePassword);
userRoutes.post('/update-id-od', userController.deleteUserByIdOnlyDev);

userRoutes.post('/delete-file', userUploadFiles.deleteImageByUrl);
userRoutes.post('/filesById', userUploadFiles.getFilesByUserId);

export default userRoutes;