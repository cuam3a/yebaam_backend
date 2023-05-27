import { Router } from 'express';
import { notificationController } from '../../controllers/notifications/notifications.controller';

const notificationRoutes: Router = Router();

notificationRoutes.post('/get-notifications-addressee',notificationController.getNotificationsRequestAndOthersUser)
notificationRoutes.post('/delete-notification',notificationController.deleteNotification)
notificationRoutes.post('/get-notification-id',notificationController.getAnyNotificationById)
notificationRoutes.post('/view-notification',notificationController.viewNotification)
notificationRoutes.post('/disable-enable-post-notification',notificationController.disableOrEnablePostNotifications)
notificationRoutes.post('/disable-enable-notification',notificationController.disableOrEnableNotifications)

export default notificationRoutes