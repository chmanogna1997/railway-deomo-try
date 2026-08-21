require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/physicians', async (req, res) => {
  console.log(" hitting this ")
  try {
    const result = await pool.query('SELECT * FROM physicians ORDER BY id ASC');
    console.log(" the result is >>> ", result.rows)

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'No physicians found', status: 404 });
    }

    res.status(200).json({ data: result.rows, status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

app.post('/api/physicians/:id/like', async (req, res) => {
  const { id } = req.params;
  console.log(`[Like] Attempting to like physician ID: ${id}`);

  try {
    const result = await pool.query(
      'UPDATE physicians SET likes_count = likes_count + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Physician not found', status: 404 });
    }

    console.log(`[Like] Physician ID ${id} liked. New count: ${result.rows[0].likes_count}`);
    res.status(200).json({ data: result.rows[0], status: 200 });
  } catch (error) {
    console.error('[Like] Database error:', error);
    res.status(500).json({ error: 'Failed to like physician', status: 500 });
  }
});

app.post('/api/physicians/:id/unlike', async (req, res) => {
  const { id } = req.params;
  console.log(`[Unlike] Attempting to unlike physician ID: ${id}`);

  try {
    const result = await pool.query(
      'UPDATE physicians SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Physician not found', status: 404 });
    }

    console.log(`[Unlike] Physician ID ${id} unliked. New count: ${result.rows[0].likes_count}`);
    res.status(200).json({ data: result.rows[0], status: 200 });
  } catch (error) {
    console.error('[Unlike] Database error:', error);
    res.status(500).json({ error: 'Failed to unlike physician', status: 500 });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
