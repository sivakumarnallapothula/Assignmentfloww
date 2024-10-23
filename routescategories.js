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
