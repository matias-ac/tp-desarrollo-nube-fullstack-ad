import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../services/api";

interface Summary {
  total_productos: number;
  bajo_stock: number;
  movimientos_hoy: number;
  valor_estimado: number;
}

interface TopProduct {
  name: string;
  ventas: number;
}

interface MovementDay {
  day: string;
  entradas: number;
  salidas: number;
}

interface CategoryDist {
  name: string;
  value: number;
}

export function useDashboardData() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [movementsWeekly, setMovementsWeekly] = useState<MovementDay[]>([]);
  const [categoryDist, setCategoryDist] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Summary>("/dashboard/summary"),
      api.get<TopProduct[]>("/dashboard/top-products"),
      api.get<MovementDay[]>("/dashboard/movements-weekly"),
      api.get<CategoryDist[]>("/dashboard/category-distribution"),
    ])
      .then(([s, tp, mw, cd]) => {
        setSummary(s);
        setTopProducts(tp);
        setMovementsWeekly(mw);
        setCategoryDist(cd);
      })
      .catch(() => toast.error("Error al cargar los datos del dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { summary, topProducts, movementsWeekly, categoryDist, loading };
}
