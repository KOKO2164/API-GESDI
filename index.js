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

app.post('/signup', (req, res) => {
    const usuario = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password
    };

    const query = "INSERT INTO users SET ?";
    cnx.query(query, usuario, (err) => {
        if (err) return console.error(err.message);

        res.send(usuario);
    });
});

app.post('/login', (req, res) => {
    const query = `SELECT * FROM users WHERE user_email = '${req.body.user_email}' AND user_password = '${req.body.user_password}'`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        let usuario = {};
        if (result.length > 0) {
            usuario = {
                user_id: result[0].user_id,
                user_name: result[0].user_name,
                user_email: result[0].user_email,
                user_password: result[0].user_password
            };
        } else {
            usuario = {
                user_id: 0,
                user_name: "",
                user_email: "",
                user_password: ""
            };
        }

        res.send(usuario);
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
                user_id: 0,
                user_name: "",
                user_email: "",
                user_password: ""
            };
        }
        res.send(usuario);
    });
});

app.post('/categories/add', (req, res) => {
    const category = {
        category_name: req.body.category_name,
        category_type: req.body.category_type,
        user_id: req.body.user_id
    };

    const query = "INSERT INTO categories SET ?";
    cnx.query(query, category, (err) => {
        if (err) return console.error(err.message);

        res.send(category);
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

app.get('/categories', (req, res) => {
    console.log("category_name recibido:", req.query.category_name);
    const query = `SELECT * FROM categories WHERE category_name LIKE ?`;
    const body = [`%${req.query.category_name}%`];

    cnx.query(query, body, (err, result) => {
        if (err) {
            console.log("Error completo: ", err);
            return res.status(500).send(err.message);
        }

        const categories = {};

        if (result.length > 0) {
            categories.categoriesList = result;
        } else {
            categories.message = 'No se encontraron categorias';
        }

        res.send(categories);
    });
});

app.get('/category_types', (req, res) => {
    const query = 'SELECT DISTINCT category_type FROM categories';
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const category_types = {};

        if (result.length > 0) {
            category_types.category_typesList = result;
        } else {
            category_types.message = 'No se encontraron tipos de categorias';
        }

        res.send(category_types);
    });
});

app.get('/transactions/:user_id', (req, res) => {
    const query = `SELECT * FROM transactions WHERE user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const transactions = {};

        if (result.length > 0) {
            transactions.transactionsList = result;
        } else {
            transactions.message = 'No se encontraron transacciones';
        }
        
        res.send(transactions);
    });
});

app.post('/transactions/add', (req, res) => {
    const transaction = {
        transaction_amount: req.body.transaction_amount,
        transaction_type: req.body.transaction_type,
        transaction_description: req.body.transaction_description,
        transaction_date: req.body.transaction_date,
        user_id: req.body.user_id,
        category_id: req.body.category_id
    };

    const query = "INSERT INTO transactions SET ?";
    cnx.query(query, transaction, (err) => {
        if (err) return console.error(err.message);

        res.send(transaction);
    });
}); 

app.get('/transactions-search/:user_id', (req, res) => {
    const query = `SELECT * FROM transactions WHERE transaction_description LIKE ? AND user_id = '${req.params.user_id}'`;
    const body = [`%${req.query.transaction_description}%`];

    cnx.query(query, body, (err, result) => {
        if (err) {
            console.log("Error completo: ", err);
            return res.status(500).send(err.message);
        }

        const transactions = {};

        if (result.length > 0) {
            transactions.transactionsList = result;
        } else {
            transactions.message = 'No se encontraron transacciones';
        }

        res.send(transactions);
    });
});

app.get('/category_transactions/:user_id', (req, res) => {
    const query = `SELECT category_id, category_name FROM categories WHERE user_id IS NULL OR user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const category_transactions = {};

        if (result.length > 0) {
            category_transactions.category_transactionList = result;
        } else {
            category_transactions.message = 'No se encontraron transacciones';
        }
        
        res.send(category_transactions);
    });
});

app.get('/goals/:user_id', (req, res) => {
    const query = `SELECT * FROM goals WHERE user_id = ${req.params.user_id}`;
    cnx.query(query, (err, result) => {
        if (err) return console.log(err.message);

        const goals = {};

        if (result.length > 0) {
            goals.goalsList = result;
        } else {
            goals.message = 'No se encontraron metas';
        }
        
        res.send(goals);
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
});

app.put("/usuario/actualizar/:id", (req, res) =>{
    const {id} = req.params
    const {usu_nombres, usu_correo} = req.body

    const query = "UPDATE usuarios SET usu_nombres = '"+usu_nombres+"', usu_correo='"+usu_correo+"' WHERE usu_id="+id+";"
    //console.log(query)

    conexion.query(query,(error) =>{
        if(error)
            return console.error(error.message)
        res.json("Se actualizó correctamente el usuario")
    })    
})

app.delete("/usuario/eliminar/:id", (req, res) =>{
    const {id} = req.params

    const query = "DELETE FROM usuarios WHERE usu_id = "+id+";"
    conexion.query(query, (error) =>{
        if(error)
            return console.error(error.message)
        res.json("Se eliminó correctamente el usuario")
    })
})*/