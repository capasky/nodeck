

const pathToRegexp = require('path-to-regexp');

const debug = require('debug')('wee:route');
const rRoute = /^(get|put|post|patch|delete)[\s\t]+(.+)[\s\t]+=>[\s\t]+([a-z][\w\.\-]*)#([a-z][\w\.\-]*)$/i;

class RouteParseError extends Error {
    constructor(route) {
        super(`Route rule ${JSON.stringify({ area: route.area, rule: route.rule})} parse failed`);
    }
}


/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text
 * @returns {String} URL decode original string.
 * @private
 */

function safeDecodeURIComponent(text) {
    try {
        return decodeURIComponent(text);
    } catch (e) {
        return text;
    }
}

/**
 * A route object represent one router rule  
 *  
 * @class Route
 */
class Route {
    constructor(rule, area) {
        this.rule = rule;
        this.area = area;
        let result = this.parse();
        if (!result) {
        }
        Object.assign(this, result);
        this.parsePath();
    }
    parse() {
        let matches = rRoute.exec(this.rule);
        if (matches && matches.length === 5) {
            Object.assign(this, {
                method: matches[1].toUpperCase(),
                path: matches[2],
                controllerName: matches[3],
                actionName: matches[4]
            });
            this._path = (`/${this.area}/${this.path}`).replace(/\/+/g, '\/');
        } else {
            throw new RouteParseError(this);
        }
    }
    parsePath() {
        let keys = [];
        this.re = pathToRegexp(this._path, keys);
        this.paramNames = keys;
        debug(`Mapping ${this._path} ==> ${this.re}`);
    }
    match(method, url) {
        if (!method || !url) {
            return false;
        }
        debug(`Testing url ${url} using ${this.re}`);
        let matches = url.match(this.re);
        let matched = method.toUpperCase() === this.method && matches;
        if (!matched) {
            return false;
        }
        let captures = matches.slice(1);
        let params = {};
        let index = 1;
        for (let len = captures.length, i=0; i<len; i++) {
            if (this.paramNames[i]) {
                var c = captures[i];
                params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
            }
        }
        return params;        
    }
}

module.exports = Route;
