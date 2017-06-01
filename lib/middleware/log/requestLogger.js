/**
 * Middleware - RequestLogger
 * 请求日志中间件
 * @author capasky(hzyangzhouzhi@corp.netease.com)
 */

'use strict';

const { isEmpty, isString, isBuffer } = require('lodash');
const chalk = require('chalk');
const moment = require('moment');
const logger = require('../../log');

const log = logger.createLogger('app:request');

const MAX_INSPECT_BODY_LENGTH = 200;

module.exports = options => {
  const isSimple = !!options.simple;
  return function* requestLogger(next) {
    let files = null;
    let fields = null;
    let cookie = this.get('Cookie');
    let start = moment();
    let msg = `${chalk.magenta(this.method)} ${this.path} from ${this.ip}`;
    if (cookie) {
      msg += ` with cookie "${cookie}"`;
    }
    if (this.query && !isEmpty(this.query)) {
      msg += ` with querystring ${JSON.stringify(this.query)}`;
    }
    if (this.request.body) {
      files = JSON.stringify(this.request.body.files);
      fields = JSON.stringify(this.request.body.fields);
      if (fields && !isEmpty(fields)) {
        msg += ` with form params ${fields}`;
      }
      if (files && !isEmpty(files)) {
        msg += ` with files ${files}`;
      }
    }
    log.info(msg);

    let body;
    try {
      yield next;
      if (isString(this.body) || isBuffer(this.body)) {
        body = this.body.toString().replace(/\n/g, '\\n');
      } else if (this.body && this.body.readable) {
        body = `from FILE "${this.body.path}"`;
      } else {
        body = JSON.stringify(this.body);
      }
    } catch (err) {
      // log uncaught downstream errors
      log.error(err);
      throw err;
    }
    if (this.errors && this.errors.length) {
      log.warn(`Request validation errros: ${this.errors}`);
    }
    if (isSimple && body && body.length > MAX_INSPECT_BODY_LENGTH) {
      body = body.slice(0, MAX_INSPECT_BODY_LENGTH) + '...';
    }
    log.info(`${this.method} ${this.path} complete ${chalk.bold.white.bgMagenta(this.status)} at ${chalk.bold.cyan(moment().millisecond() - start.millisecond() + '')}ms with body ${body}`);
  };
};