const homeRouter = require('./home.router');
const productRouter = require('./api/product.router');
const categoryRouter = require('./api/category.router');
const cloudRouter = require('./api/cloud.router');
const authRouter = require('./api/auth.router');
const roleRouter = require('./api/role.router');
const permissionRouter = require('./api/permission.router');
const saleRouter = require('./api/sale.router');




module.exports = (app) => {
  app.use('/', homeRouter);

  app.use('/api/product', productRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/cloud', cloudRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/role', roleRouter);
  app.use('/api/permission', permissionRouter);
  app.use('/api/sale', saleRouter);
};
