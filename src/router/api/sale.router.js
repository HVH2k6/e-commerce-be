const express = require('express');
const router = express.Router();
const controller = require('../../controller/sale.controller');
router.get('/', controller.getAll);
router.post('/create', controller.create);
router.get('/get-data-update/:id', controller.getDataUpdate);
router.post("/update/:id",controller.update)
module.exports = router;
