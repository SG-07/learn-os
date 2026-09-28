// frontend/src/routes/_authenticated/sql-assistant.jsx

import { createFileRoute } from "@tanstack/react-router";

import SqlAssistantPage from "../../pages/SqlAssistantPage";

export const Route = createFileRoute("/_authenticated/sql-assistant")({
  component: SqlAssistantPage,
});
