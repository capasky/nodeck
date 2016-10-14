
process.env.DEBUG = '*';

const Ndeck = require('../');

const port = 4567;

const app = new Ndeck();

app.start(port).then(() => {
    console.log(`Server start and listen at ${port}`);
});
