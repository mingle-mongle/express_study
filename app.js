import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
} from './database.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/notes', async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});
app.get('/notes/:id', async (req, res) => {
  const id = req.params.id;
  const note = await getNote(id);
  res.send(note);
});

app.post('/notes', async (req, res) => {
  const { title, contents } = req.body;
  const note = await createNote(title, contents);
  res.status(201).send(note);
});

app.put('/updateNote/:id', async (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  const note = await updateNote(id, title, contents);
  res.send(note);
});

app.delete('/delNotes/:id', async (req, res) => {
  const id = req.params.id;
  const note = await deleteNote(id);
  res.send(note);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// jwt
app.post('/login', async (req, res, next) => {
  const key = process.env.SECRET_KEY;
  // 이게 아이디랑 패스워드라고 생각할예정!
  const { title, contents } = req.body;
  let token = '';
  token = jwt.sign(
    {
      type: 'JWT',
      title: title,
      contents: contents,
    },
    key,
    { expiresIn: '15m', issuer: '토근발급자' }
  );
  // response
  return res.status(200).json({
    code: 200,
    message: 'token is created',
    token: token,
  });
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
