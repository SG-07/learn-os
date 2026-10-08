const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

// Problem rows do not store easy/medium/hard, and the questions API sends the
// topic tier instead. These prompts are copied from the stored questions and
// the expanded question bank.
export const QUESTION_DIFFICULTY_ENTRIES = [
  { prompt: "Retrieve the names of all employees who work in the Sales department.", difficulty: "easy" },
  { prompt: "List the names of employees who work in the Sales department and earn more than 62000.", difficulty: "medium" },
  { prompt: "List each employee\u2019s name and salary, sorted from highest to lowest salary.", difficulty: "easy" },
  { prompt: "Return the names and salaries of the employees with the second and third highest salaries, ordered by salary descending.", difficulty: "hard" },
  { prompt: "Return each employee's name along with the name of the department they belong to.", difficulty: "easy" },
  { prompt: "Count how many employees work in each department.", difficulty: "easy" },
  { prompt: "Which departments have an average salary above 65000? List each department and its average salary.", difficulty: "medium" },
  { prompt: "Write a query that lists each employee's name along with the name of every project in the same department, but only for departments that have more than one employee.", difficulty: "hard" },
  { prompt: "Return the names of employees whose salary is greater than the average salary of their department.", difficulty: "hard" },
  { prompt: "Using a CTE, calculate the total salary per department and return the department name and total salary for departments whose total salary is greater than 150,000.", difficulty: "hard" },
  { prompt: "List the name of every employee.", difficulty: "easy" },
  { prompt: "List each employee name together with the department they work in.", difficulty: "medium" },
  { prompt: "Show each employee name and salary. Label the output columns employee_name and employee_salary.", difficulty: "medium" },
  { prompt: "For each employee, show the name and a monthly salary calculated with integer division of the annual salary by 12. Label the outputs employee_name and monthly_salary.", difficulty: "hard" },
  { prompt: "List the names of employees who work in Engineering.", difficulty: "easy" },
  { prompt: "List the name and salary of employees who earn more than 80000.", difficulty: "easy" },
  { prompt: "List the name and department of employees who work in HR or Engineering.", difficulty: "medium" },
  { prompt: "List the name, department, and salary of employees who do not work in Sales and earn at least 70000.", difficulty: "hard" },
  { prompt: "List employee names in alphabetical order.", difficulty: "easy" },
  { prompt: "List each employee name and department, sorted by department name and then by employee name.", difficulty: "medium" },
  { prompt: "List each employee name and salary from the lowest salary to the highest.", difficulty: "medium" },
  { prompt: "List each employee name, department, and salary. Sort departments from A to Z, and within each department put the higher salary first.", difficulty: "hard" },
  { prompt: "Return the name and salary of the two highest-paid employees, with the highest salary first.", difficulty: "easy" },
  { prompt: "Return the first three employee names in alphabetical order.", difficulty: "easy" },
  { prompt: "Return the name and salary of the employee with the second-highest salary.", difficulty: "medium" },
  { prompt: "After sorting employee names alphabetically, skip the first two names and return the remaining names.", difficulty: "medium" },
  { prompt: "List each project name with the name of the department that owns it.", difficulty: "easy" },
  { prompt: "List each employee name with the name of every project that belongs to that employee department.", difficulty: "medium" },
  { prompt: "List the name, salary, and department name of employees in Engineering.", difficulty: "medium" },
  { prompt: "For every employee who shares a department with a project, list the employee name, department name, and project name.", difficulty: "hard" },
  { prompt: "What is the total salary paid in each department? Return the department and the total.", difficulty: "easy" },
  { prompt: "What is the average salary in each department? Return the department and the average.", difficulty: "medium" },
  { prompt: "What is the highest salary in each department? Return the department and that salary.", difficulty: "medium" },
  { prompt: "For each department, show how many employees it has and the total salary paid.", difficulty: "hard" },
  { prompt: "Which departments have more than one employee? Return the department name.", difficulty: "easy" },
  { prompt: "Which departments have a total salary greater than 100000? Return the department and the total.", difficulty: "easy" },
  { prompt: "Which departments employ more than two people? Return the department and the employee count.", difficulty: "medium" },
  { prompt: "Which departments have a total salary above 80000? Return the department, the employee count, and the total salary.", difficulty: "hard" },
  { prompt: "List every employee and the project in the same department. Include employees whose department has no project.", difficulty: "easy" },
  { prompt: "Which departments have no projects? Return the department name.", difficulty: "easy" },
  { prompt: "List the employee name, department name, and project name for departments that have exactly one project.", difficulty: "medium" },
  { prompt: "List each employee once with their department name, but only when that department has at least one project.", difficulty: "medium" },
  { prompt: "List the names of employees who earn more than the average salary of the whole company.", difficulty: "easy" },
  { prompt: "List the names of employees who belong to the department named Sales.", difficulty: "easy" },
  { prompt: "List the names of employees whose department has at least one project.", difficulty: "medium" },
  { prompt: "List department names whose average salary is higher than the average salary of all employees.", difficulty: "medium" },
  { prompt: "Using a CTE, list every department name.", difficulty: "easy" },
  { prompt: "Using a CTE of employee names and salaries, list the names of employees who earn more than 70000.", difficulty: "easy" },
  { prompt: "Using a CTE, count the employees in each department and return only departments with more than one employee, including the count.", difficulty: "medium" },
  { prompt: "Using a CTE, count the projects in every department, including departments that have no projects. Return the department name and the project count.", difficulty: "medium" },
];

const DIFFICULTY_BY_PROMPT = new Map(
  QUESTION_DIFFICULTY_ENTRIES.map((entry) => [entry.prompt, entry.difficulty]),
);

const DIFFICULTY_RANK = { easy: 0, medium: 1, hard: 2 };

export function questionDifficulty(question) {
  const raw = String(question?.difficulty || "").toLowerCase();
  if (VALID_DIFFICULTIES.has(raw)) return raw;

  const prompt = questionPrompt(question);
  return DIFFICULTY_BY_PROMPT.get(prompt) || "";
}

export function orderQuestions(questions) {
  return questions
    .map((question, index) => ({ question, index }))
    .sort((left, right) => {
      const leftRank = DIFFICULTY_RANK[questionDifficulty(left.question)] ?? 3;
      const rightRank = DIFFICULTY_RANK[questionDifficulty(right.question)] ?? 3;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.index - right.index;
    })
    .map((entry) => entry.question);
}

export function collectDifficultyIssues(entries = QUESTION_DIFFICULTY_ENTRIES) {
  const issues = [];
  const seenPrompts = new Set();

  for (const entry of entries) {
    if (!VALID_DIFFICULTIES.has(entry.difficulty)) {
      issues.push({ type: "invalid", prompt: entry.prompt, difficulty: entry.difficulty });
    }
    if (seenPrompts.has(entry.prompt)) {
      issues.push({ type: "duplicate", prompt: entry.prompt });
    }
    seenPrompts.add(entry.prompt);
  }

  return issues;
}

export function auditQuestionDifficulties(questions, entries = QUESTION_DIFFICULTY_ENTRIES) {
  const issues = collectDifficultyIssues(entries);
  const known = new Set(entries.map((entry) => entry.prompt));

  for (const question of questions) {
    const prompt = questionPrompt(question);
    if (!known.has(prompt)) {
      issues.push({ type: "unmapped", prompt });
    }
  }

  return issues;
}

export function auditReferenceQuestions(questions, entries = QUESTION_DIFFICULTY_ENTRIES) {
  const issues = collectDifficultyIssues(entries);
  const known = new Map(entries.map((entry) => [entry.prompt, entry.difficulty]));

  for (const question of questions) {
    const mapped = known.get(question.prompt);
    if (!mapped) {
      issues.push({ type: "unmapped", prompt: question.prompt });
    } else if (mapped !== question.difficulty) {
      issues.push({
        type: "reclassified",
        prompt: question.prompt,
        expected: question.difficulty,
        actual: mapped,
      });
    }
  }

  return issues;
}

function questionPrompt(question) {
  return question?.prompt || question?.title || question?.name || "";
}
