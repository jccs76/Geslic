
import useAuth from "../hooks/UseAuth";
import {ReactNode, createContext} from "react";

export interface ChildProps {
    children: ReactNode;
}


export interface AuthContextProps {
    isAuthenticated: boolean;
    isAdmin : boolean;
    userName: string;
    login: (token : string) => void;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: ChildProps) => {
    const {isAuthenticated, isAdmin, userName, login, logout} = useAuth();

    const value = {
        isAuthenticated,
        isAdmin,
        userName,
        login,
        logout
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
