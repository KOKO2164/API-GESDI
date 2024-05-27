const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

const cnx = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cnx.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

/*app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    cnx.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});*/

app.post('/login', (req, res) => {
    const query = `SELECT * FROM users WHERE user_email = '${req.body.user_email}' AND user_password = '${req.body.user_password}'`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const usuario = {
            user_id: result[0].user_id,
            user_name: result[0].user_name,
            user_email: result[0].user_email,
            user_password: result[0].user_password
        };

        if (result.length > 0) {
            res.send(usuario);
        } else {
            res.send('No se encontró el usuario');
        }
    });
});

app.get('/users/:user_id', (req, res) => {
    const query = `SELECT * FROM users WHERE user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        let usuario;
        if (result.length > 0) {
            usuario = {
                user_id: result[0].user_id,
                user_name: result[0].user_name,
                user_email: result[0].user_email,
                user_password: result[0].user_password
            };
        } else {
            usuario = {
                user_id: null,
                user_name: "Usuario no encontrado",
                user_email: null,
                user_password: null
            };
        }
        res.send(usuario);
    });
});

app.get('/categories/:user_id', (req, res) => {
    const query = `SELECT * FROM categories WHERE user_id IS NULL OR user_id = ${req.params.user_id} ORDER BY user_id ASC`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const categories = {};

        if (result.length > 0) {
            categories.categoriesList = result;
            res.send(categories);
        } else {
            res.send('No se encontró categorias');
        }
    });
});

app.get('/categories/:category_id', (req, res) => {
    const query = `SELECT * FROM categories WHERE category_id = ${req.params.category_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        let category;
        if (result.length > 0) {
            category = {
                category_id: result[0].category_id,
                category_name: result[0].category_name,
                category_type: result[0].category_type,
                user_id: result[0].user_id
            };
        } else {
            category = {
                category_id: null,
                category_name: "Categoría no encontrada",
                category_type: null,
                user_id: null
            };
        }
        res.send(category);
    });
});

app.get('/transactions/:user_id', (req, res) => {
    const query = `SELECT * FROM transactions WHERE user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const transactions = {};

        if (result.length > 0) {
            transactions.transactionsList = result;
            res.send(transactions);
        } else {
            res.send('No se encontró transacciones');
        }
    });
});

app.get('/goals/:user_id', (req, res) => {
    const query = `SELECT * FROM goals WHERE user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const goals = {};

        if (result.length > 0) {
            goals.goalsList = result;
            res.send(goals);
        } else {
            res.send('No se encontró metas');
        }
    });
});

/*app.put('/users/:user_id', (req, res) => {
    const updateQuery = `UPDATE users SET user_name = '${req.body.user_name}', 
                        user_email = '${req.body.user_email}', 
                        user_password = '${req.body.user_password}' 
                        WHERE user_id = ${req.params.user_id}`;
    cnx.query(updateQuery, (err, result) => {
        if (err) throw err;

        const selectQuery = `SELECT * FROM users WHERE user_id = ${req.params.user_id}`;
        cnx.query(selectQuery, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});

app.patch('/users/:user_id', (req, res) => {
    let updateQuery = 'UPDATE users SET ';
    let updateFields = [];

    if (req.body.user_name) {
        updateFields.push(`user_name = '${req.body.user_name}'`);
    }

    if (req.body.user_email) {
        updateFields.push(`user_email = '${req.body.user_email}'`);
    }

    if (req.body.user_password) {
        updateFields.push(`user_password = '${req.body.user_password}'`);
    }

    updateQuery += updateFields.join(', ') + ` WHERE user_id = ${req.params.user_id}`;
    cnx.query(updateQuery, (err, result) => {
        if (err) throw err;

        const selectQuery = `SELECT * FROM users WHERE user_id = ${req.params.user_id}`;
        cnx.query(selectQuery, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});*/