import multer from 'multer';

const uploadPath = './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Cambia si quieres renombrar
  }
});

export const uploadMiddleware = multer({ storage });
