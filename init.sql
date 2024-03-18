CREATE TABLE IF NOT EXISTS tb_file (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    ext TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_file (name, ext) VALUES ('sample.mp4', 'mp4');