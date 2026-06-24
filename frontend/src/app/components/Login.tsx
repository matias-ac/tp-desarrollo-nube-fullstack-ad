import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Package, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Stock - Acceso</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">Sistema integral con Active Directory</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
              Usuario AD
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="dominio\usuario"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 mt-6">
            <ShieldAlert className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-800 leading-tight">
              Acceso permitido solo en días hábiles, de 8:00 a 18:00 hs.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
