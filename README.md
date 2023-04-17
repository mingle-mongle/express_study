# express_study

Node.js / Express.js / MySql

### MYSQL SCHEMA

CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE notes (
id integer PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
contents TEXT NOT NULL,
created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO notes (title, contents)
VALUES
('My First Note', 'A note about something'),
('My Second Note', 'A note about something else');

### Express & MYSQL (CRUD)

SELECT All : getNotes
SELECT(id) : getNote(id)
CREATE : createNote(title, contents)
UPDATE : updateNote(id, title, contents)
DELETE : deleteNote(id)
