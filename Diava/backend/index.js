const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require('pg');
const port = 5001;

const DiavaModel = require("./models");

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
    const response = await DiavaModel.getUsers();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await DiavaModel.getUniqueUser(user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({error : error.message});
  }
});

app.post("/allusers", async (req, res) => {
  try {
    const response = await DiavaModel.createUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/goals", async (req, res) => {
  try {
    const response = await DiavaModel.getGoals();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/goals", async (req, res) => {
  try {
    const response = await DiavaModel.createGoal(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DiavaModel.updateGoal(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/list/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;  
    const response = await DiavaModel.getLists(user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/list", async (req, res) => {
  try {
    const response = await DiavaModel.addList(req.body);
    res.status(201).json(response); // 201 for created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DiavaModel.updateList(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DiavaModel.deleteList(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/list_books", async(req, res) => {
  try{
    const response = await DiavaModel.addBook(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.get("/list_books",  async(req,res) => {
  try {
    const response = await DiavaModel.getBooks();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

app.get("/list_books/:user_id/:name", async(req,res) => {
  try{
    const { user_id,name } = req.params;
    const response = await DiavaModel.getUserBooks(user_id, name);
    res.status(200).json(response);
  } catch (error){
  res.status(500).json({error: error.message});
  }
});
app.get("/review", async (req, res) => {
  try {
    const { user_id, book_id } = req.query;
    const response = await DiavaModel.getReview(user_id, book_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/review", async (req, res) => {
  try {
    const response = await DiavaModel.addReview(req.body);
    res.status(201).json(response); // 201 for created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
