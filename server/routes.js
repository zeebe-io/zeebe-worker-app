const nextRoutes = require('next-routes');

const routes = nextRoutes();

routes.add('index', '/');
routes.add('/workers/:id', 'edit-worker');

module.exports = routes;
