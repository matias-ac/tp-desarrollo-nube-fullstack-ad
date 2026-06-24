interface User {
  id: string;
  name: string;
  role: string;
}

export const ROLES = {
  ADMIN: "Admin",
  OPERADOR: "Operador",
  CONSULTA: "Consulta",
} as const;

export function canCreate(user: User | null): boolean {
  return user?.role === ROLES.ADMIN;
}

export function canEdit(user: User | null): boolean {
  return user?.role === ROLES.ADMIN;
}

export function canDelete(user: User | null): boolean {
  return user?.role === ROLES.ADMIN;
}

export function canRegisterMovements(user: User | null): boolean {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.OPERADOR;
}

export function canExport(user: User | null): boolean {
  return user?.role === ROLES.ADMIN;
}

export function canViewProductos(user: User | null): boolean {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.OPERADOR;
}

export function canViewMovimientos(user: User | null): boolean {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.OPERADOR;
}

export function canViewReportes(user: User | null): boolean {
  return user?.role === ROLES.ADMIN;
}
