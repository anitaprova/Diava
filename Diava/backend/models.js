const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Diava",
  password: "Iwtbrinn#03",
  port: 5432,
});


const createUser = async (body) => {
  try {
    const {user_id, name} = body;
    const results = await pool.query(
      "INSERT INTO users (user_id, name) VALUES ($1, $2) RETURNING * ",
      [ user_id, name]
    );
    const userId = results.rows[0].user_id;
    const defaultLists = ["Want to Read", "Currently Reading", "Read"];
    for (const listName of defaultLists) {
      await pool.query(
        "INSERT INTO lists (user_id, name) VALUES ($1, $2)",
        [userId, listName]
      );
    }
    return results.rows[0]; // Return the created user
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Internal server error");
  }
};
const getUniqueUser = async (user_id) => {
  try {
    const query = "SELECT name FROM users WHERE user_id = $1";
    const result = await pool.query(query, [user_id]);
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
    const { user_id, goal, is_completed } = body;
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

// Get all lists
const getLists = async (user_id) => {
  try {
    const results = await pool.query(
      "SELECT * FROM lists WHERE user_id = $1",
      [user_id]
    );
    return results.rows;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw new Error("Internal server error", error);
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

const addBook = async (body) => {
  try {
    const { list_id, google_book_id, title, thumbnail,user_id, author} = body;
    const results = await pool.query("INSERT INTO list_books (list_id, google_book_id, title, thumbnail,user_id, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [list_id, google_book_id, title, thumbnail, user_id,author]);
    return results.rows[0];
  } catch(error) {
    console.error("Error adding book to user's list: ", error);
    throw new Error("Internal database error.");
  }
};

const getBooks = async () => {
  try {
    const results = await pool.query("SELECT * FROM list_books");
    return results.rows;
  } catch (error) {
    console.error("Error fetching users", error);
    throw new Error("Internal server error");
  }
};

const getUserBooks = async (user_id, name) => {
  try {
    console.log("user_id:", user_id);
    console.log("list name:", name);
    const result = await pool.query(
      "SELECT * FROM list_books JOIN lists ON list_books.list_id = lists.id WHERE lists.user_id = $1 AND name = $2",
      [user_id, name]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user's books:", error);
    throw new Error("Internal Database error");
  }
};

// Get review for a specific user and book
const getReview = async (user_id, book_id) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2",
      [user_id, book_id]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw new Error("Internal server error");
  }
};

// Add a review for a book
const addReview = async (body) => {
  const {
    user_id,
    book_id,
    rating,
    review_text,
    start_date,
    end_date,
    format,
    tags,
  } = body;

  try {
    const { rows, rowCount } = await pool.query(
      "INSERT INTO reviews (user_id, book_id, rating, review_text, start_date, end_date, format, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        user_id,
        book_id,
        rating,
        review_text,
        start_date,
        end_date,
        format,
        tags,
      ]
    );

    if (rowCount === 0) {
      throw new Error("Review not created");
    }

    return rows[0];
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  createUser,
  getUniqueUser,
  getUsers,
  getLists,
  addList,
  updateList,
  deleteList,
  addBook,
  getBooks,
  getUserBooks,
  addReview,
  getReview
};
