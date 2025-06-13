// docGen.service.js
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { sendRequest } from '../clients/iaClient.js';

class DocGenService {
    constructor(pdfPath, option) {
        this.pdfPath = pdfPath;
        this.option = option;
    }

    async process() {
        try {
            const pdfBuffer = fs.readFileSync(this.pdfPath);
            const pdfData = await pdfParse(pdfBuffer);
            const extractedText = pdfData.text;
            const responseIA = await sendRequest(extractedText, this.option);
            await fs.unlinkSync(this.pdfPath);
            return responseIA;
        } catch (err) {
            throw new Error('Error al procesar el PDF: ' + err.message);
        }
    }
}

export default DocGenService;
