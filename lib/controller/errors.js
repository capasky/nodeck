/**
 * Error throw on controller active phase while target controller not found
 * @class ControllerNotFoundError
 * @extends {Error}
 */
class ControllerNotFoundError extends Error {
    /**
     * Creates an instance of ControllerNotFoundError.
     * 
     * @param {String} controllerName   name of controller
     * @param {String} path path of controller
     */
    constructor(controllerName, path, e) {
        super(`Controller ${controllerName} not found in path ${path}, origin error is \n${e}`);
        this.controllerName = controllerName;
        this.path = path;
    }
}

/**
 * Error throw on action executing phase while target action not found in controller
 * @class ActionNotFoundError
 * @extends {Error}
 */
class ActionNotFoundError extends Error {
    /**
     * Creates an instance of ActionNotFoundError.
     * 
     * @param {String} controllerName   name of controller
     * @param {String} actionName       name of action to execute
     */
    constructor(controllerName, actionName) {
        super(`Action ${actionName} not found in controller ${controllerName}`);
        this.actionName = actionName;
        this.controllerName = controllerName;
    }
}


module.exports.ControllerNotFoundError = ControllerNotFoundError;
module.exports.ActionNotFoundError = ActionNotFoundError;
