import mysql from 'mysql2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query('SELECT * FROM notes');
  return rows;
}
export async function getNote(noteid) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM notes
  WHERE noteid = ?
  `,
    [noteid]
  );
  return rows[0];
}

export async function createNote(userid, title, contents) {
  const [result] = await pool.query(
    `
  INSERT INTO notes (userid, title, contents)
  VALUES (?, ?, ?)
  `,
    [userid, title, contents]
  );
  const id = result.insertId;
  return getNote(id);
}

export async function updateNote(noteid, title, contents) {
  const [result] = await pool.query(
    `UPDATE notes
    SET title = ?,
        contents = ?
    WHERE noteid = ?`,
    [title, contents, noteid]
  );
  return 'changedRows : ' + result.changedRows;
}

export async function deleteNote(noteid) {
  await pool.query(
    `
  DELETE FROM notes
  WHERE noteid = ?`,
    [id]
  );
  return getNotes();
}

export async function getUsers() {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM users
  `
  );
  return rows[0];
}

export async function getUser(username) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM users
  WHERE username = ?
  `,
    [username]
  );
  return rows[0];
}

export async function createUser(username, email, password) {
  const [result] = await pool.query(
    `
  INSERT INTO users (username, email, password)
  VALUES (?, ?, ?)
  `,
    [username, email, password]
  );
  const id = result.insertId;
  return getUserId(id);
}

export async function getUserId(id) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM users
  WHERE userid = ?
  `,
    [id]
  );
  return rows[0];
}

export async function updateUser(userid, username, email, password) {
  const [result] = await pool.query(
    `UPDATE users
    SET username = ?,
        email = ?,
        password = ?
    WHERE userid = ?`,
    [username, email, password, userid]
  );
  return 'changedRows : ' + result.changedRows;
}

export async function deleteUserNotes(userid) {
  await pool.query(
    `
  DELETE FROM notes
  WHERE userid = ?`,
    [userid]
  );
  return deleteUser(userid);
}
// 위에쿼리 실행 후 deleteUser() 로 리턴을 해서
// 밑에것도 실행되게하게 하고싶었습니다
export async function deleteUser(userid) {
  await pool.query(
    `
  DELETE FROM users
  WHERE userid = ?`,
    [userid]
  );
  return getUsers();
}

// const result = await updateNote(5, 'hiiii', 'hiiii');
// console.log(result);

// const result = await createNote('test', 'test');
// console.log(result);

// const note = await getNote(1);
// console.log(note);
