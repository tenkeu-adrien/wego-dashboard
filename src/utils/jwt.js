import { jwtDecode } from "jwt-decode";
import axios from "./axios";

/**
 * Vérifie si le token JWT est valide (non expiré et bien formé)
 * @param {string} authToken - Le token JWT à valider
 * @returns {boolean} - True si le token est valide, false sinon
 */
const isTokenValid = (authToken) => {
  if (!authToken || typeof authToken !== "string") {
    console.error("Token invalide ou manquant");
    return false;
  }

  try {
    // Essaye de décoder le token
    const decoded = jwtDecode(authToken);
    console.log("Token décodé:", decoded);
    
    // Vérifie la date d'expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token expiré");
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erreur de décodage du token:", err);
    
    // Essaye de récupérer le token brut
    try {
      console.log("Token brut:", authToken);
      return true;
    } catch (e) {
      console.error("Impossible d'afficher le token brut:", e);
      return false;
    }
  }
};

/**
 * Gère le stockage sécurisé du token et sa suppression
 * @param {Object|string|null} authData - Les données du token (peut être un objet avec token et user, ou juste le token string)
 */
const setSession = (authData) => {
  if (!authData) {
    // Déconnexion - suppression des données
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  try {
    // Gérer les deux formats possibles
    let authToken, expiresAt, user;
    if (typeof authData === 'string') {
      // Cas où on reçoit directement le token brut
      authToken = authData;
      // On ne peut pas récupérer expiresAt à partir du token brut
      expiresAt = null;
      user = getStoredUser();
    } else {
      // Cas où on reçoit l'objet complet { token, user }
      const { token, user: userData } = authData;
      authToken = token.token;
      expiresAt = new Date(token.expires_at).getTime();
      user = userData;
    }

    // Stockage sécurisé
    localStorage.setItem("authToken", authToken);
    if (expiresAt) {
      localStorage.setItem("tokenExpiry", expiresAt.toString());
    }
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    
    console.log("Session enregistrée avec succès");
    return true;
  } catch (err) {
    console.error("Erreur lors du stockage de la session:", err);
    return false;
  }
};

/**
 * Récupère les données utilisateur stockées de manière sécurisée
 * @returns {Object|null} - Les données utilisateur ou null si inexistantes/invalides
 */
const getStoredUser = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (err) {
    console.error("Erreur de lecture des données utilisateur:", err);
    return null;
  }
};

/**
 * Stocke les données utilisateur de manière sécurisée
 * @param {Object} user - Les données utilisateur à stocker
 */
const setUser = (user) => {
  if (user && typeof user === 'object') {
    try {
      localStorage.setItem("userData", JSON.stringify(user));
    } catch (err) {
      console.error("Erreur de stockage des données utilisateur:", err);
    }
  }
};

export { isTokenValid, setSession, getStoredUser, setUser };