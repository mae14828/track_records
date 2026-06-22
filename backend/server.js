const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'db',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'task_db'
});

app.get('/health', (req, res) => res.json({ status: 'OK' }));

// 最小: 一覧取得
app.get('/api/records', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM players'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
});
// players テーブルへ1件追加
app.post('/api/players', async (req, res) => {
  try {
    const { player_name, gender } = req.body;

    const result = await pool.query(
      'INSERT INTO players (player_name, gender) VALUES ($1, $2) RETURNING *',
      [player_name, gender]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert player' });
  }
});

// シンプルなエラーハンドラ
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

// {table名} の特定 id を削除（table内id} を使用）
app.delete('/api/players/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM players WHERE player_id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});