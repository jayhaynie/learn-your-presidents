const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); //postgres


require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors({
  origin: '*'  //allowing all local origins
}));

//postgres connection
const pool = new Pool({
  user: process.env.DB_USER,         // Fetch from .env
  host: process.env.DB_HOST,         // Fetch from .env
  database: process.env.DB_DATABASE, // Fetch from .env
  password: process.env.DB_PASSWORD, // Fetch from .env
  port: process.env.DB_PORT          // Fetch from .env
});

app.get('/api/presidents-info', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM pres_info');
    res.json(result.rows); // returns [{ name: 'A' }, { name: 'B' }, ...]
  } catch (err) {
    console.error('Query Error: ', err);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});

app.get('/api/presidents-random', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pres_info ORDER BY RANDOM() LIMIT 1');
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No presidents found!' });
    }
  } catch (err) {
    console.error('Query Error: ', err);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});

// get
app.get('/api/presidents-info/:name', async (req, res) => {
  const { name } = req.params; 
  try {
    const result = await pool.query('SELECT * FROM pres_info WHERE name = $1', [name]);
    if (result.rowCount > 0) {
      res.json(result.rows); //send info as JSON
    } else {
      res.status(404).json({ error: 'president not found!' });
    }
  } catch (err) {
    console.error('Query Error: ', err);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});

app.get('/api/presidents-options/life/:exclude', async (req, res) => {
  const { exclude } = req.params;
  // exclude should be a string like "Born in 1946 - And still alive" or "Born in 1809 - Died in 1865"
  // You'll need to parse or ignore exclude for simplicity
  const result = await pool.query(
    `SELECT birth, death FROM pres_info WHERE CONCAT('Born in ', birth, ' - ', CASE WHEN death = 'N/A' THEN 'And still alive' ELSE CONCAT('Died in ', death) END) NOT LIKE $1 ORDER BY RANDOM() LIMIT 3`,
    [exclude]
  );
  res.json(result.rows);
});

// get 3 pieces of data from the same column, that are not the same as the answer
app.get('/api/presidents-options/:column/:exclude', async (req, res) => {
  const { column, exclude } = req.params;
  // Simple version, no validation
  try {
    const result = await pool.query(
      `SELECT * FROM (
        SELECT DISTINCT ${column} FROM pres_info WHERE ${column} NOT LIKE $1 AND ${column} IS NOT NULL
      ) AS sub
      ORDER BY RANDOM() LIMIT 3`,
      [exclude]
    );
    res.json(result.rows.map(row => row[column]));
  } catch (err) {
    console.error('Query Error: ', err);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});

//start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

