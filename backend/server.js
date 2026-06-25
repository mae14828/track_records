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

// records 一覧取得
app.get('/api/records', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM records ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
});
// records テーブルへ1件追加
app.post('/api/records', async (req, res) => {
  try {
    const {
      player_id,
      distance_id,
      record,
      run_date,
      notes
    } = req.body;//frontendから送られてきたデータを受け取る

    const result = await pool.query(
      'INSERT INTO records (player_id, distance_id, record, run_date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        player_id, 
        distance_id, 
        record, 
        run_date, 
        notes
      ]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert records' });
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
app.delete('/api/records/:id', async (req, res) => {
  const id = req.params.id;//frontendから送られてきたidを受け取る
  try {
    const result = await pool.query(
      'DELETE FROM records WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ 
      deleted: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Failed to delete' 
    });
  }
});

// ここから下は、他のルートやエラーハンドリングなどを追加することができます
//自分では理解していません。。。。。
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Backend listening on ${PORT}`);
// });