import { Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboardData } from "../hooks/useDashboardData";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

export function Dashboard() {
  const { summary, topProducts, movementsWeekly, categoryDist, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-lg">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Vista General de Stock</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de inventario y movimientos recientes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Productos" value={summary?.total_productos?.toLocaleString() ?? "—"} />
        <StatCard title="Bajo Stock" value={summary?.bajo_stock?.toString() ?? "—"} />
        <StatCard title="Movimientos Hoy" value={summary?.movimientos_hoy?.toString() ?? "—"} />
        <StatCard title="Valor Estimado" value={summary ? `$${(summary.valor_estimado / 1000).toFixed(1)}k` : "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Productos más vendidos</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="h-72">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Sin datos</div>
            )}
          </div>
        </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Movimientos semanales</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="h-72">
            {movementsWeekly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={movementsWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                  <Line type="monotone" dataKey="salidas" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Sin datos</div>
            )}
          </div>
        </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Distribución de stock por categoría</h3>
            <p className="text-sm text-slate-500 mb-6">Proporción del inventario total distribuido en las principales familias de productos.</p>
            {categoryDist.length > 0 ? (
              <div className="space-y-3">
                {categoryDist.map((entry, index) => {
                  const total = categoryDist.reduce((a, b) => a + b.value, 0);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-slate-600">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {((entry.value / total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Sin datos</p>
            )}
          </div>
          <div className="w-full md:w-1/2 h-64 mt-6 md:mt-0">
            {categoryDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDist}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDist.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Sin datos</div>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="px-5 pt-5 pb-0">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </CardContent>
    </Card>
  );
}
