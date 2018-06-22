const { Client } = require('zbc-node');

const zbClient = new Client({ bootstrapAddr: '0.0.0.0:51015' });

// Create a new topic "get started" with one partition and replicationFactor 1
zbClient.createTopic('get-started', 1, 1);

// Create our order workflow that we modeled above
const createWorkflowResult = zbClient.createWorkflow('get-started', 'order-process.bpmn');
console.log('Result', createWorkflowResult);
