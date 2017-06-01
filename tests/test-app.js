// process.env.DEBUG = '*';

const Nodeck = require('../lib');

const port = 4567;

const app = new Nodeck();

app.start(port).then(() => {
  console.log(`Server start and listen at ${port}`);
});