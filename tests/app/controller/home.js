const Promise = require('bluebird');

const {
  Controller
} = require('../../../lib');

class HomeController extends Controller {
  index() {
    console.dir(this.request.params); // url parameters
    console.dir(this.request.query); // query strings
    let cookie = this.cookies.get('aaa'); // get cookies
    return this.json({
      code: 200,
      error: null,
      result: [{
        id: 1,
        name: 'netease',
        cookie
      }]
    });
  }
  main() {
    console.dir(this.request.params); // url parameters
    console.dir(this.request.query); // query strings
    let cookie = this.cookies.get('aaa'); // get cookies
    return this.view('index.html', {
      code: 200,
      error: null,
      result: [{
        id: 1,
        name: 'netease',
        cookie
      }]
    });
  }
}

module.exports = HomeController;