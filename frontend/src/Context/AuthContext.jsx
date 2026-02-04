import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on app load
    const checkAuth = async () => {
        try {
            const res = await fetch("https://my-todo-app-e4j3.onrender.com/api/auth/me", {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await fetch("https://my-todo-app-e4j3.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // IMPORTANT (cookies)
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setUser(data.user);
            return true;
        } catch (err) {
            alert(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const res = await fetch("https://my-todo-app-e4j3.onrender.com/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            return true;
        } catch (err) {
            alert(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await fetch("https://my-todo-app-e4j3.onrender.com/api/auth/logout", {
            method: "GET",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
