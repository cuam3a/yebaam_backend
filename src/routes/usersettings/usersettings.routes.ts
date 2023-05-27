import { Router } from 'express';
import { userSettingsController } from '../../controllers/usersetting/usersettings.controller';

const userSettingsRoutes: Router = Router();

userSettingsRoutes.post('/create', userSettingsController.createUserSettings)
userSettingsRoutes.post('/update', userSettingsController.modifyUserSettings)
userSettingsRoutes.post('/delete', userSettingsController.deleteUserSettings)
userSettingsRoutes.post('/get-usersettings', userSettingsController.getUserSettingsByEntityId)

export default userSettingsRoutes;