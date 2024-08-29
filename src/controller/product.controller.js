const connection = require('../config/connect_db');
const cloudinary = require('../config/cloudinary');
const getAll = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `product`';

    const [rows, fields] = await connection.promise().query(sql);

    res.json(rows);
  } catch (err) {}
};
const create = async (req, res) => {
  try {
    const { name, price, sale, description, category, image } = req.body;
    
    // Lấy tên của category từ bảng category
    const getNameCategorySql = 'SELECT name_category FROM category WHERE id = ?';
    const [categoryResult] = await connection.promise().query(getNameCategorySql, [category]);

    if (categoryResult.length === 0) {
      return res.status(404).send({ error: 'Category not found' });
    }

    const categoryName = categoryResult[0].name_category;

    const sql =
      'INSERT INTO `product`(`name`, `price`, `sale`, `description`, `category`, `image`) VALUES (?, ?, ?, ?, ?, ?)';

    await connection.promise().query(sql, [name, price, sale, description, categoryName, image]);

    res.status(201).send({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const getImageSql = 'SELECT image FROM product WHERE id = ?';
  const [rows, fields] = await connection.promise().query(getImageSql, [id]);

  if (rows.length === 0) {
    return res.status(404).send({ message: 'Product not found' });
  }

  const image = rows[0].image;
  const regex = /(?<=\/)[\w]+(?=\.\w+$)/;
  const imageName = image.match(regex)[0];
  if (imageName) {
    try {
      await cloudinary.api.delete_resources([imageName]);
    } catch (error) {}
  }

  const sql = 'DELETE FROM product WHERE id = ?';
  const [result, field] = await connection.promise().query(sql, [id]);
  res.send({ message: 'Product deleted successfully' });
};
const getDataUpdate = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM `product` WHERE id = ?';
  const [rows, fields] = await connection.promise().query(sql, [id]);
  if (rows.length === 0) {
    return res.status(404).send({ message: 'Product not found' });
  }

  return res.json(rows[0]);
};
const update = async (req, res) => {
  const { id } = req.params;
  const { name, price, sale, description, image } = req.body;
  const sql =
    'UPDATE `product` SET `name` = ?, `price` = ?, `sale` = ?,`description` = ?, `image` = ? WHERE `id` = ?';
  const [result, fields] = await connection
    .promise()
    .query(sql, [name, price, sale, description, image, id]);
  res.send({ message: 'Product updated successfully' });
};
module.exports = { getAll, create, deleteProduct, update, getDataUpdate };
