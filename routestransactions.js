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
