import { useState, useEffect } from "react";
import { Plus, Loader2, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "./ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { canRegisterMovements } from "../utils/permissions";
import { api } from "../services/api";
import { useMovimientos, type Movimiento } from "../hooks/useMovimientos";

interface ProductoItem {
  id: number;
  nombre: string;
}

const tipoColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ingreso: "default",
  egreso: "destructive",
  ajuste: "secondary",
};

export function Movimientos() {
  const { user } = useAuth();
  const { movimientos, loading, listar, registrar } = useMovimientos();
  const [productos, setProductos] = useState<ProductoItem[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ producto_id: 0, tipo: "ingreso", cantidad: 1, observacion: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ productos: ProductoItem[] }>("/productos").then((d) => setProductos(d.productos)).catch(() => toast.error("Error al cargar los productos"));
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filtroTipo && filtroTipo !== "todos") params.tipo = filtroTipo;
    listar(params);
  }, [filtroTipo, listar]);

  const openNuevo = () => {
    setForm({ producto_id: productos[0]?.id ?? 0, tipo: "ingreso", cantidad: 1, observacion: "" });
    setDialogOpen(true);
  };

  const handleRegistrar = async () => {
    if (!form.producto_id || !form.cantidad || form.cantidad <= 0) {
      toast.error("Completá todos los campos requeridos");
      return;
    }
    setSaving(true);
    try {
      await registrar(form);
      toast.success("Movimiento registrado");
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrar el movimiento");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Movimientos</h1>
            <p className="text-slate-500 text-sm mt-1">Historial de movimientos de stock</p>
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Movimientos</h1>
          <p className="text-slate-500 text-sm mt-1">{movimientos.length} movimientos registrados</p>
        </div>
        {canRegisterMovements(user) && (
          <Button onClick={openNuevo}>
            <Plus size={16} />
            Nuevo Movimiento
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Filter size={16} className="text-slate-400" />
        <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
            <SelectItem value="ajuste">Ajuste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {movimientos.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No hay movimientos registrados</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Observación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-sm text-slate-500">{formatDate(m.created_at)}</TableCell>
                <TableCell className="font-medium">{m.producto_nombre}</TableCell>
                <TableCell>
                  <Badge variant={tipoColors[m.tipo]} className="capitalize">
                    {m.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{m.cantidad}</TableCell>
                <TableCell className="text-sm text-slate-500">{m.usuario_id}</TableCell>
                <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">{m.observacion || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Movimiento</DialogTitle>
            <DialogDescription>Registrá un ingreso, egreso o ajuste de stock.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Producto *</label>
              <Select
                value={String(form.producto_id)}
                onValueChange={(v) => setForm({ ...form, producto_id: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="egreso">Egreso</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
              <Input type="number" min={1} value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observación</label>
              <Input value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} placeholder="Opcional" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleRegistrar} disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
