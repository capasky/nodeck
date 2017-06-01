const path = require('path');
const ControllerFactory = require('./controllerFactory');

module.exports = options => {

  const controllerRootPath = path.resolve(options.cwd, options.controller);
  const controllerFactory = new ControllerFactory(controllerRootPath);

  return function NodeckController(ctx, next) {
    const controller = controllerFactory.getController(ctx);
    if (!controller) {
      return next();
    }
    return controller.execute()
      .then(next);
  }
};
