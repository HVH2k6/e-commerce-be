const express = require('express');
const router = express.Router();
const controller = require('../../controller/role.controller');
router.get('/getAll', controller.getAll);
router.post('/create', controller.create);
router.get('/get-data-role-check/:id', controller.getRoleById);
router.get('/get-data-update/:id', controller.getDataUpdate);
router.post("/update-permission/:id",controller.updatePermission)
module.exports = router;
