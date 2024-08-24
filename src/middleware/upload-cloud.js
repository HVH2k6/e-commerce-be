const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const axios = require('axios');

let loading = 0;
const cloud = (req, res, next) => {
  let setLoading = 0;
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        let loadedBytes = 0;
        let totalBytes = req.file.buffer.length;

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);

      if (result.secure_url) {
        req.body[req.file.fieldname] = result.secure_url;
      }
      res.send({
        message: 'Upload successfully',
        url: result.secure_url,
      });
      // next();
    }

    upload(req);
  } else {
    next();
  }
};
const deleteImage = async (req, res) => {
  const { url } = req.body;
  const regex = /(?<=\/)[\w]+(?=\.\w+$)/;
  const imageName = url.match(regex)[0];
  if (imageName) {
    try {
      await cloudinary.api.delete_resources([imageName]);
      res.send({ message: 'Image deleted successfully' });
    } catch (error) {
      console.log(error);
    }
  }
};
const drive = async (req, res, next) => {
  if (req.file) {
    const file = req.file;
    const data = file.buffer.toString('base64');

    const postData = {
      name: file.originalname,
      type: file.mimetype,
      data: data,
    };

    try {
      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbyWQxW4obs2OJTMHWSH0kd61ss6QEMNyV9BZ04oMVyYiLOzz9QLv4tfb7j0Ohk60bS7Fw/exec',
        postData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.view) {
        res.json(response.data); // Trả về dữ liệu từ API Google Apps Script
      } else {
        throw new Error('No URL in response data');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  } else {
    res.status(400).send('No file uploaded');
  }
};
module.exports = { cloud, drive, deleteImage };
