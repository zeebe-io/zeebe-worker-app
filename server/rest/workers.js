const childProcess = require('child_process');
const fs = require('fs');

const workers = [];

/**
 * Create list of WorkerFiles
 */
const workerFiles = fs.readdirSync('./workerFiles').filter(workerFile => workerFile !== '.gitkeep');

/**
 * Read the metadata of all existing workers
 */
workerFiles.forEach((workerFile) => {
  const stats = fs.statSync(`./workerFiles/${workerFile}`);
  workers.push({
    workerFile,
    meta: require(`./workerFiles/${workerFile}`),
    completed: 0,
    failed: 0,
    ctimeMs: stats.ctimeMs,
  });
});

/**
 * Automatically start workers which contain an autoStart Boolean being true
 */
workers.forEach((worker) => {
  if (worker.meta.autoStart) {
    worker.childProcess = childProcess.fork(`./workerFiles/${worker.workerFile}`, ['--forked']);
  }
});

module.exports = workers;
