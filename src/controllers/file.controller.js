import FileService from '../services/file.service.js';

const fileService = new FileService();

class FileController {
    async uploadFile(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        try {
            await fileService.saveFile(req.file);
            res.status(200).json({ message: 'Archivo subido correctamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al guardar el archivo' });
        }
    }

    async listFiles(req, res) {
        try {
            const files = await fileService.getAllFiles();
            res.json(files);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener archivos' });
        }
    }

    async deleteFile(req, res) {
        const { filename } = req.params;

        try {
            await fileService.removeFile(filename);
            res.status(200).json({ message: 'Archivo eliminado' });
        } catch (err) {
            res.status(404).json({ message: 'Archivo no encontrado' });
        }
    }
}

export default new FileController();
