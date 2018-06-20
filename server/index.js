const next = require('next');
const routes = require('./routes');
const express = require('express');
const compression = require('compression');
const mobxReact = require('mobx-react');
const fs = require('fs');
const child_process = require('child_process');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const createCode = require('./createCode');

mobxReact.useStaticRendering(true);

const port = process.env.PORT || 4860;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: './src' });

const handle = routes.getRequestHandler(app);

const expressApp = express();
const server = require('http').Server(expressApp);
const io = require('socket.io')(server);

const workerFiles = fs
  .readdirSync('server/workers')
  .filter(workerFile => workerFile !== '.gitkeep');

const workers = [];

setInterval(() => {
  const stats = {};

  workers.forEach((worker) => {
    stats[worker.workerFile] = {
      completed: worker.completed,
      failed: worker.failed,
    };
  });

  io.sockets.emit('update-stats', stats);
}, 500);

workerFiles.forEach((workerFile) => {
  const stats = fs.statSync(`server/workers/${workerFile}`);
  workers.push({
    workerFile,
    meta: require(`./workers/${workerFile}`),
    completed: 0,
    failed: 0,
    ctimeMs: stats.ctimeMs,
  });
});

workers.forEach((worker) => {
  if (worker.meta.autoStart) {
    worker.childProcess = child_process.fork(`./server/workers/${worker.workerFile}`, ['--forked']);
  }
});

expressApp.use(bodyParser.json());

expressApp.get('/json/workers', (req, res) => {
  res.json(workers
    .map((worker) => {
      const newObject = Object.assign({}, worker);
      newObject.childProcess = !!newObject.childProcess;
      return newObject;
    })
    .sort((a, b) => a.ctimeMs > b.ctimeMs));
});

expressApp.post('/json/activate-worker', (req, res) => {
  const { body } = req;

  const worker = workers.find(w => w.workerFile === body.workerFile);

  worker.childProcess = child_process.fork(`./server/workers/${worker.workerFile}`, ['--forked']);
  worker.childProcess.on('message', (message) => {
    const { status } = message;
    if (status === 'completed') {
      worker.completed++;
    }
    if (status === 'failed') {
      worker.failed++;
    }
  });

  res.json({
    childProcess: !!worker.childProcess,
  });
});

expressApp.get('/json/workers/:id', (req, res) => {
  const worker = workers.find(w => w.workerFile === req.params.id);
  const parsedWorker = Object.assign({}, worker);
  parsedWorker.childProcess = !!parsedWorker.childProcess;

  const code = fs.readFileSync(`server/workers/${worker.workerFile}`, 'utf-8');

  const codeSplit = code
    .split('/* CODE_START */')[1]
    .split('/* CODE_END */')[0]
    .replace(/^\s+|\s+$/g, '');
  parsedWorker.code = codeSplit;

  res.json(parsedWorker);
});

expressApp.post('/json/deactivate-worker', (req, res) => {
  const { body } = req;

  const worker = workers.find(w => w.workerFile === body.workerFile);

  if (worker.childProcess) {
    worker.childProcess.kill('SIGHUP');
    worker.childProcess = false;
  }

  res.json({
    childProcess: worker.childProcess,
  });
});

expressApp.post('/json/workers', (req, res) => {
  const workerFileName = `${uuid.v4()}.js`;

  const { body } = req;

  const code = createCode(body);

  fs.writeFileSync(`server/workers/${workerFileName}`, code);

  workers.push({
    workerFile: workerFileName,
    childProcess: false,
    completed: 0,
    failed: 0,
    meta: require(`./workers/${workerFileName}`),
  });

  res.json(workers[workers.length - 1]);
});

expressApp.delete('/json/workers', (req, res) => {
  const { body } = req;
  const worker = workers.find(w => w.workerFile === body.workerFile);

  fs.unlinkSync(`server/workers/${worker.workerFile}`);
  const workerIndex = workers.indexOf(worker);
  workers.splice(workerIndex, 1);

  res.json({});
});

expressApp.put('/json/workers/:id', (req, res) => {
  const { body } = req;
  const meta = body.meta;
  const workerFile = body.workerFile;
  const worker = workers.find(w => w.workerFile === workerFile);

  meta.code = body.code;

  const code = createCode(meta);
  fs.writeFileSync(`server/workers/${workerFile}`, code);

  worker.meta = require(`./workers/${workerFile}`);

  res.json({});
});

app
  .prepare()
  .then(() => {
    expressApp.use(compression()).use(handle);

    return server.listen(port, () => {
      console.log(`Receiving traffic: http://127.0.0.1:${port}/`);
    });
  })
  .catch(err => console.error(err));

process.on('SIGINT', () => {
  workers.forEach((worker) => {
    if (worker.childProcess) {
      worker.childProcess.kill('SIGHUP');
    }
  });
  process.exit();
});
