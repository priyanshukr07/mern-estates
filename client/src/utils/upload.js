const readFileAsDataUrl = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadstart = () => onProgress?.(5);
    reader.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 70);
      onProgress?.(progress);
    };
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.readAsDataURL(file);
  });

export const uploadImage = async (file, onProgress) => {
  const dataUrl = await readFileAsDataUrl(file, onProgress);

  onProgress?.(80);

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: dataUrl,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Image upload failed.');
  }

  onProgress?.(100);

  return data.url;
};
