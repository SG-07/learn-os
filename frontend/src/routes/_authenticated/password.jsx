// frontend/src/routes/_authenticated/password.jsx

import { createFileRoute } from "@tanstack/react-router";
import Settings from "../../pages/Settings";

export const Route = createFileRoute("/_authenticated/password")({
  component: Settings,
});
