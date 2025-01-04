const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',       // Replace with your database host
  user: 'root',            // Replace with your database user
  password: 'Pvpsit@1234', // Replace with your database password
  database: 'BIGMOM',      // Name of your database
  multipleStatements: true // Allow multiple SQL statements
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connection successful');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();
