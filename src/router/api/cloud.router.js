const express = require('express');
const router = express.Router();
const controller = require('../../middleware/upload-cloud');
const multer = require('multer');
const fileUpload = multer();

router.post(
  '/cloudinary',
  fileUpload.single('file'),

  controller.cloud
);
router.delete('/cloudinary/delete', controller.deleteImage);
module.exports = router;
