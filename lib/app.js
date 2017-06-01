'use strict';

const path = require('path');
const Promise = require('bluebird');
const Koa = require('koa');
const defaultsDeep = require('lodash/defaultsDeep');

const logger = require('./log');

//Middlewares
const staticFile = require('./middleware/static');
const bodyParser = require('./middleware/bodyparser');
const body = require('./middleware/bodyparser');
const view = require('./middleware/view');
const requestLogger = require('./middleware/log/requestLogger');
const router = require('./router');
const controller = require('./controller');

const log = logger.createLogger('app');

/**
 * Web Application
 * 
 * @class Application
 */
class Application {
  /**
   * @param   {Object}    options
   * @param   {String}    options.cwd     工作目录
   * @param   {String}    options.routes  路由表配置
   * @param   {String}    options.controller  控制器目录
   * @param   {String}    options.view    视图目录
   * @param   {String}    options.staticFile  静态文件根目录
   * @param   {Array<String>}    options.middlewares 中间件名称集合
   * @param   {String}    options.middlewarePath  中间件目录
   */
  constructor(options = {}) {
    const app = this._app = new Koa();
    let opt = this._opt = defaultsDeep(options, {
      cwd: process.cwd(),
      routes: './config/routes.js',
      controller: './app/controller',
      view: './app/view',
      staticFileDir: './public',
      middlewares: [],
      middlewarePath: './middleware',
      requestLogger: {
        simple: true,
      }
    });
    app.proxy = true;

    // 请求日志记录
    app.use(requestLogger(opt.requestLogger));

    let viewRootDir = path.resolve(opt.cwd, opt.view);
    log.info(`View root dir set to ${viewRootDir}`);
    app.use(view(viewRootDir, {
      map: {
        html: 'ejs'
      }
    }));

    //静态文件处理
    let staticFileDir = path.resolve(opt.cwd, opt.staticFileDir);
    log.info(`Static files directory set to ${staticFileDir}`);
    app.use(staticFile(staticFileDir));

    // 请求正文解析
    app.use(body({
      multipart: true,
      keepExtensions: true,
      strict: false,
    }));

    app.use(router(opt));

    // 加载自定义中间件
    opt.middlewares.forEach(middleware => {
      let mwpath = path.resolve(opt.cwd, opt.middlewarePath, `/${middleware}.js`);
      log.info(`Loading user middleware from "${mwpath}"`);
      let mw = null;
      let mwOptions = opt[middleware] || {};
      try {
        mw = require(mwpath);
      } catch (e) {
        log.error(e);
      }
      mw && app.use(mw(mwOptions));
    });

    app.use(controller(opt));
  }
  start(port = 5000) {
    return new Promise((resolve, reject) => {
      this._app.listen(port, error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
}

module.exports = Application;