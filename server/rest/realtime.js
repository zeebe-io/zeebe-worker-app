const workers = require('./workers');

module.exports = (io) => {
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
};
