const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Diava',
  password: 'Capstone2025!',
  port: 5432,
});


const createUser = async (body) => {
  try {
    const {name} = body;
    const results = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING * ",
      [ name]
    );
    return results.rows[0]; // Return the created goal
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal server error");
  }
};
const getUniqueUser = async (username) => {
  try {
    const query = "SELECT FROM users WHERE name = $1";
    const result = await pool.query(query, [username]);
    if (result.rows.length > 0) {
      return result.rows[0];  
    } else {
      return([]);  
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Internal Database error");
  }
};

const getUsers = async () => {
  try {
    const results = await pool.query("SELECT * FROM users");
    return results.rows;
  } catch (error) {
    console.error("Error fetching users", error);
    throw new Error("Internal server error");
  }
};

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
    const {user_id, goal, is_completed } = body;
    const results = await pool.query(
      "INSERT INTO goals (user_id, goal, is_completed) VALUES ($1, $2, $3) RETURNING * ",
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
      "UPDATE goals SET user_id = $1, goal = $2, is_completed = $3 WHERE id = $4 RETURNING",
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

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  createUser,
  getUniqueUser,
  getUsers
};