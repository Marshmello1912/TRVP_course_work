import { createContext, useState, useEffect } from 'react';
import {
    getCurrent,
    login   as apiLogin,
    register as apiRegister,
    logout  as apiLogout
} from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser]     = useState(null);
    const [loading, setLoading] = useState(true);

    // подгрузка юзера
    const refresh = async () => {
        try {
            const { data } = await getCurrent();
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const login = async creds => {
        await apiLogin(creds);
        await refresh();
    };
    const register = async creds => {
        await apiRegister(creds);
        await refresh();
    };
    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
