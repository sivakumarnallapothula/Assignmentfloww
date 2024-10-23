# Assignmentfloww
Install SQLite and required packages:

bash
Copy code
npm install express sqlite3 body-parser
Create a database setup file (db/database.js):

javascript
Copy code
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tracker.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
    )`);
});

module.exports = db;
Step 2: API Endpoints
Create Server and Set Up Express
Create the main server file (server.js):

javascript
Copy code
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/database');
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
Step 3: Route Handlers
Transaction Routes (routes/transactions.js)
Create the transaction routes file:

javascript
Copy code
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// POST /transactions
router.post('/', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [type, category, amount, date, description], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// GET /transactions
router.get('/', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// GET /transactions/:id
router.get('/:id', (req, res) => {
    const query = `SELECT * FROM transactions WHERE id = ?`;
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(row);
    });
});

// PUT /transactions/:id
router.put('/:id', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`;
    db.run(query, [type, category, amount, date, description, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ updatedID: req.params.id });
    });
});

// DELETE /transactions/:id
router.delete('/:id', (req, res) => {
    const query = `DELETE FROM transactions WHERE id = ?`;
    db.run(query, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});

// GET /summary
router.get('/summary', (req, res) => {
    const query = `
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
        FROM transactions`;
    db.get(query, [], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        row.balance = row.total_income - row.total_expenses;
        res.json(row);
    });
});

module.exports = router;
Category Routes (routes/categories.js)
Create the category routes file:

javascript
Copy code
const express = require('express');
const db = require('../db/database');
const router = express.Router();

// POST /categories
router.post('/', (req, res) => {
    const { name, type } = req.body;
    const query = `INSERT INTO categories (name, type) VALUES (?, ?)`;
    db.run(query, [name, type], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// GET /categories
router.get('/', (req, res) => {
    db.all(`SELECT * FROM categories`, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
Step 4: Error Handling
Add error handling middleware in your server.js:

javascript
Copy code
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
Step 5: Documentation
Create a README.md file to document your API:

markdown
Copy code
# Personal Expense Tracker API

## Endpoints

### Transactions

- `POST /transactions`
  - **Request Body**: `{ "type": "income" | "expense", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }`
  - **Response**: `{ "id": number }`

- `GET /transactions`
  - **Response**: `[{ "id": number, "type": "string", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }]`

- `GET /transactions/:id`
  - **Response**: `{ "id": number, "type": "string", "category": "string", "amount": number, "date": "YYYY-MM-DD", "description": "string" }`

- `PUT /transactions/:id`
  - **Request Body**: Same as POST
  - **Response**: `{ "updatedID": number }`

- `DELETE /transactions/:id`
  - **Response**: `{ "deletedID": number }`

- `GET /summary`
  - **Response**: `{ "total_income": number, "total_expenses": number, "balance": number }`

### Categories

- `POST /categories`
  - **Request Body**: `{ "name": "string", "type": "income" | "expense" }`
  - **Response**: `{ "id": number }`

- `GET /categories`
  - **Response**: `[{ "id": number, "name": "string", "type": "string" }]`
Step 6: Testing
Test the API using tools like Postman or curl.

Optional Features
User Authentication: You can use packages like jsonwebtoken to implement user authentication and protect routes.
Enhanced Validation: Use express-validator to validate request data.
