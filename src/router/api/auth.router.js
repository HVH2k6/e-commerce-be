const express = require('express');
const router = express.Router();
const controller = require('../../controller/auth.controller');
const {validateRegister} = require('../../validate/auth.validate');

router.post('/register',validateRegister ,controller.register);


module.exports = router;
