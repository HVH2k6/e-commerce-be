const express = require('express');
const router = express.Router();
const controller = require('../../controller/category.controller');
router.get('/', controller.gettParrentCategory);
router.get('/getAll', controller.getAllCategories);
router.post('/create', controller.create);

router.get('/update/:id', controller.GetDataUpdate);

router.patch('/update/:id', controller.updateCategory);

router.delete('/delete/:id', controller.deleteCategory);

module.exports = router;
