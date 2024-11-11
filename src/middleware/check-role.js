const connection = require("../config/connect_db");

const checkRole = async (req, res, next) => {
    const { role_id } = req.user;
    // check role from table role
    const checkRole = await connection.promise().query(`SELECT * FROM role WHERE id = ${role_id}`);
    if (checkRole[0].length === 0) {
        return res.status(404).send({ message: 'Role not found' });
    }
    res.status(200).send(checkRole[0]);
};

module.exports = { checkRole };