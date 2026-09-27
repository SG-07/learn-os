// frontend/src/roots/__root.jsx

import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/layout/Navbar";
import NotFoundPage from "../pages/NotFoundPage";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}