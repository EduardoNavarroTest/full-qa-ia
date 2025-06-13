import DocGenService from '../services/docGen.service.js';

class DocGenController {
    async generateDocumentation(req, res) {
        try {
            const { option } = req.body;
            const file = req.file;

            if (!file) return res.status(400).json({ error: 'No se recibió ningún archivo PDF' });
            if (!option) return res.status(400).json({ error: 'Falta la instrucción' });

            const service = new DocGenService(file.path, option);
            const result = await service.process();
            res.json(result);
        } catch (error) {
            console.error('Error al generar documentación:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

export default new DocGenController();
