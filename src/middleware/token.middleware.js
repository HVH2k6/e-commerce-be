const jwt = require('jsonwebtoken');
const { base64url } = require('../helper/base64str');
const crypto = require('crypto');
require('dotenv').config();

const accessToken = (payload) => {
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '10d',
  });
  return access_token;
};

const refreshToken = (payload) => {
  const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '365d',
  });
  return refresh_token;
};

const checkTokenClient = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    // console.log("checkTokenClient ~ token:", token)
    const [encodedHeader, encodedPayload, tokenSignature] = token.split('.');
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET);
    const signature = hmac.update(tokenData).digest('base64url');

    if (signature === tokenSignature) {
      try {
        const payload = JSON.parse(atob(encodedPayload));
        const dataUser = (jwt.verify(payload, process.env.JWT_SECRET));
        req.user = dataUser;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          res
            .status(401)
            .send({ message: 'Token expired, please login again' });
        } else {
          res
            .status(401)
            .send({ message: 'Invalid token, please login again' });
        }
      }
    } else {
      res
        .status(401)
        .send({ message: 'Invalid token signature, please login again' });
    }
  } else {
    res.status(401).send({ message: 'Please login again' });
  }
};

module.exports = { accessToken, checkTokenClient, refreshToken };
