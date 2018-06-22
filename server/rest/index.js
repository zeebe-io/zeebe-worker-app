const http = require('http');
const sio = require('socket.io');

const app = require('./app');

const server = http.Server(app);
const io = sio(server);

require('./api');
require('./realtime')(io);

const workers = require('./workers');

const port = process.env.PORT || 4861;

server.listen(port, () => {
  console.log(`Receiving traffic: http://127.0.0.1:${port}/`);
});

process.on('SIGINT', () => {
  workers.forEach((worker) => {
    if (worker.childProcess) {
      worker.childProcess.kill('SIGHUP');
    }
  });
  process.exit();
});
