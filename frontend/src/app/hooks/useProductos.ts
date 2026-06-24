import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "../services/api";

export interface Producto {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria_nombre: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
}

interface ProductoFormData {
  nombre: string;
  categoria_id: number;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ productos: Producto[] }>("/productos");
      setProductos(data.productos);
    } catch {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listar();
  }, [listar]);

  const crear = async (data: ProductoFormData): Promise<Producto> => {
    const nuevo = await api.post<Producto>("/productos", data);
    setProductos((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const actualizar = async (id: number, data: Partial<ProductoFormData>): Promise<Producto> => {
    const actualizado = await api.put<Producto>(`/productos/${id}`, data);
    setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  };

  const eliminar = async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return { productos, loading, listar, crear, actualizar, eliminar };
}
