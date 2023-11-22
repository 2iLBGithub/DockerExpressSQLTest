const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());

app.get('/message', (req, res) => {
    res.json({message: 'Hello there from SQL!'});
  });

app.get('/employees', async (req, res) => {
        const [rows] = await db.query('SELECT * FROM employees');
        res.json(rows);
});

app.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
        const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
        res.json(rows);
});

// app.post('/employees', async (req, res) => {
//     const { name, position, salary, dept_id } = req.body;
//     const [result] = await db.query('INSERT INTO employees (name, position, salary, dept_id) VALUES (?, ?, ?, ?)', [name, position, salary, dept_id]);
//     res.json({ id: result.insertId });
// });

app.post('/employees', (req, res) => {
    const newEmployee = req.body;
    db.query('INSERT INTO employees SET ?', [newEmployee], (err, result) => {
      if (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        newEmployee.id = result.insertId;
        res.status(201).json(newEmployee);
      }
    });
  });
   

app.put('/employees/:id', async (req, res) => {
    const { name, position, salary, dept_id } = req.body;
    const id = req.params.id;
    const [result] = await db.query('UPDATE employees SET name = ?, position = ?, salary = ?, dept_id = ? WHERE id = ?', [name, position, salary, dept_id, id]);
    res.json({ message: 'Employee updated', affectedRows: result.affectedRows });
});

app.patch('/employees/:id', async (req, res) => {
    const id = req.params.id;
    let updateQuery = 'UPDATE employees SET ';
    const queryParams = [];

    Object.entries(req.body).forEach(([key, value], index, array) => {
        updateQuery += `${key} = ?`;
        queryParams.push(value);
        if (index < array.length - 1) updateQuery += ', ';
    });

    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);

    const [result] = await db.query(updateQuery, queryParams);
    res.json({ message: 'Employee updated', affectedRows: result.affectedRows });
});

app.delete('/employees/delete/:id', async (req, res) => {
    const id = req.params.id;
        const [rows] = await db.query('DELETE FROM employees WHERE id = ?', [id]);
        res.json(rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));