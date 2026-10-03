// frontend/src/pages/SqlAssistantPage.jsx

import { useState } from "react";
import QuestionInputForm from "../components/sql-assistant/QuestionInputForm";
import SchemaDiagram from "../components/sql-assistant/SchemaDiagram";
import SqlEditor from "../components/question/SqlEditor";
import FeedbackPanel from "../components/question/FeedbackPanel";
import AnswerPanel from "../components/sql-assistant/AnswerPanel";
import ReinforcementPrompt from "../components/sql-assistant/ReinforcementPrompt";
import BackButton from "../components/common/BackButton";
import { getAiAnswer, getAiGuidance, getSimilarQuestion } from "../api/ai";

function SqlAssistantPage() {
  const [mode, setMode] = useState("teach");
  const [question, setQuestion] = useState("");
  const [schema, setSchema] = useState("");
  const [mermaidSource, setMermaidSource] = useState("");
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [solved, setSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState("");

  const resetSession = () => {
    setAttempt("");
    setHistory([]);
    setAnswer(null);
    setSolved(false);
    setMermaidSource("");
    setError(null);
  };

  const handleAsk = async ({ question: newQuestion, schema: newSchema }) => {
    resetSession();
    setQuestion(newQuestion);
    setSchema(newSchema);
    setIsLoading(true);

    try {
      if (mode === "answer") {
        const result = await getAiAnswer({ question: newQuestion, schema: newSchema });
        setAnswer(result);
        setMermaidSource(result.mermaid || "");
      } else {
        const result = await getAiGuidance({
          question: newQuestion,
          schema: newSchema,
          history: [],
        });
        setHistory([{ role: "assistant", content: result.message }]);
        setMermaidSource(result.mermaid || "");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextHint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAiGuidance({ question, schema, history });
      setHistory((prev) => [...prev, { role: "assistant", content: result.message }]);
      if (result.solved) setSolved(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAttempt = async (attempt) => {
    setIsLoading(true);
    setError(null);
    const nextHistory = [...history, { role: "user", content: `My attempt:\n${attempt}` }];
    setHistory(nextHistory);
    try {
      const result = await getAiGuidance({
        question,
        schema,
        history: nextHistory,
        userAttempt: attempt,
      });
      setHistory((prev) => [...prev, { role: "assistant", content: result.message }]);
      if (result.solved) setSolved(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeSimilar = async () => {
    setIsPracticeLoading(true);
    setError(null);
    try {
      const result = await getSimilarQuestion({ originalQuestion: question, schema });
      resetSession();
      setQuestion(result.question);
      setSchema(result.schema || "");
      setMermaidSource(result.mermaid || "");

      const guidance = await getAiGuidance({
        question: result.question,
        schema: result.schema || "",
        history: [],
      });
      setHistory([{ role: "assistant", content: guidance.message }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsPracticeLoading(false);
    }
  };

  const showReinforcement = mode === "teach" ? solved : Boolean(answer);
  const canAttempt = mode === "teach" && history.length > 0 && !solved;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex min-h-0 flex-1 gap-0 overflow-hidden">
        {/* Left: 30% - Input & Schema */}
        <section className="w-[30%] overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="p-4">
            <div className="mb-4">
              <BackButton to="/dashboard" label="Dashboard" />
            </div>
            <QuestionInputForm mode={mode} onModeChange={setMode} onAsk={handleAsk} isLoading={isLoading} />

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            {mermaidSource && (
              <div className="mt-6">
                <SchemaDiagram mermaidSource={mermaidSource} />
              </div>
            )}
          </div>
        </section>

        {/* Right: 70% */}
        <section className="flex w-[70%] flex-col overflow-hidden">
          {/* Top: 60% - Query editor */}
          <div className="h-[60%] overflow-hidden border-b border-gray-200 dark:border-gray-800">
            <SqlEditor
              value={attempt}
              onChange={setAttempt}
              onSubmit={() => handleCheckAttempt(attempt.trim())}
              showHelpers={false}
              submitLabel={isLoading ? "Checking..." : "Check my attempt"}
              subtitle={
                canAttempt
                  ? "Write your attempt and check it with the assistant."
                  : "Ask a question in teach mode to start writing attempts."
              }
              placeholder="Write your SQL attempt here..."
              readOnly={!canAttempt}
              submitDisabled={!canAttempt || !attempt.trim() || isLoading}
            />
          </div>

          {/* Bottom: 40% - LLM feedback */}
          <div className="h-[40%] overflow-hidden">
            <FeedbackPanel
              status={
                mode === "teach" && solved
                  ? "correct"
                  : history.length > 0 || answer
                    ? "guiding"
                    : "idle"
              }
              messages={mode === "teach" ? history : []}
              isLoading={isLoading}
              onNextHint={mode === "teach" && history.length > 0 && !solved ? handleNextHint : undefined}
              idleText="Ask a question to get feedback here."
            >
              {mode === "answer" && answer && <AnswerPanel answer={answer} />}
              {showReinforcement && (
                <ReinforcementPrompt onPractice={handlePracticeSimilar} isLoading={isPracticeLoading} />
              )}
            </FeedbackPanel>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SqlAssistantPage;
