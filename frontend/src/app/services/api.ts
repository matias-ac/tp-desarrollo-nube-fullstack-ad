import { toast } from "sonner";

const BASE_URL = "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    toast.error("Error de conexión con el servidor");
    throw new Error("Error de conexión");
  }

  if (res.status === 401 && !endpoint.startsWith("/auth/")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error de conexión" }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
