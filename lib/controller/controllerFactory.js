
const path = require('path');
const ControllerNotFoundError = require('./errors').ControllerNotFoundError;
const debug = require('debug')('app:controller:factory');
/**
 * 
 * 
 * @class ControllerFactory
 */
class ControllerFactory {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this._cache = {};
    }
    getController(ctx) {
        const route = ctx.route;
        if (!route) {
            return null;
        }
        const controllerPath = path.resolve(this.rootPath, route.area, route.controllerName + '.js');
        let Controller = null;
        if (this._cache[controllerPath]) {
            debug(`Load controller from cache`);
            Controller = this._cache[controllerPath];
        } else {
            debug(`Try to load controller from ${controllerPath}`);
            try {
                Controller = require(controllerPath);
                this._cache[controllerPath] = Controller;
            } catch(e) {
                console.error(e);
                throw new ControllerNotFoundError(route.controllerName, controllerPath, e);
            }
        }
        return new Controller(ctx);
    }
}

module.exports = ControllerFactory;
