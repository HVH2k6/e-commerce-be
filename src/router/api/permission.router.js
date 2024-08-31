const express = require('express');
const router = express.Router();
const controller = require('../../controller/permission.controller');
router.get('/', controller.getAll);
router.post('/create', controller.create);

module.exports = router;
