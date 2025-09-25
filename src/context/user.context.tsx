
import { createContext, useState, type ReactNode } from 'react';
import type { ILoggedUser } from '../types/user';
import tokenService from '../services/token.service';

interface UserContextType {
  user: ILoggedUser | null;
  login: (user: ILoggedUser) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ILoggedUser | null>(null);
  const login = (userData: ILoggedUser) => { 
    setUser(userData);
  }
  const logout = () => {
    setUser(null);
    tokenService.removeUser();
    window.location.href = "https://192.168.1.57/";
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
