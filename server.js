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
