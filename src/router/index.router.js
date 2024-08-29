const homeRouter = require('./home.router');
const productRouter = require('./api/product.router');
const categoryRouter = require('./api/category.router');
const cloudRouter = require('./api/cloud.router');
const authRouter = require('./api/auth.router');

module.exports = (app) => {
  app.use('/', homeRouter);

  app.use('/api/product', productRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/cloud', cloudRouter);
  app.use('/api/auth', authRouter);
};
