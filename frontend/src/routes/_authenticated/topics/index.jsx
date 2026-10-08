// frontend/src/routes/_authenticated/topics/index.jsx

import { createFileRoute } from "@tanstack/react-router";
import StudyPlan from "../../../pages/StudyPlan";

export const Route = createFileRoute("/_authenticated/topics/")({
  component: StudyPlan,
});
