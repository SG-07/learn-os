-- Additional practice questions for user testing.
-- Inserts only. Existing problems are matched by topic title and prompt and are left unchanged.

-- SELECT basics / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the name of every employee.$prompt$, $sql$SELECT name AS employee_name FROM employees$sql$, $expected$[{"employee_name":"Alice"},{"employee_name":"Bob"},{"employee_name":"Charlie"},{"employee_name":"Diana"},{"employee_name":"Eve"}]$expected$::jsonb, $hints$[{"level":1,"text":"Read every row and return one column. No filter is needed."},{"level":2,"text":"Use the employees table and its name column."},{"level":3,"text":"Select the name column and give it a clear output alias."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'SELECT basics'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the name of every employee.$prompt$
  );

-- SELECT basics / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee name together with the department they work in.$prompt$, $sql$SELECT name AS employee_name, department FROM employees$sql$, $expected$[{"employee_name":"Alice","department":"Sales"},{"employee_name":"Bob","department":"Engineering"},{"employee_name":"Charlie","department":"Sales"},{"employee_name":"Diana","department":"HR"},{"employee_name":"Eve","department":"Sales"}]$expected$::jsonb, $hints$[{"level":1,"text":"Return two columns from the same table, with one row per employee."},{"level":2,"text":"Use the name and department columns from employees."},{"level":3,"text":"Select both columns in one statement. Do not group or filter the rows."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'SELECT basics'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee name together with the department they work in.$prompt$
  );

-- SELECT basics / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Show each employee name and salary. Label the output columns employee_name and employee_salary.$prompt$, $sql$SELECT name AS employee_name, salary AS employee_salary FROM employees$sql$, $expected$[{"employee_name":"Alice","employee_salary":60000},{"employee_name":"Bob","employee_salary":90000},{"employee_name":"Charlie","employee_salary":65000},{"employee_name":"Diana","employee_salary":70000},{"employee_name":"Eve","employee_salary":62000}]$expected$::jsonb, $hints$[{"level":1,"text":"The report needs renamed output columns, not the raw column names."},{"level":2,"text":"Start from employees.name and employees.salary."},{"level":3,"text":"Use AS to label the name and salary outputs with the requested names."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'SELECT basics'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Show each employee name and salary. Label the output columns employee_name and employee_salary.$prompt$
  );

-- SELECT basics / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$For each employee, show the name and a monthly salary calculated with integer division of the annual salary by 12. Label the outputs employee_name and monthly_salary.$prompt$, $sql$SELECT name AS employee_name, salary / 12 AS monthly_salary FROM employees$sql$, $expected$[{"employee_name":"Alice","monthly_salary":5000},{"employee_name":"Bob","monthly_salary":7500},{"employee_name":"Charlie","monthly_salary":5416},{"employee_name":"Diana","monthly_salary":5833},{"employee_name":"Eve","monthly_salary":5166}]$expected$::jsonb, $hints$[{"level":1,"text":"Add a calculated column. Integer division drops the fractional part."},{"level":2,"text":"The annual amount is employees.salary. Divide that column by 12."},{"level":3,"text":"Select the name and the division expression, each with its own output alias."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'SELECT basics'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$For each employee, show the name and a monthly salary calculated with integer division of the annual salary by 12. Label the outputs employee_name and monthly_salary.$prompt$
  );

-- WHERE conditions / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the names of employees who work in Engineering.$prompt$, $sql$SELECT name AS employee_name FROM employees WHERE department = 'Engineering'$sql$, $expected$[{"employee_name":"Bob"}]$expected$::jsonb, $hints$[{"level":1,"text":"Keep only the rows that match one department."},{"level":2,"text":"Compare employees.department with Engineering."},{"level":3,"text":"Use WHERE with an equality check on the department column."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'WHERE conditions'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the names of employees who work in Engineering.$prompt$
  );

-- WHERE conditions / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the name and salary of employees who earn more than 80000.$prompt$, $sql$SELECT name AS employee_name, salary AS employee_salary FROM employees WHERE salary > 80000$sql$, $expected$[{"employee_name":"Bob","employee_salary":90000}]$expected$::jsonb, $hints$[{"level":1,"text":"Filter on a numeric comparison rather than a department name."},{"level":2,"text":"Use employees.salary and keep values above 80000."},{"level":3,"text":"Select the name and salary, then add a WHERE comparison on salary."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'WHERE conditions'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the name and salary of employees who earn more than 80000.$prompt$
  );

-- WHERE conditions / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the name and department of employees who work in HR or Engineering.$prompt$, $sql$SELECT name AS employee_name, department FROM employees WHERE department = 'HR' OR department = 'Engineering'$sql$, $expected$[{"employee_name":"Bob","department":"Engineering"},{"employee_name":"Diana","department":"HR"}]$expected$::jsonb, $hints$[{"level":1,"text":"A row should qualify when it matches either of two departments."},{"level":2,"text":"Test employees.department against HR and against Engineering."},{"level":3,"text":"Combine two equality checks with OR in the WHERE clause."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'WHERE conditions'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the name and department of employees who work in HR or Engineering.$prompt$
  );

-- WHERE conditions / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the name, department, and salary of employees who do not work in Sales and earn at least 70000.$prompt$, $sql$SELECT name AS employee_name, department, salary AS employee_salary FROM employees WHERE department <> 'Sales' AND salary >= 70000$sql$, $expected$[{"employee_name":"Bob","department":"Engineering","employee_salary":90000},{"employee_name":"Diana","department":"HR","employee_salary":70000}]$expected$::jsonb, $hints$[{"level":1,"text":"Both conditions must be true: the department is excluded and the pay meets a minimum."},{"level":2,"text":"Use employees.department and employees.salary together."},{"level":3,"text":"Combine a not-equal department check with a salary comparison using AND."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'WHERE conditions'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the name, department, and salary of employees who do not work in Sales and earn at least 70000.$prompt$
  );

-- ORDER BY / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List employee names in alphabetical order.$prompt$, $sql$SELECT name AS employee_name FROM employees ORDER BY name$sql$, $expected$[{"employee_name":"Alice"},{"employee_name":"Bob"},{"employee_name":"Charlie"},{"employee_name":"Diana"},{"employee_name":"Eve"}]$expected$::jsonb, $hints$[{"level":1,"text":"The row order is part of the answer. Sort text from A to Z."},{"level":2,"text":"Sort by employees.name."},{"level":3,"text":"Select the name, then add ORDER BY on that column."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'ORDER BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List employee names in alphabetical order.$prompt$
  );

-- ORDER BY / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee name and department, sorted by department name and then by employee name.$prompt$, $sql$SELECT name AS employee_name, department FROM employees ORDER BY department, name$sql$, $expected$[{"employee_name":"Bob","department":"Engineering"},{"employee_name":"Diana","department":"HR"},{"employee_name":"Alice","department":"Sales"},{"employee_name":"Charlie","department":"Sales"},{"employee_name":"Eve","department":"Sales"}]$expected$::jsonb, $hints$[{"level":1,"text":"Sort by two columns. The department decides the groups, and the name breaks ties inside a group."},{"level":2,"text":"Use employees.department as the first sort key and employees.name as the second."},{"level":3,"text":"Select both columns and list them in that order inside ORDER BY."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'ORDER BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee name and department, sorted by department name and then by employee name.$prompt$
  );

-- ORDER BY / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee name and salary from the lowest salary to the highest.$prompt$, $sql$SELECT name AS employee_name, salary AS employee_salary FROM employees ORDER BY salary ASC$sql$, $expected$[{"employee_name":"Alice","employee_salary":60000},{"employee_name":"Eve","employee_salary":62000},{"employee_name":"Charlie","employee_salary":65000},{"employee_name":"Diana","employee_salary":70000},{"employee_name":"Bob","employee_salary":90000}]$expected$::jsonb, $hints$[{"level":1,"text":"Ascending order puts the smallest number first."},{"level":2,"text":"Sort by employees.salary."},{"level":3,"text":"Select the name and salary, then ORDER BY salary in ascending order."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'ORDER BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee name and salary from the lowest salary to the highest.$prompt$
  );

-- ORDER BY / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee name, department, and salary. Sort departments from A to Z, and within each department put the higher salary first.$prompt$, $sql$SELECT name AS employee_name, department, salary AS employee_salary FROM employees ORDER BY department ASC, salary DESC$sql$, $expected$[{"employee_name":"Bob","department":"Engineering","employee_salary":90000},{"employee_name":"Diana","department":"HR","employee_salary":70000},{"employee_name":"Charlie","department":"Sales","employee_salary":65000},{"employee_name":"Eve","department":"Sales","employee_salary":62000},{"employee_name":"Alice","department":"Sales","employee_salary":60000}]$expected$::jsonb, $hints$[{"level":1,"text":"Use two sort keys with opposite directions."},{"level":2,"text":"Sort employees.department alphabetically, then employees.salary from high to low."},{"level":3,"text":"In ORDER BY, make department ascending and salary descending."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'ORDER BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee name, department, and salary. Sort departments from A to Z, and within each department put the higher salary first.$prompt$
  );

-- LIMIT & OFFSET / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Return the name and salary of the two highest-paid employees, with the highest salary first.$prompt$, $sql$SELECT name AS employee_name, salary AS employee_salary FROM employees ORDER BY salary DESC LIMIT 2$sql$, $expected$[{"employee_name":"Bob","employee_salary":90000},{"employee_name":"Diana","employee_salary":70000}]$expected$::jsonb, $hints$[{"level":1,"text":"Sort so the largest salary is first, then keep only the first two rows."},{"level":2,"text":"Order employees.salary from high to low."},{"level":3,"text":"After ORDER BY, use LIMIT to keep two rows."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'LIMIT & OFFSET'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Return the name and salary of the two highest-paid employees, with the highest salary first.$prompt$
  );

-- LIMIT & OFFSET / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Return the first three employee names in alphabetical order.$prompt$, $sql$SELECT name AS employee_name FROM employees ORDER BY name LIMIT 3$sql$, $expected$[{"employee_name":"Alice"},{"employee_name":"Bob"},{"employee_name":"Charlie"}]$expected$::jsonb, $hints$[{"level":1,"text":"Alphabetical order comes first. Then keep only the start of that list."},{"level":2,"text":"Sort employees.name from A to Z."},{"level":3,"text":"Use ORDER BY and LIMIT so only three names remain."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'LIMIT & OFFSET'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Return the first three employee names in alphabetical order.$prompt$
  );

-- LIMIT & OFFSET / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Return the name and salary of the employee with the second-highest salary.$prompt$, $sql$SELECT name AS employee_name, salary AS employee_salary FROM employees ORDER BY salary DESC OFFSET 1 LIMIT 1$sql$, $expected$[{"employee_name":"Diana","employee_salary":70000}]$expected$::jsonb, $hints$[{"level":1,"text":"Sort by salary, skip the top row, and keep the next one."},{"level":2,"text":"Order employees.salary from highest to lowest."},{"level":3,"text":"Use OFFSET to skip one row and LIMIT to keep a single row."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'LIMIT & OFFSET'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Return the name and salary of the employee with the second-highest salary.$prompt$
  );

-- LIMIT & OFFSET / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$After sorting employee names alphabetically, skip the first two names and return the remaining names.$prompt$, $sql$SELECT name AS employee_name FROM employees ORDER BY name OFFSET 2$sql$, $expected$[{"employee_name":"Charlie"},{"employee_name":"Diana"},{"employee_name":"Eve"}]$expected$::jsonb, $hints$[{"level":1,"text":"The sort defines which names are first. Then drop that prefix."},{"level":2,"text":"Sort employees.name alphabetically before skipping rows."},{"level":3,"text":"Use ORDER BY with OFFSET. Do not add a row limit."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'LIMIT & OFFSET'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$After sorting employee names alphabetically, skip the first two names and return the remaining names.$prompt$
  );

-- Basic JOINs / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each project name with the name of the department that owns it.$prompt$, $sql$SELECT p.name AS project_name, d.name AS department_name FROM projects p JOIN departments d ON p.department_id = d.id$sql$, $expected$[{"project_name":"Cedar","department_name":"Sales"},{"project_name":"Beacon","department_name":"Sales"},{"project_name":"Atlas","department_name":"Engineering"}]$expected$::jsonb, $hints$[{"level":1,"text":"Match each project to the department row that shares its department id."},{"level":2,"text":"Join projects.department_id to departments.id. Both tables have a name column, so alias them."},{"level":3,"text":"Use an inner JOIN and give the two name columns different output aliases."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Basic JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each project name with the name of the department that owns it.$prompt$
  );

-- Basic JOINs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee name with the name of every project that belongs to that employee department.$prompt$, $sql$SELECT e.name AS employee_name, p.name AS project_name FROM employees e JOIN projects p ON e.department_id = p.department_id$sql$, $expected$[{"employee_name":"Bob","project_name":"Atlas"},{"employee_name":"Eve","project_name":"Beacon"},{"employee_name":"Charlie","project_name":"Beacon"},{"employee_name":"Alice","project_name":"Beacon"},{"employee_name":"Eve","project_name":"Cedar"},{"employee_name":"Charlie","project_name":"Cedar"},{"employee_name":"Alice","project_name":"Cedar"}]$expected$::jsonb, $hints$[{"level":1,"text":"An employee can appear once for each project in the same department. Departments with no project drop out."},{"level":2,"text":"Join employees.department_id to projects.department_id."},{"level":3,"text":"Select the two name columns with different aliases from an inner JOIN."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Basic JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee name with the name of every project that belongs to that employee department.$prompt$
  );

-- Basic JOINs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the name, salary, and department name of employees in Engineering.$prompt$, $sql$SELECT e.name AS employee_name, e.salary AS employee_salary, d.name AS department_name FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.name = 'Engineering'$sql$, $expected$[{"employee_name":"Bob","employee_salary":90000,"department_name":"Engineering"}]$expected$::jsonb, $hints$[{"level":1,"text":"Join the employee to a department, then keep one department."},{"level":2,"text":"Join employees.department_id to departments.id and filter departments.name."},{"level":3,"text":"Use JOIN for the relationship and WHERE for the Engineering name."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Basic JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the name, salary, and department name of employees in Engineering.$prompt$
  );

-- Basic JOINs / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$For every employee who shares a department with a project, list the employee name, department name, and project name.$prompt$, $sql$SELECT e.name AS employee_name, d.name AS department_name, p.name AS project_name FROM employees e JOIN departments d ON e.department_id = d.id JOIN projects p ON p.department_id = d.id$sql$, $expected$[{"employee_name":"Bob","department_name":"Engineering","project_name":"Atlas"},{"employee_name":"Alice","department_name":"Sales","project_name":"Beacon"},{"employee_name":"Charlie","department_name":"Sales","project_name":"Beacon"},{"employee_name":"Eve","department_name":"Sales","project_name":"Beacon"},{"employee_name":"Alice","department_name":"Sales","project_name":"Cedar"},{"employee_name":"Charlie","department_name":"Sales","project_name":"Cedar"},{"employee_name":"Eve","department_name":"Sales","project_name":"Cedar"}]$expected$::jsonb, $hints$[{"level":1,"text":"Connect three tables. One employee can match more than one project in the same department."},{"level":2,"text":"Link employees to departments by department id, then link departments to projects by department id."},{"level":3,"text":"Use two JOIN clauses and give every name column its own alias."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Basic JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$For every employee who shares a department with a project, list the employee name, department name, and project name.$prompt$
  );

-- GROUP BY / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$What is the total salary paid in each department? Return the department and the total.$prompt$, $sql$SELECT department, SUM(salary) AS total_salary FROM employees GROUP BY department$sql$, $expected$[{"department":"Engineering","total_salary":"90000"},{"department":"Sales","total_salary":"187000"},{"department":"HR","total_salary":"70000"}]$expected$::jsonb, $hints$[{"level":1,"text":"Collapse employees into one row per department and add their salaries."},{"level":2,"text":"Group employees.department and sum employees.salary."},{"level":3,"text":"Use SUM on salary and GROUP BY department. Label the sum."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'GROUP BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$What is the total salary paid in each department? Return the department and the total.$prompt$
  );

-- GROUP BY / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$What is the average salary in each department? Return the department and the average.$prompt$, $sql$SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department$sql$, $expected$[{"department":"Engineering","avg_salary":"90000.000000000000"},{"department":"Sales","avg_salary":"62333.333333333333"},{"department":"HR","avg_salary":"70000.000000000000"}]$expected$::jsonb, $hints$[{"level":1,"text":"Produce one row per department with the mean salary of its employees."},{"level":2,"text":"Group employees.department and average employees.salary."},{"level":3,"text":"Use AVG on salary with GROUP BY department, and alias the average."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'GROUP BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$What is the average salary in each department? Return the department and the average.$prompt$
  );

-- GROUP BY / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$What is the highest salary in each department? Return the department and that salary.$prompt$, $sql$SELECT department, MAX(salary) AS highest_salary FROM employees GROUP BY department$sql$, $expected$[{"department":"Engineering","highest_salary":90000},{"department":"Sales","highest_salary":65000},{"department":"HR","highest_salary":70000}]$expected$::jsonb, $hints$[{"level":1,"text":"Each department needs the largest salary among its employees."},{"level":2,"text":"Group employees.department and take the maximum employees.salary."},{"level":3,"text":"Use MAX on salary with GROUP BY department."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'GROUP BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$What is the highest salary in each department? Return the department and that salary.$prompt$
  );

-- GROUP BY / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$For each department, show how many employees it has and the total salary paid.$prompt$, $sql$SELECT department, COUNT(*) AS employee_count, SUM(salary) AS total_salary FROM employees GROUP BY department$sql$, $expected$[{"department":"Engineering","employee_count":"1","total_salary":"90000"},{"department":"Sales","employee_count":"3","total_salary":"187000"},{"department":"HR","employee_count":"1","total_salary":"70000"}]$expected$::jsonb, $hints$[{"level":1,"text":"One result row per department needs two aggregates: a count and a sum."},{"level":2,"text":"Group employees.department. Count the rows and sum employees.salary."},{"level":3,"text":"Select the department plus both aggregate expressions, with separate aliases."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'GROUP BY'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$For each department, show how many employees it has and the total salary paid.$prompt$
  );

-- HAVING / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Which departments have more than one employee? Return the department name.$prompt$, $sql$SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 1$sql$, $expected$[{"department":"Sales"}]$expected$::jsonb, $hints$[{"level":1,"text":"Group the rows first, then keep groups that are large enough."},{"level":2,"text":"Group employees.department and count the employees in each group."},{"level":3,"text":"Use HAVING on the group count rather than WHERE."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'HAVING'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Which departments have more than one employee? Return the department name.$prompt$
  );

-- HAVING / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Which departments have a total salary greater than 100000? Return the department and the total.$prompt$, $sql$SELECT department, SUM(salary) AS total_salary FROM employees GROUP BY department HAVING SUM(salary) > 100000$sql$, $expected$[{"department":"Sales","total_salary":"187000"}]$expected$::jsonb, $hints$[{"level":1,"text":"The cutoff applies to the group total, not to one employee."},{"level":2,"text":"Group employees.department and sum employees.salary."},{"level":3,"text":"Use HAVING to keep groups whose salary sum is above 100000."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'HAVING'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Which departments have a total salary greater than 100000? Return the department and the total.$prompt$
  );

-- HAVING / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Which departments employ more than two people? Return the department and the employee count.$prompt$, $sql$SELECT department, COUNT(*) AS employee_count FROM employees GROUP BY department HAVING COUNT(*) > 2$sql$, $expected$[{"department":"Sales","employee_count":"3"}]$expected$::jsonb, $hints$[{"level":1,"text":"Count people per department, then discard the smaller groups."},{"level":2,"text":"Group employees.department and count the rows."},{"level":3,"text":"Show the count, and use HAVING to keep groups with a count above 2."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'HAVING'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Which departments employ more than two people? Return the department and the employee count.$prompt$
  );

-- HAVING / hard
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Which departments have a total salary above 80000? Return the department, the employee count, and the total salary.$prompt$, $sql$SELECT department, COUNT(*) AS employee_count, SUM(salary) AS total_salary FROM employees GROUP BY department HAVING SUM(salary) > 80000$sql$, $expected$[{"department":"Engineering","employee_count":"1","total_salary":"90000"},{"department":"Sales","employee_count":"3","total_salary":"187000"}]$expected$::jsonb, $hints$[{"level":1,"text":"Report two aggregates, but filter the groups using only the salary total."},{"level":2,"text":"Group employees.department, count the rows, and sum employees.salary."},{"level":3,"text":"Put both aggregates in the select list and use HAVING on the sum."}]$hints$::jsonb, $schema${"fixture":"employees","tables":[{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department","type":"VARCHAR","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'HAVING'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Which departments have a total salary above 80000? Return the department, the employee count, and the total salary.$prompt$
  );

-- Complex JOINs / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List every employee and the project in the same department. Include employees whose department has no project.$prompt$, $sql$SELECT e.name AS employee_name, p.name AS project_name FROM employees e LEFT JOIN projects p ON e.department_id = p.department_id$sql$, $expected$[{"employee_name":"Bob","project_name":"Atlas"},{"employee_name":"Eve","project_name":"Beacon"},{"employee_name":"Charlie","project_name":"Beacon"},{"employee_name":"Alice","project_name":"Beacon"},{"employee_name":"Eve","project_name":"Cedar"},{"employee_name":"Charlie","project_name":"Cedar"},{"employee_name":"Alice","project_name":"Cedar"},{"employee_name":"Diana","project_name":null}]$expected$::jsonb, $hints$[{"level":1,"text":"Keep employees even when the project side has no match."},{"level":2,"text":"Match employees.department_id to projects.department_id."},{"level":3,"text":"Use a LEFT JOIN so an employee with no project still appears."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Complex JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List every employee and the project in the same department. Include employees whose department has no project.$prompt$
  );

-- Complex JOINs / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Which departments have no projects? Return the department name.$prompt$, $sql$SELECT d.name AS department_name FROM departments d LEFT JOIN projects p ON p.department_id = d.id WHERE p.id IS NULL$sql$, $expected$[{"department_name":"HR"}]$expected$::jsonb, $hints$[{"level":1,"text":"Start from departments and keep the ones that do not match a project."},{"level":2,"text":"Left-join projects on departments.id and look for a missing project id."},{"level":3,"text":"Use LEFT JOIN, then WHERE the project id is null."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Complex JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Which departments have no projects? Return the department name.$prompt$
  );

-- Complex JOINs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the employee name, department name, and project name for departments that have exactly one project.$prompt$, $sql$SELECT e.name AS employee_name, d.name AS department_name, p.name AS project_name FROM employees e JOIN departments d ON e.department_id = d.id JOIN projects p ON p.department_id = d.id WHERE d.id IN (SELECT department_id FROM projects GROUP BY department_id HAVING COUNT(*) = 1)$sql$, $expected$[{"employee_name":"Bob","department_name":"Engineering","project_name":"Atlas"}]$expected$::jsonb, $hints$[{"level":1,"text":"Join the three tables, then keep only departments whose project count is one."},{"level":2,"text":"Connect employees, departments, and projects through department id. Count rows in projects per department."},{"level":3,"text":"Filter with a grouped subquery that uses HAVING on the project count."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Complex JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the employee name, department name, and project name for departments that have exactly one project.$prompt$
  );

-- Complex JOINs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List each employee once with their department name, but only when that department has at least one project.$prompt$, $sql$SELECT DISTINCT e.name AS employee_name, d.name AS department_name FROM employees e JOIN departments d ON e.department_id = d.id JOIN projects p ON p.department_id = e.department_id$sql$, $expected$[{"employee_name":"Eve","department_name":"Sales"},{"employee_name":"Charlie","department_name":"Sales"},{"employee_name":"Bob","department_name":"Engineering"},{"employee_name":"Alice","department_name":"Sales"}]$expected$::jsonb, $hints$[{"level":1,"text":"The project join can duplicate an employee. The result should still show each person once."},{"level":2,"text":"Join employees to departments and to projects on department id."},{"level":3,"text":"Use the joins to require a project, then DISTINCT so repeated names collapse."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Complex JOINs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List each employee once with their department name, but only when that department has at least one project.$prompt$
  );

-- Subqueries / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the names of employees who earn more than the average salary of the whole company.$prompt$, $sql$SELECT name AS employee_name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)$sql$, $expected$[{"employee_name":"Bob"},{"employee_name":"Diana"}]$expected$::jsonb, $hints$[{"level":1,"text":"Compare each salary with one number calculated from every employee."},{"level":2,"text":"Average employees.salary in a subquery, then compare employees.salary with that result."},{"level":3,"text":"Put AVG in a parenthesized SELECT in the WHERE clause."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Subqueries'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the names of employees who earn more than the average salary of the whole company.$prompt$
  );

-- Subqueries / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the names of employees who belong to the department named Sales.$prompt$, $sql$SELECT name AS employee_name FROM employees WHERE department_id = (SELECT id FROM departments WHERE name = 'Sales')$sql$, $expected$[{"employee_name":"Alice"},{"employee_name":"Charlie"},{"employee_name":"Eve"}]$expected$::jsonb, $hints$[{"level":1,"text":"The department name lives in another table. Look up its id first."},{"level":2,"text":"Find departments.id where departments.name is Sales, then match employees.department_id."},{"level":3,"text":"Use a scalar subquery in WHERE to supply that department id."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Subqueries'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the names of employees who belong to the department named Sales.$prompt$
  );

-- Subqueries / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List the names of employees whose department has at least one project.$prompt$, $sql$SELECT name AS employee_name FROM employees WHERE department_id IN (SELECT department_id FROM projects)$sql$, $expected$[{"employee_name":"Alice"},{"employee_name":"Bob"},{"employee_name":"Charlie"},{"employee_name":"Eve"}]$expected$::jsonb, $hints$[{"level":1,"text":"Keep an employee when their department id appears in the project list."},{"level":2,"text":"The inner query should return projects.department_id."},{"level":3,"text":"Use IN with a subquery in the WHERE clause."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Subqueries'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List the names of employees whose department has at least one project.$prompt$
  );

-- Subqueries / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$List department names whose average salary is higher than the average salary of all employees.$prompt$, $sql$SELECT d.name AS department_name FROM departments d WHERE (SELECT AVG(e.salary) FROM employees e WHERE e.department_id = d.id) > (SELECT AVG(salary) FROM employees)$sql$, $expected$[{"department_name":"Engineering"},{"department_name":"HR"}]$expected$::jsonb, $hints$[{"level":1,"text":"Each department needs its own average, compared with one company-wide average."},{"level":2,"text":"Average employees.salary for the current departments.id, and average employees.salary for everyone."},{"level":3,"text":"Use two scalar subqueries in WHERE, one of them filtered by the outer department."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'Subqueries'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$List department names whose average salary is higher than the average salary of all employees.$prompt$
  );

-- CTEs / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Using a CTE, list every department name.$prompt$, $sql$WITH dept_names AS (SELECT name AS department_name FROM departments) SELECT department_name FROM dept_names$sql$, $expected$[{"department_name":"Sales"},{"department_name":"Engineering"},{"department_name":"HR"}]$expected$::jsonb, $hints$[{"level":1,"text":"Name a temporary result, then select from that name."},{"level":2,"text":"The CTE should read departments.name."},{"level":3,"text":"Use WITH to define the CTE, then SELECT its output column."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'CTEs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Using a CTE, list every department name.$prompt$
  );

-- CTEs / easy
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Using a CTE of employee names and salaries, list the names of employees who earn more than 70000.$prompt$, $sql$WITH staff AS (SELECT name AS employee_name, salary FROM employees) SELECT employee_name FROM staff WHERE salary > 70000$sql$, $expected$[{"employee_name":"Bob"}]$expected$::jsonb, $hints$[{"level":1,"text":"Build a named result of names and salaries, then filter that result."},{"level":2,"text":"The CTE reads employees.name and employees.salary."},{"level":3,"text":"Define the CTE with WITH, then use WHERE on its salary column."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'CTEs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Using a CTE of employee names and salaries, list the names of employees who earn more than 70000.$prompt$
  );

-- CTEs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Using a CTE, count the employees in each department and return only departments with more than one employee, including the count.$prompt$, $sql$WITH department_counts AS (SELECT d.name AS department_name, COUNT(e.id) AS employee_count FROM departments d JOIN employees e ON e.department_id = d.id GROUP BY d.id, d.name) SELECT department_name, employee_count FROM department_counts WHERE employee_count > 1$sql$, $expected$[{"department_name":"Sales","employee_count":"3"}]$expected$::jsonb, $hints$[{"level":1,"text":"Put the grouped counts in a CTE, then filter the CTE in the outer query."},{"level":2,"text":"Join departments to employees and count employee ids per department name."},{"level":3,"text":"GROUP BY inside the CTE, then WHERE the count column in the outer SELECT."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'CTEs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Using a CTE, count the employees in each department and return only departments with more than one employee, including the count.$prompt$
  );

-- CTEs / medium
INSERT INTO public.problems (topic_id, prompt, correct_sql, expected_result, hints, dataset_schema)
SELECT topics.id, $prompt$Using a CTE, count the projects in every department, including departments that have no projects. Return the department name and the project count.$prompt$, $sql$WITH project_counts AS (SELECT d.name AS department_name, COUNT(p.id) AS project_count FROM departments d LEFT JOIN projects p ON p.department_id = d.id GROUP BY d.id, d.name) SELECT department_name, project_count FROM project_counts$sql$, $expected$[{"department_name":"Sales","project_count":"2"},{"department_name":"HR","project_count":"0"},{"department_name":"Engineering","project_count":"1"}]$expected$::jsonb, $hints$[{"level":1,"text":"Departments with no project must remain, with a count of zero."},{"level":2,"text":"Left-join projects to departments and count project ids, which ignores a missing match."},{"level":3,"text":"Do the LEFT JOIN and GROUP BY inside the CTE, then select both output columns."}]$hints$::jsonb, $schema${"fixture":"company","tables":[{"name":"departments","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false}]},{"name":"employees","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false},{"name":"salary","type":"INT","primaryKey":false}]},{"name":"projects","columns":[{"name":"id","type":"INT","primaryKey":true},{"name":"name","type":"VARCHAR","primaryKey":false},{"name":"department_id","type":"INT","primaryKey":false}]}]}$schema$
FROM public.topics
WHERE topics.title = 'CTEs'
  AND NOT EXISTS (
    SELECT 1
    FROM public.problems
    WHERE problems.topic_id = topics.id
      AND problems.prompt = $prompt$Using a CTE, count the projects in every department, including departments that have no projects. Return the department name and the project count.$prompt$
  );
