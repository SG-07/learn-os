// frontend/src/routes/_authenticated/dashboard.jsx

import { createFileRoute } from "@tanstack/react-router";
import DashboardHome from "../../pages/DashboardHome";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardHome,
});