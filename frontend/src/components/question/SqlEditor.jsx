// frontend/src/components/question/SqlEditor.jsx

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import Modal from "../common/Modal";
function SqlEditor({
  value,
  onChange,
  onRun,
  onSubmit,
  runDisabled = false,
  submitDisabled = false,
  placeholder = "Write your SQL query here...",
}) {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isExpectedResultOpen, setIsExpectedResultOpen] = useState(false);
  return (
    <>
      {" "}
      <div className="relative flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900">
        {" "}
        {/* Editor Header */}{" "}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          {" "}
          <div>
            {" "}
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {" "}
              SQL Query{" "}
            </h2>{" "}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {" "}
              Write your query and run it to see the result.{" "}
            </p>{" "}
          </div>{" "}
          {/* Actions */}{" "}
          <div className="flex items-center gap-2">
            {" "}
            <button
              type="button"
              onClick={onRun}
              disabled={runDisabled}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {" "}
              Run{" "}
            </button>{" "}
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              Submit{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* SQL Editor */}{" "}
        <div className="min-h-0 flex-1 overflow-auto">
          {" "}
          <CodeMirror
            value={value}
            height="100%"
            extensions={[sql()]}
            onChange={onChange}
            editable={!submitDisabled}
            placeholder={placeholder}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              autocompletion: true,
            }}
            className="h-full text-sm"
          />{" "}
        </div>{" "}
        {/* ================================================= Floating Help Buttons ================================================= The wrapper itself is vertically centered. The buttons have fixed positions inside it: 0px 52px 104px Therefore hovering one button can NEVER move another button. ================================================= */}{" "}
        <div className="absolute right-3 top-1/2 z-20 h-[144px] w-10 -translate-y-1/2">
          {" "}
          {/* Hint */}{" "}
          <button
            type="button"
            onClick={() => setIsHintOpen(true)}
            className="group absolute right-0 top-0 flex h-10 w-10 origin-right items-center justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-[width] duration-200 hover:w-32 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            {" "}
            <span className="mr-2 whitespace-nowrap text-xs font-medium text-gray-700 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-gray-300">
              {" "}
              Hint{" "}
            </span>{" "}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-600 dark:text-gray-300">
              {" "}
              <HintIcon />{" "}
            </span>{" "}
          </button>{" "}
          {/* Expected Result */}{" "}
          <button
            type="button"
            onClick={() => setIsExpectedResultOpen(true)}
            className="group absolute right-0 top-[52px] flex h-10 w-10 origin-right items-center justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-[width] duration-200 hover:w-36 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            {" "}
            <span className="mr-2 whitespace-nowrap text-xs font-medium text-gray-700 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-gray-300">
              {" "}
              Expected Result{" "}
            </span>{" "}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-600 dark:text-gray-300">
              {" "}
              <TableIcon />{" "}
            </span>{" "}
          </button>{" "}
          {/* Walkthrough */}{" "}
          <button
            type="button"
            onClick={() => setIsWalkthroughOpen(true)}
            className="group absolute right-0 top-[104px] flex h-10 w-10 origin-right items-center justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-[width] duration-200 hover:w-32 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            {" "}
            <span className="mr-2 whitespace-nowrap text-xs font-medium text-gray-700 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-gray-300">
              {" "}
              Walkthrough{" "}
            </span>{" "}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-600 dark:text-gray-300">
              {" "}
              <WalkthroughIcon />{" "}
            </span>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Hint Modal */}{" "}
      <Modal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        title="Hint"
      >
        {" "}
        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
          {" "}
          Think about which comparison operator is used when we want values
          greater than 50000.{" "}
        </p>{" "}
      </Modal>{" "}
      {/* Walkthrough Modal */}{" "}
      <Modal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        title="Walkthrough"
      >
        {" "}
        <div className="space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
          {" "}
          <p>1. Identify the table you need to query.</p>{" "}
          <p>2. Select the column containing salary information.</p>{" "}
          <p>3. Use WHERE to filter the rows.</p>{" "}
          <p>4. Use the appropriate comparison operator.</p>{" "}
        </div>{" "}
      </Modal>{" "}
      {/* Expected Result Modal */}{" "}
      <Modal
        isOpen={isExpectedResultOpen}
        onClose={() => setIsExpectedResultOpen(false)}
        title="Expected Result"
      >
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="min-w-full text-left text-sm">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {" "}
                <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                  {" "}
                  id{" "}
                </th>{" "}
                <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                  {" "}
                  name{" "}
                </th>{" "}
                <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                  {" "}
                  salary{" "}
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  1{" "}
                </td>{" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  Rahul{" "}
                </td>{" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  60000{" "}
                </td>{" "}
              </tr>{" "}
              <tr>
                {" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  3{" "}
                </td>{" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  Amit{" "}
                </td>{" "}
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {" "}
                  75000{" "}
                </td>{" "}
              </tr>{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </Modal>{" "}
    </>
  );
}
/* ========================================================= Icons ========================================================= */ function HintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18h6M10 21h4M8.5 14.5C7.57 13.72 7 12.56 7 11.25a5 5 0 1 1 10 0c0 1.31-.57 2.47-1.5 3.25-.7.59-1.1 1.2-1.3 1.5h-4.4c-.2-.3-.6-.91-1.3-1.5Z"
      />{" "}
    </svg>
  );
}
function TableIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      {" "}
      <rect x="3" y="4" width="18" height="16" rx="2" />{" "}
      <path d="M3 9h18M9 9v11M15 9v11" />{" "}
    </svg>
  );
}
function WalkthroughIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5v-14Z"
      />{" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5v14M8 8h8M8 12h8"
      />{" "}
    </svg>
  );
}
export default SqlEditor;
