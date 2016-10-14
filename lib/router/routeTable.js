

const _ = require('lodash');
const path = require('path');
const Route = require('./route');
const debug = require('debug')('wee:routetable');
const logger = require('../log');
const log = logger.createLogger('router');

const REST_METHODS = [
    'get /{resource} => {resource}#all',
    'get /{resource}/:id(\\d+) => {resource}#details',
    'post /{resource} => {resource}#create',
    'put /{resource} => {resource}#update',
    'delete /{resource} => {resource}#del',
]

const extractRoutes = (routes, area, parsedRoutes) => {
    routes.forEach(route => {
        if (_.isString(route)) {
            parsedRoutes.push(new Route(route, area));
        } else if (_.isObject(route)) {
            if (route.rest) { //check if rest api route rules
                let resource = route.resource;
                REST_METHODS.forEach(m => {
                    parsedRoutes.push(new Route(m.replace(/\{resource\}/g, resource), area));
                });
            } else {
                extractRoutes(route.routes, route.area, parsedRoutes);
            }
        }
    });
};

class RouteTable {
    constructor(routesConfigFile) {
        this.routesConfigFile = routesConfigFile;
        this.loadRoutes();  
    }
    loadRoutes() {
        debug(`Loading routes from "${this.routesConfigFile}"`);
        let routes = null;
        try {
            routes = require(this.routesConfigFile);
        } catch(error) {
            log.error(error);
            throw error;
        }
        let parsedRoutes = [];
        extractRoutes(routes, '', parsedRoutes);
        this.routes = parsedRoutes;
    }
    getRoute(method, url, params) {
        let _route = null;
        let _params;
        this.routes.some(route => {
            if (_params = route.match(method, url)) {
                _route = route;
                Object.assign(params, _params);
                return true;
            }
            return false;
        });
        return _route;
    }
}

module.exports = RouteTable;
