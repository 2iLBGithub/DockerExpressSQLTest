UPDATE employees
SET dept_id = 2
WHERE position = 'plumber';

UPDATE employees
SET dept_id = 1
WHERE position <> 'plumber';
