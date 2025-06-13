// clients/iaClient.js
import fetch from 'node-fetch';

const sendRequest = async (text, type) => {
  const prompt = generatePrompt(text, type);

  try {
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-3b-instruct',
        messages: [
          { role: 'system', content: 'Eres un asistente experto que genera documentación técnica de software.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`Error de IA (${response.status})`);
    }

    const data = await response.json();
    const responseIA = data.choices?.[0]?.message?.content || 'Sin respuesta de la IA.';
    return responseIA;

  } catch (error) {
    console.error('Error al procesar IA:', error);
    throw new Error('Error al generar la respuesta de la IA.');
  }
};

const generatePrompt = (text, type) => {
  if (type === 'criterios') {
    return `Genera criterios de aceptación en formato lista a partir del siguiente contenido:\n\n${text}`;
  } else {
    return `Genera casos de prueba detallados en formato lista a partir del siguiente contenido:\n\n${text}`;
  }
};

export { sendRequest };
