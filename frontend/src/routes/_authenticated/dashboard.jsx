// frontend/src/routes/_authenticated/dashboard.jsx

import { createFileRoute } from "@tanstack/react-router";
import LearningList from "../../pages/LearningList";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: LearningList,
});