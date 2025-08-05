// utils/fileUtils.js
import imageCompression from 'browser-image-compression';

// Options de compression pour les images
const imageCompressionOptions = {
  maxSizeMB: 0.5,        // Taille maximale de 500KB
  maxWidthOrHeight: 800, // Résolution maximale
  useWebWorker: true,
  fileType: 'image/webp' // Format de sortie
};

// Options pour les PDF (pas de compression, juste une validation)
const pdfValidationOptions = {
  maxSizeMB: 2,          // Taille maximale de 2MB
  allowedExtensions: ['pdf']
};

// Fonction pour compresser une image
export const compressImage = async (file) => {
  try {
    return await imageCompression(file, imageCompressionOptions);
  } catch (error) {
    console.error('Erreur de compression:', error);
    throw error;
  }
};

// Fonction pour valider un PDF
export const validatePdf = (file) => {
  if (file.size > pdfValidationOptions.maxSizeMB * 1024 * 1024) {
    throw new Error(`Le fichier ne doit pas dépasser ${pdfValidationOptions.maxSizeMB}MB`);
  }
  
  const extension = file.name.split('.').pop().toLowerCase();
  if (!pdfValidationOptions.allowedExtensions.includes(extension)) {
    throw new Error('Seuls les fichiers PDF sont autorisés');
  }
  
  return file;
};