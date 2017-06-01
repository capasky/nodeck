const RouteTable = require('../../router/routeTable');

let table = new RouteTable({
  cwd: process.cwd(),
  routes: 'tests/router/routes.js'
});