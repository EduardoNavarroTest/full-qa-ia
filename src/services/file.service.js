import fs from 'fs';
import path from 'path';

class FileService {
    constructor() {
        this.uploadDir = './uploads';
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir);
        }
    }

    async saveFile(file) {
        // Ya está guardado por multer, aquí podrías renombrar o mover si se desea
        return Promise.resolve();
    }

    async getAllFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.uploadDir, (err, files) => {
                if (err) return reject(err);
                resolve(files);
            });
        });
    }

    async removeFile(filename) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.uploadDir, filename);
            fs.unlink(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

export default FileService;
