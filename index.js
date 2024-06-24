const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
require("dotenv").config();

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
  console.log("Connected to the database");
});

app.post("/signup", (req, res) => {
  const usuario = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_password: req.body.user_password,
  };

  const query = "INSERT INTO users SET ?";

  cnx.query(query, usuario, (err) => {
    if (err) return res.status(500).send("Error al crear el usuario");

    res.send(usuario);
  });
});

app.post("/login", (req, res) => {
  const query = `SELECT * FROM users WHERE user_email = '${req.body.user_email}' AND user_password = '${req.body.user_password}'`;
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    let usuario = {};
    if (result.length > 0) {
      usuario = {
        user_id: result[0].user_id,
        user_name: result[0].user_name,
        user_email: result[0].user_email,
        user_password: result[0].user_password,
      };

      res.send(usuario);
    } else {
      res.status(401).send("Usuario o contraseña incorrectos");
    }
  });
});

/*app.get('/users/:user_id', (req, res) => {
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
});*/

//CATEGORIAS
app.post("/categories/add", (req, res) => {
  const category = {
    category_name: req.body.category_name,
    user_id: req.body.user_id,
    type_id: req.body.type_id,
  };

  const query = "INSERT INTO categories SET ?";
  cnx.query(query, category, (err) => {
    if (err) return console.error(err.message);

    res.send(category);
  });
});

app.get("/categories/:user_id", (req, res) => {
  const query = `SELECT category_id, category_name, user_id, categories.type_id, types.type_name FROM categories INNER JOIN \`types\` ON categories.type_id = types.type_id WHERE user_id IS NULL OR user_id = ${req.params.user_id} ORDER BY user_id ASC`;
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    const categories = {};

    if (result.length > 0) {
      categories.categoriesList = result;
    } else {
      categories.message = "No se encontraron categorias";
    }

    res.send(categories);
  });
});

app.get("/categories-search/:user_id", (req, res) => {
  const query = `SELECT category_id, category_name, user_id, categories.type_id, types.type_name FROM categories INNER JOIN \`types\` ON categories.type_id = types.type_id WHERE category_name LIKE ? AND (user_id IS NULL OR user_id = '${req.params.user_id}') ORDER BY user_id ASC`;
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
      categories.message = "No se encontraron categorias";
    }

    res.send(categories);
  });
});

//TIPOS
app.get("/types", (req, res) => {
  const query = "SELECT * FROM types";
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    const types = {};

    if (result.length > 0) {
      types.typesList = result;
    } else {
      types.message = "No se encontraron tipos de categorias";
    }

    res.send(types);
  });
});

//TRANSACCIONES
app.post("/transactions/add", (req, res) => {
  const transaction = {
    transaction_amount: req.body.transaction_amount,
    transaction_description: req.body.transaction_description,
    transaction_date: req.body.transaction_date,
    user_id: req.body.user_id,
    category_id: req.body.category_id,
    type_id: req.body.type_id,
  };

  const query = "INSERT INTO transactions SET ?";
  cnx.query(query, transaction, (err) => {
    if (err) return console.error(err.message);

    res.send(transaction);
  });
});

app.get("/transactions/:user_id", (req, res) => {
  const query = `SELECT * FROM transactions WHERE user_id = ${req.params.user_id}`;
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    const transactions = {};

    if (result.length > 0) {
      transactions.transactionsList = result;
    } else {
      transactions.message = "No se encontraron transacciones";
    }

    res.send(transactions);
  });
});

app.get("/transactions-search/:user_id", (req, res) => {
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
      transactions.message = "No se encontraron transacciones";
    }

    res.send(transactions);
  });
});

/*app.get('/category_transactions/:user_id', (req, res) => {
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
});*/

//METAS
app.post("/goals/add", (req, res) => {
  const goal = {
    goal_name: req.body.goal_name,
    goal_target_amount: req.body.goal_target_amount,
    goal_actual_amount: req.body.goal_actual_amount,
    goal_deadline: req.body.goal_deadline,
    user_id: req.body.user_id,
  };

  const query = "INSERT INTO goals SET ?";
  cnx.query(query, goal, (err) => {
    if (err) return console.error(err.message);

    res.send(goal);
  });
});

app.get("/goals/:user_id", (req, res) => {
  const query = `SELECT * FROM goals WHERE user_id = ${req.params.user_id}`;
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    const goals = {};

    if (result.length > 0) {
      goals.goalsList = result;
    } else {
      goals.message = "No se encontraron metas";
    }

    res.send(goals);
  });
});

app.get("/goals-search/:user_id", (req, res) => {
  const query = `SELECT * FROM goals WHERE goal_name LIKE ? AND user_id = '${req.params.user_id}'`;
  const body = [`%${req.query.goal_name}%`];

  cnx.query(query, body, (err, result) => {
    if (err) {
      console.log("Error completo: ", err);
      return res.status(500).send(err.message);
    }

    const goals = {};

    if (result.length > 0) {
      goals.goalsList = result;
    } else {
      goals.message = "No se encontraron metas";
    }

    res.send(goals);
  });
});

app.post("/budgets/add", (req, res) => {
  const budget = {
    budget_name: req.body.budget_name,
    budget_amount: req.body.budget_amount,
    budget_month: req.body.budget_month,
    budget_year: req.body.budget_year,
    budget_is_total: req.body.budget_is_total,
    category_id: req.body.category_id || null,
    user_id: req.body.user_id,
  };

  const query = "INSERT INTO budgets SET ?";
  cnx.query(query, budget, (err) => {
    if (err) return console.error(err.message);
    console.log(budget);
    res.send(budget);
    console.log(res);
  });
});

app.get("/budgets/:user_id", (req, res) => {
  const query = `
    SELECT 
      budget_id, 
      budget_name, 
      budget_amount, 
      budget_month, 
      budget_year, 
      budget_is_total, 
      budgets.category_id, 
      categories.category_name, 
      budgets.user_id 
    FROM budgets 
    LEFT JOIN \`categories\` 
    ON budgets.category_id = categories.category_id 
    WHERE budgets.user_id = ${req.params.user_id}`;
  cnx.query(query, (err, result) => {
    if (err) return console.log(err.message);

    const budgets = {};

    if (result.length > 0) {
      budgets.budgetsList = result;
    } else {
      budgets.message = "No se encontraron presupuestos";
    }
    console.log(budgets);
    res.send(budgets);
  });
});

app.get("/budgets-search/:user_id", (req, res) => {
  const query = `
    SELECT 
      budget_id, 
      budget_name, 
      budget_amount, 
      budget_month, 
      budget_year, 
      budget_is_total, 
      budgets.category_id, 
      categories.category_name, 
      budgets.user_id 
    FROM budgets 
    LEFT JOIN \`categories\` 
    ON budgets.category_id = categories.category_id 
    WHERE budget_name LIKE ? AND budgets.user_id = '${req.params.user_id}'`;
  const body = [`%${req.query.budget_name}%`];

  cnx.query(query, body, (err, result) => {
    if (err) {
      console.log("Error completo: ", err);
      return res.status(500).send(err.message);
    }

    const budgets = {};

    if (result.length > 0) {
      budgets.budgetsList = result;
      res.send(budgets);
    } else {
      res.send("No se encontraron presupuestos");
    }
  });
});

app.get("/reports/:user_id", (req, res) => {
  const query = `
        SELECT 
            t.transaction_id,
            t.transaction_amount,
            t.transaction_date,
            t.transaction_description,
            c.category_name,
            ty.type_name
        FROM 
            gesdi.transactions t
        JOIN 
            gesdi.categories c ON t.category_id = c.category_id
        JOIN 
            gesdi.types ty ON t.type_id = ty.type_id
        WHERE 
            t.user_id = ${req.params.user_id} AND YEAR(t.transaction_date) = ? AND MONTH(t.transaction_date) = ?;
    `;
  const body = [req.query.year, req.query.month];

  cnx.query(query, body, (err, result) => {
    if (err) return console.log(err.message);

    const transactions = {};

    if (result.length > 0) {
      transactions.transactionsList = result;
    } else {
      transactions.message = "No se encontraron transacciones";
    }

    res.send(transactions);
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
