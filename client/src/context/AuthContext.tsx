import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for stored authentication state
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple authentication simulation
    const mockUser: User = {
      id: '1',
      email,
      firstName: email.split('@')[0],
      profileImage: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    // Simple registration simulation
    const mockUser: User = {
      id: '1',
      email,
      firstName: firstName || email.split('@')[0],
      lastName,
      profileImage: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isSignedIn: !!user,
    isLoaded,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// For compatibility with existing Clerk hooks
export const useUser = () => {
  const auth = useAuth();
  return {
    user: auth.user,
    isSignedIn: auth.isSignedIn,
    isLoaded: auth.isLoaded,
  };
};

export const useClerk = () => {
  const auth = useAuth();
  return {
    signOut: auth.signOut,
  };
};