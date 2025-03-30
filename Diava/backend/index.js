const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const DiavaModel = require("./models");

app.use(express.json());
app.use(cors());

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
    res.status(201).json(response); // 201 for created
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

app.get("/list", async (req, res) => {
  try {
    const response = await DiavaModel.getLists();
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

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
