
const _ = require('lodash');
const path = require('path');

const RouteTable = require('./routeTable');
const ControllerFactory = require('../controller/controllerFactory');

const debug = require('debug')('wee:router');
const defaultOptions = {
    cwd: process.cwd(),
    controller: 'app/controller',
    routes: 'config/routes.json'
};

module.exports = options =>　{
    options = _.defaults(options, defaultOptions);
    
    const routesConfigFile = path.resolve(options.cwd, options.routes);
    const routeTable = new RouteTable(routesConfigFile);

    return function router(ctx, next) {
        let path = ctx.path;
        ctx.request.params = {};
        let route = routeTable.getRoute(ctx.method, path, ctx.request.params);
        if (!route) {
            ctx.status = 404;
            return next();
        }
        debug(`Got route ${JSON.stringify(route)}`);
        ctx.route = route;
        return next();
    }
}
