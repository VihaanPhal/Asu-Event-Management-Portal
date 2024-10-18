const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3001;

// cors Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Database connection
const pool = new Pool({
  user: "vihaanphal",
  host: "localhost",
  database: "event_management",
  password: "Password",
  port: "5432",
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    console.log("Attempting to fetch events...");
    const result = await pool.query(`
        SELECT e.*, 
               d.name as department_name,
               (SELECT COUNT(*) FROM registration r WHERE r.eventid = e.eventid) as registration_count
        FROM event e 
        LEFT JOIN department d ON e.departmentid = d.departmentid 
        ORDER BY e.eventid
      `);
    console.log("Query executed successfully. Row count:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Error fetching events from database",
      details: err.message,
      stack: err.stack,
    });
  }
});

app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connection successful",
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      error: "Error connecting to database",
      details: err.message,
      stack: err.stack,
    });
  }
});

app.post("/api/store-user", async (req, res) => {
  const { name, userType } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM "User" WHERE name = $1',
      [name]
    );

    if (existingUser.rows.length > 0) {
      // User already exists, return the existing user
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser.rows[0] });
    }

    // Insert new user
    // The userid will be automatically generated due to SERIAL PRIMARY KEY
    const newUser = await pool.query(
      'INSERT INTO "User" (name, usertype) VALUES ($1, $2) RETURNING *',
      [name, userType]
    );

    res
      .status(201)
      .json({ message: "User stored successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error storing user:", error);
    res
      .status(500)
      .json({ message: "Error storing user", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
