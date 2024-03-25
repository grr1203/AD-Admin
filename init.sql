CREATE TABLE IF NOT EXISTS tb_user (
    `idx` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `id` TEXT UNIQUE NOT NULL, 
    `password` TEXT NOT NULL);

CREATE TABLE tb_screenSize (
    `idx` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `width` INTEGER NOT NULL,  
    `height` INTEGER NOT NULL);

CREATE TABLE tb_device (
    `idx` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `name` TEXT UNIQUE NOT NULL, 
    `ip` TEXT UNIQUE NOT NULL, 
    `screenSize` TEXT NOT NULL, 
    `code` TEXT, 
    `registeredDate` REAL DEFAULT (CURRENT_TIMESTAMP));

INSERT INTO tb_user (id, password) VALUES ('admin', '9999');
INSERT INTO tb_screenSize (width, height) VALUES (1920, 1080);
