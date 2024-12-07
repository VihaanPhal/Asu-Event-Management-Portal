const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// Database connection
const pool = new Pool({
  user: "vihaanphal",
  host: "localhost",
  database: "event_management",
  port: "5432",
});

// Connection error handling
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Database error:", err);
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});
// Add this after your other endpoints
app.post("/api/events", async (req, res) => {
  try {
    const { name, location, date, description, departmentId } = req.body;

    const result = await pool.query(
      `INSERT INTO Event (Name, Location, Date, Description, DepartmentID) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, location, date, description, departmentId]
    );

    res.status(201).json({
      message: "Event created successfully",
      event: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({
      error: "Error creating event",
      details: err.message,
    });
  }
});
// delete events by ID
app.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    // First, delete related records in Registration and Feedback tables
    await pool.query("DELETE FROM Registration WHERE eventid = $1", [eventId]);
    await pool.query("DELETE FROM Feedback WHERE eventid = $1", [eventId]);

    // Then delete the event
    const result = await pool.query("DELETE FROM Event WHERE eventid = $1", [
      eventId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({
      error: "Error deleting event",
      details: err.message,
    });
  }
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

app.get("/api/events/:eventId/registrations", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await pool.query(
      `
      SELECT r.registrationid, r.date as registration_date, 
             u.userid, u.name as user_name, u.usertype
      FROM Registration r
      JOIN "User" u ON r.userid = u.userid
      WHERE r.eventid = $1
      ORDER BY r.date DESC
    `,
      [eventId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({
      error: "Error fetching registrations",
      details: err.message,
    });
  }
});

// Register for an event
app.post("/api/events/:eventId/register", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { userName } = req.body; // Changed from userId to userName
    const currentDate = new Date().toISOString().split("T")[0];

    // First get the user ID by name
    const userResult = await pool.query(
      'SELECT userid FROM "User" WHERE name = $1',
      [userName]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].userid;

    // Check if already registered
    const checkRegistration = await pool.query(
      "SELECT * FROM Registration WHERE eventid = $1 AND userid = $2",
      [eventId, userId]
    );

    if (checkRegistration.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Already registered for this event" });
    }

    // Register the user
    await pool.query(
      "INSERT INTO Registration (eventid, userid, date) VALUES ($1, $2, $3)",
      [eventId, userId, currentDate]
    );

    // Get updated registration count
    const registrationCount = await pool.query(
      "SELECT COUNT(*) FROM Registration WHERE eventid = $1",
      [eventId]
    );

    res.status(201).json({
      message: "Successfully registered",
      registrationCount: registrationCount.rows[0].count,
    });
  } catch (err) {
    console.error("Error registering:", err);
    res.status(500).json({
      error: "Error registering",
      details: err.message,
    });
  }
});

// Get registered events for a user
app.get("/api/users/:userId/registered-events", async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await pool.query(
      `
      SELECT 
        e.eventid, 
        e.name, 
        e.location, 
        e.date, 
        e.description,
        d.name as department_name,
        (SELECT COUNT(*) FROM registration WHERE eventid = e.eventid) as registration_count,
        r.date as registration_date
      FROM Event e
      JOIN Registration r ON e.eventid = r.eventid
      JOIN Department d ON e.departmentid = d.departmentid
      WHERE r.userid = $1
      ORDER BY e.date DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user's registered events:", err);
    res.status(500).json({
      error: "Error fetching registered events",
      details: err.message,
    });
  }
});

//get user by name
app.get("/api/users/by-name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const result = await pool.query('SELECT * FROM "User" WHERE name = $1', [
      name,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      error: "Error fetching user",
      details: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
