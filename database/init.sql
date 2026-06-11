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
player_id INTEGER PRIMARY KEY,
player_name CHAR(16) NOT NULL,
gender ENUM ( '女' , '男' )
);

CREATE TABLE IF NOT EXISTS distances (
distance_id INTEGER PRIMARY KEY,
value INTEGER NOT NULL,
);

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
