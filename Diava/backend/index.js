const express = require('express');
const cors = require('cors');
const app = express();
const { Pool } = require('pg');
const port = 5001;

const Diava_model = require('./models');

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Diava',
  password: 'Capstone2025!',
  port: 5432,
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.get("/allusers", async (req, res) => {
  try {
    const response = await Diava_model.getUsers(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Username is required" });
  }
  try {
    const query = "SELECT * FROM users WHERE name = $1";
    const result = await pool.query(query, [name]);
    if (result.rows.length > 0) {
      res.json(result.rows); 
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/allusers", async (req, res) => {
  try {
    const response = await Diava_model.createUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/goals", async (req, res) => {
  try {
    const response = await Diava_model.getGoals();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/goals", async (req, res) => {
  try {
    const response = await Diava_model.createGoal(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Diava_model.updateGoal(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});