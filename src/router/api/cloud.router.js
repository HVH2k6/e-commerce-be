const express = require('express');
const router = express.Router();
const controller = require('../../middleware/upload-cloud');

router.post('/cloudinary', controller.cloud);
router.post('/cloudinary/delete', controller.deleteImage);
module.exports = router