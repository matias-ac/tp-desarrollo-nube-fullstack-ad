import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Acceso Denegado</h1>
        <p className="text-slate-500">No tenés permisos para acceder a esta sección.</p>
        <Button onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
}
