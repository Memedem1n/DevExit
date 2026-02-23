"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export type UserRole = 'DEVELOPER' | 'INVESTOR';

interface User {
  id: string;
  name: string;
  email: string;
  isProfileComplete: boolean;
  isVerified: boolean;
  currentRole: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        // @ts-ignore
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        isProfileComplete: true,
        isVerified: true,
        // @ts-ignore
        currentRole: session.user.currentRole || 'DEVELOPER',
        avatar: session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = (role: UserRole) => {
    // This is now handled by NextAuth, but we keep the method signature for compatibility
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const switchRole = () => {
    if (!user) return;
    setUser({
      ...user,
      currentRole: user.currentRole === 'DEVELOPER' ? 'INVESTOR' : 'DEVELOPER'
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login, 
      logout, 
      switchRole,
      isLoading: status === "loading"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
