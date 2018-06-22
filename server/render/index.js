const next = require('next');
const routes = require('./routes');
const express = require('express');
const compression = require('compression');
const mobxReact = require('mobx-react');

mobxReact.useStaticRendering(true);

const port = process.env.PORT || 4860;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: './src' });
const handle = routes.getRequestHandler(app);

app
  .prepare()
  .then(express()
    .use(compression())
    .use(handle)
    .listen(port, () => {
      console.log(`Receiving traffic: http://127.0.0.1:${port}/`);
    }))
  .catch(err => console.error(err));
