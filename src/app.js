// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import TestCases from "./routes/docGen.routes.js";
import FileRoutes from "./routes/file.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configurar CORS
app.use(cors());

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al frontend/dist
const distPath = path.join(__dirname, '../frontend', 'dist');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de React
app.use(express.static(distPath));


// Rutas
app.use('/api/test-cases', TestCases); 

app.use('/api/files', FileRoutes);
app.use('/uploads', express.static('./uploads'));




/*
//Para hacerlo visible en la red http://172.29.16.37/
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

// For local development

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
