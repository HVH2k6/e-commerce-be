const connection = require('../config/connect_db');

const getAll = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `role`';
    const [rows, fields] = await connection.promise().query(sql);
    res.json(rows);
  } catch (error) {
    console.log(error);
  }
};
const getDataUpdate = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM `role` WHERE id = ?';
  const [rows, fields] = await connection.promise().query(sql, [id]);
  if (rows.length === 0) {
    return res.status(404).send({ message: 'Role not found' });
  }
  res.json(rows[0]);
};
const create = async (req, res) => {
  try {
    const { name_role, description } = req.body;
    console.log('create ~ req.body:', req.body);
    const sql = 'INSERT INTO `role`(`name_role`, `description`) VALUES (?, ?)';
    await connection.promise().query(sql, [name_role, description]);
    res
      .status(201)
      .json({ status: 'success', message: 'Role created successfully' });
  } catch (error) {
    console.log(error);
  }
};
const getRoleById = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  try {
    const sql = 'SELECT * FROM `role` WHERE id = ?';
    const [rows, fields] = await connection.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: 'Role not found' });
    }

    await res.json(rows[0]);
  } catch (error) {
    console.log(error);
  }
};
const getPermissions = async (roleId) => {
  try {
    const sql = 'SELECT `permission` FROM `role` WHERE id = ?';
    const [rows] = await connection.promise().query(sql, [roleId]);
    if (rows.length > 0) {
      try {
        return JSON.parse(rows[0].permission) || []; // Parse JSON và đảm bảo trả về mảng rỗng nếu không có dữ liệu
      } catch (parseError) {
        console.error('Error parsing permission JSON:', parseError);
        return []; // Trả về mảng rỗng nếu có lỗi khi parse
      }
    }
    return []; // Trả về mảng rỗng nếu không tìm thấy role
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};

const updatePermission = async (req, res) => {
  const { id } = req.params; // ID của role
  const { permission } = req.body; // Mảng ID của permissions mới

  try {
    // Lấy danh sách permission hiện tại
    const currentPermissions = await getPermissions(id);

    // Đảm bảo currentPermissions là mảng
    if (!Array.isArray(currentPermissions)) {
      return res
        .status(500)
        .send({ message: 'Current permissions data is invalid' });
    }

    // Cập nhật lại field permission trong cơ sở dữ liệu
    const sql = 'UPDATE `role` SET `permission` = ? WHERE `id` = ?';
    const [result] = await connection
      .promise()
      .query(sql, [JSON.stringify(permission), id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Role not found' });
    }

    res.send({ message: 'Permissions updated successfully' });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).send({ message: 'Error updating permissions' });
  }
};

const checkRole = async (req, res) => {
  const { role_id } = req.user;
  // console.log('checkRole ~ role_id:', role_id);

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT * FROM role WHERE id = ?`, [role_id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Role not found' });
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send({ message: 'Database error', error });
  }
};
const checkPermission = async (req, res) => {
  const { role_id } = req.user;

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT * FROM role WHERE id = ?`, [role_id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Role not found' });
    }
    const permissions = JSON.parse(rows[0].permission);
    res.status(200).send(permissions);
  } catch (error) {
    res.status(500).send({ message: 'Database error', error });
  }
};

module.exports = {
  getAll,
  create,
  getRoleById,
  getDataUpdate,
  updatePermission,
  checkRole,
  checkPermission,
};
