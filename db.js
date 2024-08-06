// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_tracker",
  password: "password123",
  port: 5432, // default PostgreSQL port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: async () => {
    try {
      await pool.connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  },
  end: async () => {
    try {
      await pool.end();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error closing database connection:", error);
      throw error;
    }
  },
};
