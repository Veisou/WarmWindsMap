// image-worker.js
self.addEventListener('message', async (e) => {
  const { url, id } = e.data;
  
  try {
    // Загрузка изображения как ArrayBuffer
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    
    // Декодирование в ImageBitmap (не блокирует UI)
    const imageBitmap = await createImageBitmap(blob);
    
    // Отправка результата обратно
    self.postMessage({ id, imageBitmap }, [imageBitmap]);
    
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
});
