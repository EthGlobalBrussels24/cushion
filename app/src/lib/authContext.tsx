"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
    session: any;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
