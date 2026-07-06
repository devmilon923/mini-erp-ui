"use client";

import api, { clearAuthFlag, useProfile } from "@/hooks/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";

interface UserType {
  name: string;
  email: string;
  oauthid: string;
  id: string;
  role: "admin" | "user";
}

interface ContextPayload {
  user: UserType | undefined;
  setUser: Dispatch<SetStateAction<UserType | undefined>>;
  isSuccess: boolean;
  isLoading: boolean;
  logout: () => void;
}

// Initialize the context
export const AuthContext = createContext<ContextPayload | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [muser, setUser] = useState<UserType | undefined>(undefined);
  const backendURL = process.env.NEXT_PUBLIC_Backend_URL;
  const { data, isLoading, isSuccess } = useProfile();
  let user = muser || data || null;
  useEffect(() => {
    if (data && isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess, setUser]);

  const logout = async () => {
    await api.post(backendURL + "/auth/logout");
    clearAuthFlag();
    setUser(undefined);
    queryClient.clear();
  };
  console.log(user);
  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, isSuccess, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
