import { useState } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');

  function login(token : string) {
    localStorage.setItem("token", token);                        
    const tokenSplit = token.split('.');
    const tokenDecoded = JSON.parse(atob(tokenSplit[1]));                        
    localStorage.setItem("user", tokenDecoded.user);    
    setUserName(tokenDecoded.user);
    setIsAdmin(tokenDecoded.isAdmin);
    setIsAuthenticated(true);    
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName('');   
    setIsAuthenticated(false);
  }

  return { isAuthenticated, isAdmin, userName, login, logout };
}

export default useAuth;