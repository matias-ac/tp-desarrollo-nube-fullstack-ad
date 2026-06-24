import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  LayoutDashboard, PackageSearch, ArrowRightLeft, FileBarChart,
  Clock, LogOut, ChevronDown, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from "../contexts/AuthContext";

const barData = [
  { name: 'Laptops', ventas: 120 },
  { name: 'Monitores', ventas: 85 },
  { name: 'Teclados', ventas: 150 },
  { name: 'Mouse', ventas: 180 },
  { name: 'Cables', ventas: 210 },
];

const pieData = [
  { name: 'Electrónica', value: 400 },
  { name: 'Accesorios', value: 300 },
  { name: 'Repuestos', value: 300 },
  { name: 'Insumos', value: 200 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const lineData = [
  { day: 'Lun', entradas: 40, salidas: 24 },
  { day: 'Mar', entradas: 30, salidas: 13 },
  { day: 'Mié', entradas: 20, salidas: 38 },
  { day: 'Jue', entradas: 27, salidas: 39 },
  { day: 'Vie', entradas: 18, salidas: 48 },
];

const users = [
  { id: 'logistica.user', role: 'Operador' },
  { id: 'gerencia.admin', role: 'Admin' },
  { id: 'consulta.user', role: 'Consulta' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [timeStatus, setTimeStatus] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if within access range 8:00 - 18:00 for aesthetic status indicator
    const hour = new Date().getHours();
    setTimeStatus(hour >= 8 && hour < 18);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg tracking-wide">StockControl AD</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 text-sm font-medium">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600/10 text-blue-400 rounded-lg">
            <LayoutDashboard size={18} />
            Vista General de Stock
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <PackageSearch size={18} />
            Gestión de Productos
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <ArrowRightLeft size={18} />
            Movimientos
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <FileBarChart size={18} />
            Reportes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
            <p className="text-slate-400 mb-1">Sincronización AD:</p>
            <p className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Conectado
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${timeStatus ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
              <Clock size={14} />
              {timeStatus ? 'Hora actual dentro del rango de acceso' : 'Fuera del rango de acceso óptimo'}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {currentUser.id.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{currentUser.id}</p>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cambiar Usuario</p>
                  </div>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${currentUser.id === u.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {u.id} <span className="text-xs text-slate-400 ml-1">({u.role})</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1">
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Vista General de Stock</h1>
              <p className="text-slate-500 text-sm mt-1">Resumen de inventario y movimientos recientes</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Total Productos', value: '4,285', change: '+12%' },
                { title: 'Bajo Stock', value: '38', change: '-5%' },
                { title: 'Movimientos Hoy', value: '156', change: '+24%' },
                { title: 'Valor Estimado', value: '$245k', change: '+2%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Productos más vendidos */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Productos más vendidos</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Movimientos semanales */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Movimientos semanales</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="salidas" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribución por categoría */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center justify-between">
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Distribución de stock por categoría</h3>
                  <p className="text-sm text-slate-500 mb-6">Proporción del inventario total distribuido en las principales familias de productos.</p>

                  <div className="space-y-3">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-sm text-slate-600">{entry.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{((entry.value / 1200) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-1/2 h-64 mt-6 md:mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
