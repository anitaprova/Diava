const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "diava",
  password: "Capstone2025!",
  port: 5432,
});

// Get all goals
const getGoals = async () => {
  try {
    const results = await pool.query("SELECT * FROM goals");
    return results.rows;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw new Error("Internal server error");
  }
};

// Create a new goal
const createGoal = async (body) => {
  try {
    const { user_id, goal, is_completed } = body;
    const results = await pool.query(
      "INSERT INTO goals (user_id, goal, is_completed) VALUES ($1, $2, $3) RETURNING *",
      [user_id, goal, is_completed]
    );
    return results.rows[0]; // Return the created goal
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Internal server error");
  }
};

// Update an existing goal
const updateGoal = async (id, body) => {
  try {
    const { user_id, goal, is_completed } = body;
    const results = await pool.query(
      "UPDATE goals SET user_id = $1, goal = $2, is_completed = $3 WHERE id = $4 RETURNING *",
      [user_id, goal, is_completed, id]
    );

    if (results.rowCount === 0) {
      throw new Error("Goal not found");
    }

    return results.rows[0];
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Internal server error");
  }
};

// Get all lists
const getLists = async () => {
  try {
    const results = await pool.query("SELECT * FROM lists");
    return results.rows;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw new Error("Internal server error");
  }
};

// Add new list
const addList = async (body) => {
  try {
    const { user_id, name } = body;
    const results = await pool.query(
      "INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *",
      [user_id, name]
    );

    if (results.rowCount === 0) {
      throw new Error("List not found");
    }

    return results.rows[0];
  } catch (error) {
    console.error("Error updating list:", error);
    throw new Error("Database error:", error);
  }
};

// Update an existing List
const updateList = async (id, body) => {
  try {
    const { user_id, name } = body;
    const results = await pool.query(
      "UPDATE lists SET user_id = $1, name = $2 WHERE id = $3 RETURNING *",
      [user_id, name, id]
    );

    if (results.rowCount === 0) {
      throw new Error("List not found");
    }

    return results.rows[0];
  } catch (error) {
    console.error("Error updating List:", error);
    throw new Error("Internal server error");
  }
};

// Deleting an existing List
const deleteList = async (id) => {
  try {
    const results = await pool.query(
      "DELETE FROM lists WHERE id = $1 RETURNING *",
      [id]
    );

    if (results.rowCount === 0) {
      throw new Error("List not found");
    }

    return results.rows[0];
  } catch (error) {
    console.error("Error delete List:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  getLists,
  addList,
  updateList,
  deleteList,
};
