import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <>
        <Toaster richColors />
        <RouterProvider router={router} />
      </>
    </AuthProvider>
  );
}
