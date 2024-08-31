const connection = require('../config/connect_db');
const getAll = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `permissions`';
    const [permissions, fields] = await connection.promise().query(sql);
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const { module } = permission;
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {});

    res.json(groupedPermissions);
  } catch (error) {}
};
const create = async (req, res) => {
  try {
    const { name, method, apiPath, module } = req.body;
    const sql =
      'INSERT INTO `permissions`(`name`, `method`, `apiPath`, `module`) VALUES (?, ?, ?, ?)';
    await connection.promise().query(sql, [name, method, apiPath, module]);
    res.status(201).send('Permission created successfully');
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, create };
