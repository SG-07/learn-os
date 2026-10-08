// frontend/src/pages/SqlAssistantPage.jsx

import { useState } from "react";
import { Sparkles, HelpCircle, Code, CheckCircle, Database } from "lucide-react";
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

  const handleCheckAttempt = async (attemptText) => {
    setIsLoading(true);
    setError(null);
    const nextHistory = [...history, { role: "user", content: `My attempt:\n${attemptText}` }];
    setHistory(nextHistory);
    try {
      const result = await getAiGuidance({
        question,
        schema,
        history: nextHistory,
        userAttempt: attemptText,
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
      const nextQuestion = typeof result.question === "string" ? result.question : "";
      const nextSchema = result.schema || "";
      resetSession();
      setMode("teach");
      setQuestion(nextQuestion);
      setSchema(nextSchema);
      setMermaidSource(result.mermaid || "");

      const guidance = await getAiGuidance({
        question: nextQuestion,
        schema: nextSchema,
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
  const canAttempt = mode === "teach" && question.trim().length > 0 && !solved;
  const assistantBusy = isLoading || isPracticeLoading;

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Left Workspace Pane: Prompt & ER Diagram */}
      <section className="w-full lg:w-[35%] xl:w-[32%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-6">
          <div>
            <BackButton to="/dashboard" label="Dashboard" />
          </div>

          <QuestionInputForm
            mode={mode}
            onModeChange={setMode}
            onAsk={handleAsk}
            isLoading={assistantBusy}
            questionValue={question}
            schemaValue={schema}
          />

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-xs font-semibold text-rose-700 dark:border-rose-950/60 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          {question && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Problem
              </h2>
              <p className="mt-1.5 whitespace-pre-wrap text-xs font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {question}
              </p>
              {schema && (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-100 p-2.5 font-mono text-[11px] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {schema}
                </pre>
              )}
            </div>
          )}

          {mermaidSource && (
            <div>
              <SchemaDiagram mermaidSource={mermaidSource} />
            </div>
          )}
        </div>
      </section>

      {/* Right Workspace Pane: Query sandbox & Socratic assistant */}
      <section className="flex w-full lg:w-[65%] xl:w-[68%] flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* Top: 58% - Code Attempt Editor */}
        <div className="h-[58%] overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <SqlEditor
            value={attempt}
            onChange={setAttempt}
            onSubmit={() => handleCheckAttempt(attempt.trim())}
            showHelpers={false}
            submitLabel={assistantBusy ? "Evaluating..." : "Check My Solution"}
            subtitle={
              canAttempt
                ? "Test your proposed query with the AI tutor for step-by-step guidance."
                : "Submit a question to activate the interactive query workspace."
            }
            placeholder="Write your SQL solution attempt here..."
            readOnly={!canAttempt}
            submitDisabled={!canAttempt || !attempt.trim() || assistantBusy}
          />
        </div>

        {/* Bottom: 42% - AI Feedback & Socratic Stream */}
        <div className="h-[42%] overflow-hidden">
          <FeedbackPanel
            status={
              mode === "teach" && solved
                ? "correct"
                : history.length > 0 || answer
                  ? "guiding"
                  : "idle"
            }
            messages={mode === "teach" ? history : []}
            isLoading={assistantBusy}
            onNextHint={canAttempt ? handleNextHint : undefined}
            idleText="Ask a SQL question on the left to start receiving personalized Socratic guidance."
          >
            {mode === "answer" && answer && <AnswerPanel answer={answer} />}
            {showReinforcement && (
              <div className="pt-2">
                <ReinforcementPrompt onPractice={handlePracticeSimilar} isLoading={isPracticeLoading} />
              </div>
            )}
          </FeedbackPanel>
        </div>
      </section>
    </div>
  );
}

export default SqlAssistantPage;

