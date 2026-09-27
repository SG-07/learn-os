// frontend/src/components/Modal.jsx

import { createFileRoute } from "@tanstack/react-router";

import QuestionPage from "../../../pages/QuestionPage";

export const Route = createFileRoute("/_authenticated/questions/$questionId")({
  component: QuestionPage,
});

