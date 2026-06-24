import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { useAuth } from "../contexts/AuthContext";
import { canCreate, canEdit, canDelete } from "../utils/permissions";
import { api } from "../services/api";
import { useProductos, type Producto } from "../hooks/useProductos";

interface Categoria {
  id: number;
  nombre: string;
}

export function Productos() {
  const { user } = useAuth();
  const { productos, loading, crear, actualizar, eliminar } = useProductos();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState({ nombre: "", categoria_id: 0, stock_actual: 0, stock_minimo: 0, precio_unitario: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ categorias: Categoria[] }>("/categorias").then((d) => setCategorias(d.categorias)).catch(() => toast.error("Error al cargar las categorías"));
  }, []);

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const openNuevo = () => {
    setEditando(null);
    setForm({ nombre: "", categoria_id: categorias[0]?.id ?? 0, stock_actual: 0, stock_minimo: 0, precio_unitario: 0 });
    setDialogOpen(true);
  };

  const openEditar = (p: Producto) => {
    setEditando(p);
    setForm({ nombre: p.nombre, categoria_id: p.categoria_id, stock_actual: p.stock_actual, stock_minimo: p.stock_minimo, precio_unitario: p.precio_unitario });
    setDialogOpen(true);
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.categoria_id || form.precio_unitario <= 0) {
      toast.error("Completá todos los campos requeridos");
      return;
    }
    setSaving(true);
    try {
      if (editando) {
        await actualizar(editando.id, { ...form, precio_unitario: Number(form.precio_unitario) });
        toast.success("Producto actualizado");
      } else {
        await crear({ ...form, precio_unitario: Number(form.precio_unitario) });
        toast.success("Producto creado");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (p: Producto) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await eliminar(p.id);
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  const formatPrice = (n: number) => `$${n.toFixed(2)}`;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
            <p className="text-slate-500 text-sm mt-1">Administración del catálogo</p>
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
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Productos</h1>
          <p className="text-slate-500 text-sm mt-1">{productos.length} productos en total</p>
        </div>
        {canCreate(user) && (
          <Button onClick={openNuevo}>
            <Plus size={16} />
            Nuevo Producto
          </Button>
        )}
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar productos..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No se encontraron productos</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Stock Actual</TableHead>
              <TableHead className="text-right">Stock Mínimo</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Estado</TableHead>
              {(canEdit(user) || canDelete(user)) && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nombre}</TableCell>
                <TableCell>{p.categoria_nombre}</TableCell>
                <TableCell className="text-right">{p.stock_actual}</TableCell>
                <TableCell className="text-right">{p.stock_minimo}</TableCell>
                <TableCell className="text-right">{formatPrice(p.precio_unitario)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={p.stock_actual < p.stock_minimo ? "destructive" : "secondary"}>
                    {p.stock_actual < p.stock_minimo ? "Bajo stock" : "OK"}
                  </Badge>
                </TableCell>
                {(canEdit(user) || canDelete(user)) && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {canEdit(user) && (
                        <Button variant="ghost" size="icon" onClick={() => openEditar(p)}>
                          <Pencil size={16} />
                        </Button>
                      )}
                      {canDelete(user) && (
                        <Button variant="ghost" size="icon" onClick={() => handleEliminar(p)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {editando ? "Modificá los datos del producto." : "Completá los datos para crear un nuevo producto."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
              <Select
                value={String(form.categoria_id)}
                onValueChange={(v) => setForm({ ...form, categoria_id: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Actual</label>
                <Input type="number" min={0} value={form.stock_actual} onChange={(e) => setForm({ ...form, stock_actual: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
                <Input type="number" min={0} value={form.stock_minimo} onChange={(e) => setForm({ ...form, stock_minimo: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio Unitario *</label>
              <Input type="number" min={0.01} step={0.01} value={form.precio_unitario} onChange={(e) => setForm({ ...form, precio_unitario: Number(e.target.value) })} placeholder="0.00" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGuardar} disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editando ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
