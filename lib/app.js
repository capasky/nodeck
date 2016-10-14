'use strict';

const path = require('path');
const Promise = require('bluebird');
const Koa = require('koa');
const defaults = require('lodash/defaults');

const logger = require('./log');

//Middlewares
const staticFile = require('./middleware/static');
const bodyParser = require('./middleware/bodyparser');
const validate = require('./middleware/bodyparser');
const body = require('./middleware/bodyparser');
const view = require('./middleware/view');
const router = require('./router');
const controller = require('./controller');

const log = logger.createLogger('app');

/**
 * Web Application
 * 
 * @class Application
 */
class Application {
    constructor(options) {
        const app = this._app = new Koa();
        let opt = this._opt = defaults(options, {
            cwd: process.cwd(),
            routes: './config/routes.js',
            controller: './app/controller',
            view: './app/view',
            staticFileDir: './public',
            middlewares: [],
            middlewarePath: './middleware',
        });

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
            } catch(e) {
                log.error(e);
            }
            mw && app.use(mw(mwOptions));
        });

        let viewRootDir = path.resolve(opt.cwd, opt.view);
        log.info(`View root dir set to ${viewRootDir}`);
        app.use(view(viewRootDir, {
            map: {
                html: 'ejs'
            }
        }));
        app.use(controller(opt))
    }
    start(port = 5000) {
        return new Promise((resolve, reject) => {
            this._app.listen(error => {
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
