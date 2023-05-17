import express, { Router } from 'express';
import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  deleteUserNotes,
} from './database.js';
import { auth } from './jwtAuth.js';
import jwt from 'jsonwebtoken';

const app = express();
const router = express.Router();

app.use(express.json());

// router
app.get('/', (req, res) => {
  res.send('Hello world');
});

// note 전체 검색 API
app.get('/notes', async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});

// noteid로 note 검색 API
app.get('/note/:id', async (req, res) => {
  const noteid = req.params.noteid;
  const note = await getNote(noteid);
  res.send(note);
});

// 노트 생성 API
app.post('/notes', async (req, res) => {
  const { userid, title, contents } = req.body;
  const note = await createNote(userid, title, contents);
  res.status(201).send(note);
});

// 노트 수정 API
// 이부분은 patch로 사용해야되는지 테스트 해봐야될듯?!
app.put('/updateNote/:id', async (req, res) => {
  const noteid = req.params.id;
  const { title, contents } = req.body;
  const note = await updateNote(noteid, title, contents);
  res.send(note);
});

// noteid로 노트 삭제 API
app.delete('/delNote/:id', async (req, res) => {
  const noteid = req.params.noteid;
  const note = await deleteNote(noteid);
  res.send(note);
});

// jwt
// 체크 해야되는거 확인하기
// 로그인 시 jwt 발급 API
app.post('/login', async (req, res, next) => {
  const key = process.env.SECRET_KEY;
  const { username, email, password } = req.body;

  // username || email || password가 null값인지 확인
  if (!username || !email || !password)
    res.status(400).json({ code: 400, message: 'username||email||pwd null' });

  const user = await getUser(username);

  // 에러처리
  if (!user) res.status(400).json({ code: 400, message: 'mysql user null' });
  if (user.username !== username)
    res.status(400).json({ code: 400, message: 'mysql username is undefined' });
  if (user.email !== email)
    res.status(400).json({ code: 400, message: 'mysql email is undefined' });
  if (user.password !== password)
    res.status(400).json({ code: 400, message: 'mysql password is undefined' });

  let token = '';
  token = jwt.sign(
    {
      type: 'JWT',
      username: username,
    },
    key,
    { expiresIn: '20m', issuer: 'eunhye' }
  );
  // response
  return res.status(200).json({
    code: 200,
    message: 'token is created',
    token: token,
  });
});

// jwt token auth 확인 API
app.get('/checkAuth', auth, (req, res) => {
  const username = req.decoded.username;
  return res.status(200).json({
    code: 200,
    message: '토큰이 정상입니다.',
    data: {
      username: username,
    },
  });
});

// user 생성 API
app.post('/user', async (req, res, next) => {
  const { username, email, password } = req.body;

  // username || email || password가 null값인지 확인
  if (!username || !email || !password)
    res.status(400).json({ code: 400, message: 'username||email||pwd null' });
  // email 형식 체크
  const reg_email =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  if (!reg_email.test(email))
    res
      .status(400)
      .json({ code: 400, message: 'email 형식이 잘못되었습니다.' });
  if (password.length < 8)
    res
      .status(400)
      .json({ code: 400, message: 'password는 최소 8자 이상이어야 합니다.' });

  const result = await createUser(username, email, password);
  res.status(201).send(result);
});

// userid로 user 검색 API
app.get('/user/:id', async (req, res) => {
  const username = req.params.id;
  const user = await getUser(username);
  res.send(user);
});

// user 전체 검색 API
app.get('/users', async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

// user 수정 API
app.put('/updateUser/:id', async (req, res) => {
  const userid = req.params.id;
  const { username, email, password } = req.body;
  const note = await updateUser(userid, username, email, password);
  res.send(note);
});

// user 삭제 API
// user 삭제 안됨!!!ㅠㅠㅠㅠㅠ
app.delete('/delUser/:id', async (req, res) => {
  const userid = req.params.userid;
  // 유저들의 노트 삭제
  await deleteUserNotes(userid);
  console.log(delUserNotes);
  const delUser = await deleteUser(userid);
  res.send(delUser);
});

// delete랑 put도 만들어보기

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
