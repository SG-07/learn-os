import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/layout/Navbar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}