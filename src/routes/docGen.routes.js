import express from 'express';
import multer from 'multer';
import docGenController from '../controllers/docGen.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/generate', upload.single('file'), docGenController.generateDocumentation);
export default router;
