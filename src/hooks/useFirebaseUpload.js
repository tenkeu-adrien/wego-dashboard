// hooks/useFirebaseUpload.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.config";

export const useFirebaseUpload = () => {
  const uploadFile = async (file, path = 'uploads') => {
    try {
      if (!file) return null;
      
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  return { uploadFile };
};