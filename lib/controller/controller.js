/**
 * joyjs Controller base
 */

const co = require('co');
const fse = require('fs-extra');
const Promise = require('bluebird');
const EventEmitter = require('eventemitter3');

const ActionFilter = require('./actionFilter');
const ActionNotFoundError = require('./errors').ActionNotFoundError;

const ut = require('../util');

/**
 * Base controller class for joyjs
 * 
 * @class Controller
 * @extends {EventEmitter}
 */
class Controller extends EventEmitter {
    constructor(ctx) {
        super();
        this._filters = {};
        Object.assign(this, ctx);
        this.ctx = ctx;
    }
    /**
     * register filter(s) for specific action, the filter(s) will run before action execute
     * @param   {Function}  filter filter function
     * @example
     * class FooController extends Controller {
     *  constructor() {
     *      super();
     *      this.beforeFilter(f => {
     *          return service.checkUser(this.user.id)
     *              .then(user => {
     *                  if (!user) {
     *                      f.result = 'Unauthorized';
     *                      return false;
     *                  }
     *              });
     *      }, ['home', 'create']);
     *  }
     * }
     * 
     */
    beforeFilter(filter, actions) {
        this._registerFilter(filter, actions, 'before');
    }
    /**
     * register filter(s) for specific action, the filter(s) will run after action execute
     * @param   {Function}  filter filter function
     * @example
     * class FooController extends Controller {
     *  constructor() {
     *      super();
     *      this.afterFilter(f => {
     *          return service.checkUser(this.user.id)
     *              .then(user => {
     *                  if (!user) {
     *                      f.result = 'Unauthorized';
     *                      return false;
     *                  }
     *              });
     *      }, ['home', 'create']);
     *  }
     * }
     * 
     */
    afterFilter(filter, actions) {
        this._registerFilter(filter, actions, 'after');
    }
    /**
     * register a action filter
     * @private
     * @param {Function} filterFn
     * @param {Array|String} actions
     * @param {String} type filter type, before or after
     * 
     * @memberOf Controller
     */
    _registerFilter(filterFn, actions, type) {
        if (!Array.isArray(actions)) {
            actions = [actions]
        }
        actions.forEach(action => {
            let actionFilter = this._filters[action];
            if (!actionFilter) {
                actionFilter = {
                    before: [],
                    after: []
                }
            }
            let filters = actionFilter[type];
            if (!filters)　{
                filters = [];
            }
            filters.push(filterFn);
            actionFilter[type] = filters;
            this._filters[action] = actionFilter;
        });
    }
    /**
     * 
     * 
     * @private
     * @memberOf Controller
     */
    _doFilters() {

    }
    /**
     * Execute specific action in this controller 
     * 
     * @returns {Promise<any>}   resolve with invalid koa response body type(String, Buffer, Object, Stream or null) or an Error.
     */
    execute() {
        let actionName = this.route.actionName;
        let action = this[actionName];
        let ended = false;
        if (action && typeof action === 'function') {
            if (ut.isGeneratorFunction(action)) {
                action = co.wrap(action);
            }
            
            if (!ended) {
                let result = action.call(this);
                this.emit('afteraction', this, result);
                return Promise.resolve(result);
            }
        }
        return Promise.reject(new ActionNotFoundError(this.route.controllerName, this.route.actionName));
    }
    // View helper
    /**
     * 视图响应结果
     * @param {string} view 视图名称
     * @param {Object} viewData 视图数据 
     * @returns {Promise<string>} 已渲染的字符串resolve的Promise
     */
    view(view, viewData) {
        if (this.render) {
            this.ctx.state = viewData;
            return this.render.call(this.ctx, view);
        }
        return Promise.reject(new Error('No view engine found!'));
    }
    /**
     * JSON对象响应结果
     * @param {Object} json 响应json对象 
     * @returns {Promise<string>} 以序列化的json字符串resolve的Promise
     */
    json(json) {
        return new Promise((resolve, reject) => {
            let result = null;
            try {
                this.body = JSON.stringify(json);
            } catch(e) {
                return reject(e);
            }
            resolve(result);
        });
    }
    /**
     * 文件响应结果
     * 
     * @param {string} file 响应文件的路径，若为相对路径，则相对于`cwd`
     * @returns {Promise<Stream>} 若文件存在则返回以文件的stream对象resolve的Promise
     */
    file(file) {
        return new Promise((resolve, reject) => {
            let _path = file;
            if (!path.isAbsolute(file)) {
                _path = path.join(process.cwd, file);
            }
            fs.stat(_path, (error, stats) => {
                if (error) {
                    reject(error);
                }
                this.body = fs.createReadStream(_path);
                resolve();
            });

        });
    }
}

module.exports = Controller;
