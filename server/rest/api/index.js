const childProcess = require('child_process');
const fs = require('fs');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');

const createCode = require('./createCode');
const app = require('./../app');
const workers = require('./../workers');

app.use(cors());
app.use(bodyParser.json());

app.get('/workers', (req, res) => {
  res.json(workers
    .map((worker) => {
      const newObject = Object.assign({}, worker);
      newObject.childProcess = !!newObject.childProcess;
      return newObject;
    })
    .sort((a, b) => a.ctimeMs > b.ctimeMs));
});

app.post('/activate-worker', (req, res) => {
  const { body } = req;

  const worker = workers.find(w => w.workerFile === body.workerFile);

  worker.childProcess = childProcess.fork(`./workerFiles/${worker.workerFile}`, ['--forked']);
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

app.get('/workers/:id', (req, res) => {
  const worker = workers.find(w => w.workerFile === req.params.id);
  const parsedWorker = Object.assign({}, worker);
  parsedWorker.childProcess = !!parsedWorker.childProcess;

  const code = fs.readFileSync(`./workerFiles/${worker.workerFile}`, 'utf-8');

  const codeSplit = code
    .split('/* CODE_START */')[1]
    .split('/* CODE_END */')[0]
    .replace(/^\s+|\s+$/g, '');
  parsedWorker.code = codeSplit;

  res.json(parsedWorker);
});

app.post('/deactivate-worker', (req, res) => {
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

app.post('/workers', (req, res) => {
  const workerFileName = `${uuid.v4()}.js`;

  const { body } = req;

  const code = createCode(body);

  fs.writeFileSync(`./workerFiles/${workerFileName}`, code);

  workers.push({
    workerFile: workerFileName,
    childProcess: false,
    completed: 0,
    failed: 0,
    meta: require(`./../workerFiles/${workerFileName}`),
  });

  res.json(workers[workers.length - 1]);
});

app.delete('/workers', (req, res) => {
  const { body } = req;
  const worker = workers.find(w => w.workerFile === body.workerFile);

  fs.unlinkSync(`./workerFiles/${worker.workerFile}`);
  const workerIndex = workers.indexOf(worker);
  workers.splice(workerIndex, 1);

  res.json({});
});

app.put('/workers/:id', (req, res) => {
  const { body } = req;
  const meta = body.meta;
  const workerFile = body.workerFile;
  const worker = workers.find(w => w.workerFile === workerFile);

  meta.code = body.code;

  const code = createCode(meta);
  fs.writeFileSync(`./workerFiles/${workerFile}`, code);

  worker.meta = require(`./../workerFiles/${workerFile}`);

  res.json({});
});
