import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';
import { parseDocument } from 'htmlparser2';

import {
  Box, Typography, Button, Select, MenuItem, FormControl,
  InputLabel, CircularProgress, Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BugReportIcon from '@mui/icons-material/BugReport';
import ClearIcon from '@mui/icons-material/Clear';

import { testCasesService } from '../services/testCasesService.js';

const TestCases = () => {
  const [file, setFile] = useState(null);
  const [option, setOption] = useState('criterios');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState(null);

  const contentRef = useRef(null);


  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo PDF');
      return;
    }

    setLoading(true);
    setResultado('');
    setError(null);

    try {
      const result = await testCasesService(file, option);
      const parsed = parseLmStudioResponseToHTML(result);
      setResultado(parsed);
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!resultado) {
      alert('No hay resultado para exportar');
      return;
    }

    const htmlContent = parseLmStudioResponseToHTML(resultado);
    exportToPdf(htmlContent);
  };

  const handleCrearJira = () => {
    alert('Crear en Jira (aquí iría la lógica)');
  };

  const handleLimpiar = () => {
    setFile(null);
    setOption('criterios');
    setResultado('');
    setError(null);
  };

  function parseLmStudioResponseToHTML(text) {
    if (!text) return '';

    // Limpiar comillas iniciales/finales
    text = text.trim();
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
    }

    // Convertir saltos de línea tipo \n en reales si vienen en string
    text = text.replace(/\\n/g, '\n');

    // Negritas
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Detectar títulos con subtítulo (paréntesis)
    text = text.replace(
      /^([^\n()]+)\s*\(([^)]+)\)\s*$/gm,
      (_, main, sub) =>
        `<h3 style="color: #007bff;">${main.trim()}</h3><h4 style="color: #3399ff;">(${sub.trim()})</h4>`
    );

    // Títulos simples (sin paréntesis), evitando líneas que comienzan con *, dígitos o etiquetas HTML
    text = text.replace(
      /^(?!\s*[\*\d<])([^\n:]{2,})\n/gm,
      '<h3 style="color: #007bff;">$1</h3>\n'
    );

    // Listas de pasos con \t* Paso X: ... o * Paso X: ...
    text = text.replace(
      /((?:^(?:\\t|\t)?[*•\-]?\s*Paso\s\d+:.+(?:\r?\n)?)+)/gim,
      match => {
        const items = match
          .trim()
          .split(/\r?\n/)
          .map(line =>
            line.replace(/^(?:\\t|\t)?[*•\-]?\s*/, '').trim()
          );
        return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      }
    );

    // Listas ordenadas tradicionales 1. 2. 3.
    text = text.replace(/((?:^\d+\..+(?:\r?\n)?)+)/gm, match => {
      const items = match
        .trim()
        .split(/\r?\n/)
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      return `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`;
    });

    // Listas no ordenadas tradicionales (*, -, etc.)
    text = text.replace(/((?:^[*-]\s.+(?:\r?\n)?)+)/gm, match => {
      const items = match
        .trim()
        .split(/\r?\n/)
        .map(line => line.replace(/^[*-]\s*/, '').trim());
      return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    });

    // Preservar bloques de listas y encabezados al envolver párrafos
    const preserveBlocks = text
      .replace(/<\/?(ul|ol|li|h3|h4)>/g, match => `§§${match}§§`)
      .split(/\n{2,}/)
      .map(p => `<p>${p.trim()}</p>`)
      .join('\n')
      .replace(/§§<\/?(ul|ol|li|h3|h4)>§§/g, match =>
        match.replace(/§§/g, '')
      );

    return preserveBlocks;
  }

  const exportToPdf = () => {
    if (!contentRef.current) {
      alert('No se encontró contenido para exportar');
      return;
    }
  
    const element = contentRef.current.cloneNode(true);
  
    const opt = {
      margin:       0.5, // en pulgadas
      filename:     'resultado.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  {
        scale: 2,
        useCORS: true
      },
      jsPDF:        {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    };
  
    html2pdf().set(opt).from(element).save();
  };
  
  
  


  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Generador de Documentación con IA
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
            Seleccionar archivo PDF
            <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2" mt={1}>{file.name}</Typography>}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-label">¿Qué deseas generar?</InputLabel>
          <Select
            labelId="select-label"
            value={option}
            label="¿Qué deseas generar?"
            onChange={(e) => setOption(e.target.value)}
          >
            <MenuItem value="criterios">Criterios de aceptación</MenuItem>
            <MenuItem value="casos">Casos de prueba</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Procesar'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleLimpiar}
            fullWidth
          >
            Limpiar
          </Button>
        </Box>
      </form>

      {error && (
        <Typography variant="body2" color="error" mt={2}>
          {error}
        </Typography>
      )}

      {resultado && (
        <Box mt={4}>
          <Typography variant="h6">Resultado generado</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 2, backgroundColor: '#f9f9f9' }}>
            <Box
              ref={contentRef}
              sx={{
                backgroundColor: '#fff',
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#333',
                '& ul': {
                  paddingLeft: '1.5em',
                  marginBottom: '1em'
                },
                '& ol': {
                  paddingLeft: '1.5em',
                  marginBottom: '1em'
                },
                '& p': {
                  marginBottom: '1em'
                },
                '& li': {
                  marginBottom: '0.3em'
                }
              }}
              dangerouslySetInnerHTML={{ __html: resultado }}
            />

          </Paper>

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPdf}
            >
              Exportar a PDF
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<BugReportIcon />}
              onClick={handleCrearJira}
            >
              Crear en Jira
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TestCases;
