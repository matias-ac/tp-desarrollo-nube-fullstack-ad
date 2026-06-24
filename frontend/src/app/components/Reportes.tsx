import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const BASE = "/api/reportes/export";

function descargar(tipo: string) {
  const token = localStorage.getItem("token");
  const url = `${BASE}?tipo=${tipo}`;

  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        throw new Error("Sesión expirada");
      }
      if (!res.ok) throw new Error("Error al descargar");
      return res.blob();
    })
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${tipo}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch((err) => toast.error(err.message));
}

export function Reportes() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Exportación de datos del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Inventario Actual</CardTitle>
                <CardDescription>Listado completo de productos con stock y precios</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => descargar("inventario", "Inventario")}>
              <Download size={16} />
              Exportar CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Movimientos</CardTitle>
                <CardDescription>Historial completo de movimientos de stock</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={() => descargar("movimientos", "Movimientos")}>
              <Download size={16} />
              Exportar CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
