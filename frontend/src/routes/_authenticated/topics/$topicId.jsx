// frontend/src/routes/_authenticated/topics/$topicId.jsx

import { createFileRoute } from "@tanstack/react-router";
import LearningList from "../../../pages/LearningList";

export const Route = createFileRoute("/_authenticated/topics/$topicId")({
  component: LearningList,
});