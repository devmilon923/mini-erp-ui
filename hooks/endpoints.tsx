import { TLogin } from "@/validation/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const serverURL = process.env.NEXT_PUBLIC_Backend_URL as string;
const api = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});
const AUTH_FLAG_KEY = "logged_in";
export function setAuthFlag() {
  try {
    localStorage.setItem(AUTH_FLAG_KEY, "1");
  } catch {}
}

export function clearAuthFlag() {
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
  } catch {}
}

export function hasAuthFlag(): boolean {
  try {
    return localStorage.getItem(AUTH_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(error);
      clearAuthFlag();
      return Promise.reject("Failed to authenticate");
    }
    return Promise.reject(error);
  },
);

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputs: TLogin) => {
      const result = await api.post<TLogin>("/auth/login", inputs);
      return result.data;
    },
    onSuccess: (data) => {
      setAuthFlag();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await api.get("/user/profile");
      return result.data.data;
    },
    enabled: typeof window !== "undefined" && hasAuthFlag(),
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await api.get("/auth/logout");
      return result.data;
    },
    onSuccess: () => {
      clearAuthFlag();
    },
  });
};
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (data: { fileType: string; fileName: string }) => {
      const result = await api.post("/media/upload", data);
      return result.data.data;
    },
  });
};
export default api;
