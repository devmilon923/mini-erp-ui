import axios from "axios";

const serverURL = process.env.NEXT_PUBLIC_Backend_URL as string;
const api = axios.create({
  baseURL: serverURL,
});
const AUTH_FLAG_KEY = "logged_in";
function setAuthFlag() {
  try {
    localStorage.setItem(AUTH_FLAG_KEY, "1");
  } catch {}
}

function clearAuthFlag() {
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
  } catch {}
}

function hasAuthFlag(): boolean {
  try {
    return localStorage.getItem(AUTH_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}
