import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, PackageSearch, ArrowRightLeft, FileBarChart,
  Clock, LogOut, ChevronDown, Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { canViewProductos, canViewMovimientos, canViewReportes } from "../utils/permissions";

const navItems = [
  { label: "Vista General de Stock", path: "/dashboard", icon: LayoutDashboard, visible: () => true },
  { label: "Gestión de Productos", path: "/productos", icon: PackageSearch, visible: (u: Parameters<typeof canViewProductos>[0]) => canViewProductos(u) },
  { label: "Movimientos", path: "/movimientos", icon: ArrowRightLeft, visible: (u: Parameters<typeof canViewMovimientos>[0]) => canViewMovimientos(u) },
  { label: "Reportes", path: "/reportes", icon: FileBarChart, visible: (u: Parameters<typeof canViewReportes>[0]) => canViewReportes(u) },
];

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const hour = new Date().getHours();
  const timeStatus = hour >= 8 && hour < 18;

  const filteredNav = navItems.filter((item) => item.visible(user));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg tracking-wide">StockControl AD</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 text-sm font-medium">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
            <p className="text-slate-400 mb-1">Sincronización AD:</p>
            <p className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Verificado al inicio de sesión
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              timeStatus ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              <Clock size={14} />
              {timeStatus ? "Hora actual dentro del rango de acceso" : "Fuera del rango de acceso óptimo"}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 p-1.5 rounded-lg h-auto">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {user?.id?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider">{user?.id}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }} className="text-red-600 hover:bg-red-50">
                  <LogOut size={14} />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
