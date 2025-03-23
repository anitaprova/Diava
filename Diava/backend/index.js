const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000; 

const Diava_model = require('./models');

app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));


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
    res.status(201).json(response); // 201 for created
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