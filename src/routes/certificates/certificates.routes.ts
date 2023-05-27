import { Router } from 'express';
import { classOfCertificatesContoller } from '../../controllers/certificates/certificatesclass.controller';
import { certificatesContoller } from '../../controllers/certificates/certificates.controller';

const certificateRoutes: Router = Router();

certificateRoutes.get('/classes', classOfCertificatesContoller.getAllCertificateClasses);
certificateRoutes.post('/class-create', classOfCertificatesContoller.createCertificateClass);
certificateRoutes.post('/class-id', classOfCertificatesContoller.getCertificateClassById);
certificateRoutes.post('/class-delete-id', classOfCertificatesContoller.deleteCertificateClassById);
certificateRoutes.post('/class-update-id', classOfCertificatesContoller.updateCertificateClassById);
certificateRoutes.post('/class-by-concept', classOfCertificatesContoller.getCertificateClassesByConcept);

certificateRoutes.post('/create', certificatesContoller.createCertificate);
certificateRoutes.post('/update-id', certificatesContoller.updateCertificateById);
certificateRoutes.post('/delete-id', certificatesContoller.deleteCertificateById);

certificateRoutes.post('/create-auth', certificatesContoller.createAuthCertificates);
certificateRoutes.post('/delete-id-auth', certificatesContoller.deleteAuthCertificateById);
certificateRoutes.post('/entity-auth', certificatesContoller.getAuthCertificateByEntityID);

certificateRoutes.post('/state-concept', certificatesContoller.getCertificatesByStateNConcept);
certificateRoutes.post('/change-state-user', certificatesContoller.changeStateByUser);
certificateRoutes.post('/change-state-admin', certificatesContoller.changeStateByAdmin);

export default certificateRoutes;