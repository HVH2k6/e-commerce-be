const connection = require('../config/connect_db');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const jwtToken = require('../middleware/token.middleware');
const { base64url } = require('../helper/base64str');
const crypto = require('crypto');

const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    // find name_role from role table and insert into auth table
    const sqlNameRole = 'SELECT name_role FROM role WHERE id = 3';
    const [result] = await connection.promise().query(sqlNameRole);
    const name_role = result[0].name_role;
    const sql =
      'INSERT INTO `auth`(`fullname`, `email`, `password`, `role_id`, `name_role`) VALUES (?, ?, ?, ?, ?)';
    await connection
      .promise()
      .query(sql, [fullname, email, hashPassword, 3, name_role]);

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM `auth` WHERE email = ?';
    const [result] = await connection.promise().query(sql, [email]);
    if (result.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    const userData = {
      id: user.id,
      email: user.email,
      fullname: user.fullname || '',
      avatar: user.avatar,
      role_id: user.role_id,
      name_role: user.name_role,
    };
    const headerToken = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const payloadToken = await jwtToken.accessToken(userData);

    const encodedHeader = base64url(JSON.stringify(headerToken));
    const encodedPayload = base64url(JSON.stringify(payloadToken));

    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET);
    const signature = hmac.update(tokenData).digest('base64url');

    const token = `${tokenData}.${signature}`;

    res.json({
      token,
      message: 'Success',
      data: userData,
    });
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
const getUser = async (req, res) => {
  res.json(req.user);
};
const getAllUser = async (req, res) => {
  const sql = 'SELECT * FROM `auth`';
  const [rows, fields] = await connection.promise().query(sql);
  res.json(rows);
};
const getUserUpdate = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM `auth` WHERE id = ?';
  const [rows, fields] = await connection.promise().query(sql, [id]);
  if (rows.length === 0) {
    return res.status(404).send({ message: 'User not found' });
  }
  res.json(rows[0]);
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role_id, active } = req.body;
  const queryNameRole = `SELECT name_role FROM role WHERE id = ${role_id}`;
  const dataRole = await connection.promise().query(queryNameRole);
  const name_role = dataRole[0][0].name_role;

  const sql =
    'UPDATE `auth` SET role_id = ?, active = ?, name_role = ? WHERE id = ?';
  await connection.promise().query(sql, [role_id, active, name_role, id]);
  res.json({ message: 'User updated successfully' });
};

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  getUserUpdate,
  updateUser,
};
