import express from 'express';
const app = express();

app.get('/sky/:id', (req, res, next) => {
  // console.log('path : ', req.path);
  // console.log('headers : ', req.headers);
  console.log('params : ', req.params);
  console.log(req.params.id);
  console.log('query : ', req.query);

  // res.send({ name: 'eunhye' });
  // res.sendStatus(404);
  res.setHeader('Content-Type', 'application/json');
  res.status(201).send('created');
});

app.listen(8080);
