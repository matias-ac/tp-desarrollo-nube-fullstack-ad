import { createBrowserRouter, Outlet } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Productos } from "./components/Productos";
import { Movimientos } from "./components/Movimientos";
import { Reportes } from "./components/Reportes";
import { Unauthorized } from "./components/Unauthorized";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleRoute } from "./components/RoleRoute";
import { Layout } from "./components/Layout";
import { ROLES } from "./utils/permissions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/unauthorized",
    Component: Unauthorized,
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
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <RoleRoute roles={[ROLES.ADMIN, ROLES.OPERADOR]}>
          <Layout>
            <Outlet />
          </Layout>
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: "/productos", Component: Productos },
      { path: "/movimientos", Component: Movimientos },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <RoleRoute roles={[ROLES.ADMIN]}>
          <Layout>
            <Outlet />
          </Layout>
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: "/reportes", Component: Reportes },
    ],
  },
]);
