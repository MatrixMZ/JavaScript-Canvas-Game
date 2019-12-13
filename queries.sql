-- There are some SQL queries I have used to create the table 
-- and fill the table with some data

-- the difficulty enum in postgre sql defines 
-- that there can be only 3 different types of string that can be putted 
-- to the table where is the difficulty field

CREATE TYPE difficulty AS ENUM ('HARD', 'MEDIUM', 'EASY');


CREATE TABLE settings (
    difficulty difficulty, 
    bulletSpeed real,
    playerMissleSpeed real,
    playerMoveSpeed real,
    playerLives smallint
);

INSERT INTO settings VALUES ('EASY', 2, 9, 0.4, 10);
INSERT INTO settings VALUES ('MEDIUM', 2, 5, 0.35, 5);
INSERT INTO settings VALUES ('HARD', 2.5, 4, 0.3, 3);

SELECT * FROM settings WHERE difficulty = 'MEDIUM';