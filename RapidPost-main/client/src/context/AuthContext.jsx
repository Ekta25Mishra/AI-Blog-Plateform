import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import authService from '../features/auth/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    // 🔹 1. Initialize Socket
    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL;

        console.log("Connecting to:", socketUrl);

        const newSocket = io(socketUrl, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        newSocket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // 🔹 2. Check Authentication (VERY IMPORTANT)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authService.getCurrentUser();
                if (res?.data?.user) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.log("User not logged in");
                setUser(null);
            } finally {
                setLoading(false); // ✅ THIS FIXES BLANK PAGE
            }
        };

        checkAuth();
    }, []);

    const authenticateSocket = (userId) => {
        if (!socket) return;
        
        if (socket.connected) {
            socket.emit('authenticate', userId);
            console.log('Socket authenticated with userId:', userId);
        } else {
            socket.once('connect', () => {
                socket.emit('authenticate', userId);
                console.log('Socket authenticated after reconnect with userId:', userId);
            });
        }
    };

    const login = async (username, password) => {
        const res = await authService.login({ username, password });
        setUser(res.data.user);
        authenticateSocket(res.data.user._id);
        return res;
    };

    const signup = async (userData) => {
        const res = await authService.signup(userData);
        setUser(res.data.user);
        authenticateSocket(res.data.user._id);
        return res;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    // 🔹 3. Show loading state properly
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, socket, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
