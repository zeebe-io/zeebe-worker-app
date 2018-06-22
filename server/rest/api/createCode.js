const defaultCode = `zbClient.jobWorker(topicName, jobType, { workerName, lockDuration, credits }, (jobKey, payload) => {
  const newPayload = { a: 1 };
  zbClient.completeJob(jobKey, newPayload);
});`;

module.exports = body => `
const { Client } = require('zbc-node');

const config = {
  workerName: '${body.workerName}',
  topicName: '${body.topicName}',
  jobType: '${body.jobType}',
  autoStart: ${body.autoStart || false},
  server: '${body.server}',
  lockDuration: ${body.lockDuration || 30000},
  credits: ${body.credits || 30},
};

const main = () => {
  const zbClient = new Client({ bootstrapAddr: config.server });

  const originalCompleteJob = zbClient.completeJob;
  const originalFailJob = zbClient.failJob;

  zbClient.completeJob = function(jobKey) {
    console.log('completing job', jobKey);
    process.send({ status: 'completed' });
    return originalCompleteJob.apply(this, arguments);
  }

  zbClient.failJob = function(jobKey) {
    console.log('mark job as failed', jobKey);
    process.send({ status: 'failed' });
    return originalFailJob.apply(this, arguments);
  }

  const { topicName, jobType, workerName, lockDuration, credits } = config;

  /* CODE_START */
${body.code || defaultCode}
  /* CODE_END */
};

module.exports = config;

if (process.argv[2] === '--forked') {
  main();
}`;
