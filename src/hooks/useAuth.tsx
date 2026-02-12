import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loadDB, saveDB, generateId, hashPassword, verifyPassword, User } from "@/lib/mainwebdb";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => void;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUserId = localStorage.getItem("gfxdb_session");
    if (sessionUserId) {
      const db = loadDB();
      const found = db.users.find(u => u.id === sessionUserId);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const db = loadDB();
    const exists = db.users.find(u => u.email === email);
    if (exists) return { error: new Error("An account with this email already exists.") };

    const newUser: User = {
      id: generateId(),
      email,
      password: hashPassword(password),
      display_name: displayName || email.split("@")[0],
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDB(db);
    localStorage.setItem("gfxdb_session", newUser.id);
    setUser(newUser);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const db = loadDB();
    const found = db.users.find(u => u.email === email);
    if (!found) return { error: new Error("No account found with this email.") };
    if (!verifyPassword(password, found.password)) return { error: new Error("Invalid password.") };

    localStorage.setItem("gfxdb_session", found.id);
    setUser(found);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem("gfxdb_session");
    setUser(null);
  };

  const updateProfile = (displayName: string) => {
    if (!user) return;
    const db = loadDB();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      db.users[idx].display_name = displayName;
      saveDB(db);
      setUser({ ...user, display_name: displayName });
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return { error: new Error("Not logged in") };
    const db = loadDB();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      db.users[idx].password = hashPassword(newPassword);
      saveDB(db);
    }
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
