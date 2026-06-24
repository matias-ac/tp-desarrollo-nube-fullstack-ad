import { createBrowserRouter, Outlet } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Productos } from "./components/Productos";
import { Movimientos } from "./components/Movimientos";
import { Reportes } from "./components/Reportes";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/productos", Component: Productos },
      { path: "/movimientos", Component: Movimientos },
      { path: "/reportes", Component: Reportes },
    ],
  },
]);
