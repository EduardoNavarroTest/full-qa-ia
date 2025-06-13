export const testCasesService = async (file, option) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('option', option);

    //const response = await fetch('http://172.29.16.37:3000/api/test-cases/generate', {
    const response = await fetch('http://localhost:3000/api/test-cases/generate', {
        method: 'POST',
        body: formData, 
    });

    console.log(response);

    if (!response.ok) {
        throw new Error(`Error al procesar en el servidor: ${response.status}`);
    }

    return response.text(); // o response.json() si es JSON
};
