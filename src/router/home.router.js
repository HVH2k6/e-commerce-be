const express = require('express');
const router = express.Router();

const homeController = require('../controller/home.controller');
const checkRole = require('../middleware/check-role');
const checkToken = require('../middleware/token.middleware');
router.get('/', homeController.index);
router.get('/test',checkToken.checkTokenClient, checkRole.checkRole);
// router.get('/test-search', homeController.testSearch);
module.exports = router