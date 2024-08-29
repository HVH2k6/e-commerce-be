const connection = require('../config/connect_db');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const register = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO `auth`(`fullname`, `email`, `password`) VALUES (?, ?, ?)';
        await connection.promise().query(sql, [fullname, email, hashPassword]);

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

module.exports = { register }