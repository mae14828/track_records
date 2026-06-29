-- テーブルの作成
CREATE TABLE IF NOT EXISTS records (
id SERIAL PRIMARY KEY,
player_id SERIAL NOT NULL,
distance_id SERIAL NOT NULL,
record TIME NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
run_date DATE NOT NULL,
notes TEXT
);

CREATE TABLE IF NOT EXISTS players (
player_id SERIAL PRIMARY KEY,
player_name VARCHAR(16) NOT NULL,
gender CHAR(1) NOT NULL CHECK (gender IN ('女','男'))
);

CREATE TABLE IF NOT EXISTS distances (
distance_id SERIAL PRIMARY KEY,
value INTEGER NOT NULL
);

INSERT INTO distances (distance_id, value)
VALUES 
  (1, 1000),
  (2, 1500),
  (3, 3000)
ON CONFLICT (distance_id) DO UPDATE SET value = EXCLUDED.value;