const homeRouter = require('./home.router');
const productRouter = require('./api/product.router');
const cloudRouter = require('./api/cloud.router');
module.exports = (app) => {
  app.use('/', homeRouter);

  app.use('/api/product', productRouter);

  app.use('/api/cloud', cloudRouter);
};
