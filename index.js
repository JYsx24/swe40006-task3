const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Initialize Table
pool.query(`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content VARCHAR(255) NOT NULL)`)
  .catch(err => console.error('Error creating table:', err));

// READ: Display form and database records
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
    const list = result.rows.map(row => `<li>${row.content}</li>`).join('');
    res.send(`
      <h2>Task 3.3: Database Integration</h2>
      <form action="/add" method="POST">
        <input type="text" name="content" required placeholder="Enter a message">
        <button type="submit">Write to DB</button>
      </form>
      <h3>Database Records:</h3>
      <ul>${list}</ul>
    `);
  } catch (err) {
    res.send(`Database Error: ${err.message}`);
  }
});

// WRITE: Insert data and redirect back to root
app.post('/add', async (req, res) => {
  try {
    await pool.query('INSERT INTO messages (content) VALUES ($1)', [req.body.content]);
    res.redirect('/');
  } catch (err) {
    res.send(`Write Error: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(\`App running on port \${port}\`);
});