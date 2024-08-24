const express = require('express');
const router = express.Router();
const controller = require('../../controller/product.controller');

router.get('/', controller.getAll);
router.post('/create', controller.create);
router.patch('/delete/:id', controller.deleteProduct);
router.patch('/update/:id', controller.update);
router.get('/update/:id', controller.getDataUpdate);
module.exports = router