import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export interface Movimiento {
  id: number;
  producto_id: number;
  producto_nombre: string;
  tipo: "ingreso" | "egreso" | "ajuste";
  cantidad: number;
  usuario_id: string;
  observacion: string;
  created_at: string;
}

interface MovimientoFormData {
  producto_id: number;
  tipo: string;
  cantidad: number;
  observacion?: string;
}

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const listar = useCallback(async (filtros?: Record<string, string>) => {
    setLoading(true);
    try {
      const params = filtros ? "?" + new URLSearchParams(filtros).toString() : "";
      const data = await api.get<{ movimientos: Movimiento[] }>(`/movimientos${params}`);
      setMovimientos(data.movimientos);
    } catch {
      // error handled by api.ts
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listar();
  }, [listar]);

  const registrar = async (data: MovimientoFormData): Promise<Movimiento> => {
    const nuevo = await api.post<Movimiento>("/movimientos", data);
    setMovimientos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  return { movimientos, loading, listar, registrar };
}
