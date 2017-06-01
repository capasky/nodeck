const Promise = require('bluebird');

const Controller = require('../../../../lib/controller/controller');

class HomeController extends Controller {
  index() {
    return this.json({
      code: 403,
      error: 'unauthorized'
    });
  }
}

module.exports = HomeController;