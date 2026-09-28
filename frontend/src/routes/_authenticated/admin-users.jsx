// frontend/src/routes/_authenticated/admin-users.jsx

import { createFileRoute } from "@tanstack/react-router";
import AdminUsers from "../../pages/AdminUsers";

export const Route = createFileRoute("/_authenticated/admin-users")({
  component: AdminUsers,
});
