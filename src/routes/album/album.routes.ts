import { Router } from 'express';
import { albumsController } from "../../controllers/albums/albums.controller";

const albumRoutes: Router = Router();

albumRoutes.get('/', albumsController.getAllAlbums);
albumRoutes.post('/id', albumsController.getAlbumByID);
albumRoutes.post('/by-any-id', albumsController.getAllAlbumsByAnyUser);
albumRoutes.post('/create', albumsController.createAlbum);
albumRoutes.post('/create-any-user', albumsController.createAlbumByAnyUser);
albumRoutes.post('/delete-id', albumsController.deleteAlbumById);
albumRoutes.post('/delete-user', albumsController.deleteUserAlbumById);
albumRoutes.post('/update', albumsController.updateAlbum);
albumRoutes.post('/posts-album', albumsController.getAlbumsByAnyUserAndAlbumID);
export default albumRoutes;