const Promise = require('bluebird');

const { Controller } = require('../../../lib');

class BlogsController extends Controller {
  update() {
    //
    console.dir(this.request.params);
    console.dir(this.request.query);
    return this.json({
      code: 200,
      error: null,
      result: [{
        id: 1,
        name: 'netease'
      }]
    });
  }
}

module.exports = BlogsController;