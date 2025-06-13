import express from 'express';
import { uploadMiddleware } from '../middlewares/multerMiddleware.js';
import FileController from '../controllers/file.controller.js';

class FileRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/upload', uploadMiddleware.single('file'), FileController.uploadFile);
        this.router.get('/', FileController.listFiles);
        this.router.delete('/:filename', FileController.deleteFile);
    }

    getRouter() {
        return this.router;
    }
}

export default new FileRoutes().getRouter();
