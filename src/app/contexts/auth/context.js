import { createSafeContext } from "utils/createSafeContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { isTokenValid, setSession } from "utils/jwt";

const API_URL = "http://localhost:3333/api/v1";
// https://wegoadmin-c5c82e2c5d80.herokuapp.com/
export const [AuthContext, useAuthContext] = createSafeContext(
    "useAuthContext must be used within AuthProvider"
);
// https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('authToken');

            if (storedToken) {
                try {
                    setIsLoading(true);
                    if (isTokenValid(storedToken)) {
                        try {
                            const response = await axios.get(`${API_URL}/user/profile`, {
                                headers: {
                                    Authorization: `Bearer ${storedToken}`
                                }
                            });
                            const userData = response.data.user;
                            console.log("userData", userData)

                            setToken(storedToken);
                            setUser(userData);
                            setIsLoading(false);
                        } catch (error) {
                            console.error("Erreur lors de la récupération du profil:", error);
                            logout();
                        }
                    } else {
                        console.log("Token invalide, déconnexion");
                        logout();
                    }
                } catch (error) {
                    console.error("Erreur lors de l'initialisation:", error);
                    logout();
                } finally {
                    setIsLoading(false);
                }
            } else {
                logout();
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const response = await axios.post(`${API_URL}/login`, credentials);
            const { token, user } = response.data;

            setSession({ token, user });
            setToken(token.token);
            setUser(user);

            // ✅ Toast de succès
          

            return true;
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                "Une erreur est survenue lors de la connexion"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setSession(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!token && isTokenValid(token);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        errorMessage,
        login,
        logout
    };

    return React.createElement(
        AuthContext.Provider,
        { value: value },
        children
    );
}
