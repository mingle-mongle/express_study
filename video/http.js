const http = require('http');
const fs = require('fs');

console.log(http.STATUS_CODES);
console.log(http.METHODS);

const server = http.createServer((req, res) => {
  console.log('incoming...');
  console.log(req.headers);
  console.log(req.httpVersion);
  console.log(req.method);
  console.log(req.url);
  const url = req.url;
  res.setHeader('Content-Type', 'text/html');
  if (url === '/') {
    const read = fs.createReadStream('html/index.html');
    read.pipe(res);
  } else if (url === '/courses') {
    const read = fs.createReadStream('html/courses.html');
    read.pipe(res);
  } else {
    const read = fs.createReadStream('html/not-found.html');
    read.pipe(res);
  }
});

server.listen(8080);
