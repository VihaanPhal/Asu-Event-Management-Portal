import { NextResponse } from "next/server";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT e.*, d.Name as DepartmentName, COUNT(r.RegistrationID) as RegistrationCount FROM Event e LEFT JOIN Department d ON e.DepartmentID = d.DepartmentID LEFT JOIN Registration r ON e.EventID = r.EventID GROUP BY e.EventID, d.Name"
      );
      client.release();
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching events from database" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
