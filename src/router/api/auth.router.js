const express = require('express');
const router = express.Router();
const controller = require('../../controller/auth.controller');
const {
  validateRegister,
  validateLogin,
} = require('../../validate/auth.validate');
const checkToken = require('../../middleware/token.middleware');

router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/get-user', checkToken.checkTokenClient, controller.getUser);
router.get('/get-all-user', controller.getAllUser);

router.get('/get-data-update/:id', controller.getUserUpdate);
router.post("/update/:id",controller.updateUser)
module.exports = router;
