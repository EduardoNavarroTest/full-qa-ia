const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const testCasesService = async (file, option) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('option', option);

    const response = await fetch(`${API_URL}/api/test-cases/generate`, {
        method: 'POST',
        body: formData, 
    });

    console.log(response);

    if (!response.ok) {
        throw new Error(`Error al procesar en el servidor: ${response.status}`);
    }

    return response.text(); // o response.json() si es JSON
};
