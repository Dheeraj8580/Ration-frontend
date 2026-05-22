export const getUploadUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const backendUrl = import.meta.env.VITE_API_URL || '';
  const cleanBackend = backendUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBackend}${cleanPath}`;
};
