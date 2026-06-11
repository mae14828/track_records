-- テーブルの作成
CREATE TABLE IF NOT EXISTS records (
id INTEGER PRIMARY KEY,
player_id INTEGER NOT NULL,
distance_id INTEGER NOT NULL,  
record TIME NOT NULL,
created_at TIMESTAMP,
run_date DATE NOT NULL,
notes TEXT
);

CREATE TABLE IF NOT EXISTS players (
player_id SERIAL PRIMARY KEY,
player_name VARCHAR(16) NOT NULL,
gender CHAR(1) NOT NULL CHECK (gender IN ('女','男'))
);

CREATE TABLE IF NOT EXISTS distances (
distance_id INTEGER PRIMARY KEY,
value INTEGER NOT NULL
);
