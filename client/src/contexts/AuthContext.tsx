import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "moderator";

interface User {
  userId: string;
  role: UserRole;
  name?: string;
}

interface Moderator {
  id: string;
  name: string;
  userId: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: UserRole | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for persistent login in localStorage (stays logged in even after browser close)
    const authStatus = localStorage.getItem("msbd_authenticated");
    const storedUser = localStorage.getItem("msbd_user");
    if (authStatus === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userId: string, password: string): boolean => {
    // Check admin credentials from localStorage (or use default)
    const storedAdmin = localStorage.getItem("dob_admin_credentials");
    const adminCreds = storedAdmin 
      ? JSON.parse(storedAdmin) 
      : { userId: "MDBD51724", password: "shuvo@282##" };

    // Check if it's the admin
    if (userId === adminCreds.userId && password === adminCreds.password) {
      const userData: User = {
        userId: adminCreds.userId,
        role: "admin",
        name: "Administrator",
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("msbd_authenticated", "true");
      localStorage.setItem("msbd_user", JSON.stringify(userData));
      return true;
    }

    // Check moderators from localStorage
    const storedMods = localStorage.getItem("dob_moderators");
    if (storedMods) {
      const moderators: Moderator[] = JSON.parse(storedMods);
      const moderator = moderators.find(
        (mod) => mod.userId === userId && mod.password === password
      );

      if (moderator) {
        const userData: User = {
          userId: moderator.userId,
          role: "moderator",
          name: moderator.name,
        };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem("msbd_authenticated", "true");
        localStorage.setItem("msbd_user", JSON.stringify(userData));
        return true;
      }
    }

    // Fallback to default moderator if no custom moderators exist
    if (userId === "DOB" && password === "dob2.0") {
      const userData: User = {
        userId: "DOB",
        role: "moderator",
        name: "Default Moderator",
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("msbd_authenticated", "true");
      localStorage.setItem("msbd_user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Clear persistent login from localStorage
    localStorage.removeItem("msbd_authenticated");
    localStorage.removeItem("msbd_user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === "admin") return true;
    
    const moderatorPermissions = ["add", "edit"];
    return moderatorPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        userRole: user?.role || null, 
        login, 
        logout,
        hasPermission 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
