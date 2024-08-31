const connection = require('../config/connect_db');
const validateRegister = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).send({
      message: 'Vui lòng điền đầy đủ thông tin',
    });
  }
  if (password.length < 6) {
    return res.status(400).send({
      message: 'Mật khẩu phải nhiều hơn 6 kí tự',
    });
  }
  const exitEmail = `SELECT * FROM auth WHERE email = '${email}'`;

  const [result] = await connection.promise().query(exitEmail);
  const data = result[0];
  const emailCheck = data.email;
  if (emailCheck===email) {
    return res.status(400).send({
      message: 'Email đã tồn tại',
    });
  }

  next();
};
const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: 'Vui lòng điền đầy đủ thông tin',
    });
  }

  next();
}
module.exports = { validateRegister ,validateLogin};
