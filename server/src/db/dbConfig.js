const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("error", (err, client) => {
  console.error("Nieoczekiwany błąd podczas łączenia z bazą danych", err);
  process.exit(-1);
});

module.exports = pool;
