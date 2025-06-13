const API_URL = 'http://localhost:3000/api/files';
//const API_URL = 'http://172.29.16.37:3000/api/files';



export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
};

export const getUploadedFiles = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error('Error fetching files');
  return await res.json();
};

export const deleteFile = async (filename) => {
  await fetch(`${API_URL}/${filename}`, {
    method: 'DELETE',
  });
};
