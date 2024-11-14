const connection = require('../config/connect_db');
const cloudinary = require('../config/cloudinary');
const { tree } = require('../helper/createTree');
const getAllCategories = async (req, res) => {
  try {
    const [categories] = await connection
      .promise()
      .query('SELECT * FROM `category`');

    // Sử dụng hàm `tree` để tạo cấu trúc cây
    const categoryTree = tree(categories);

    // Trả về cấu trúc cây danh mục
    res.status(200).send(categoryTree);
  } catch (err) {
    console.error(err); // Log lỗi để debug
    res.status(500).send({ error: 'Something went wrong' });
  }
};
const create = async (req, res) => {
  try {
    const { name_category, image, parent_id } = req.body;
    const sql =
      'INSERT INTO `category`(`name_category`,`image`,`parent_id`) VALUES (?, ?, ?)';

    await connection.promise().query(sql, [name_category, image, parent_id]);

    const [categories] = await connection
      .promise()
      .query('SELECT * FROM `category`');

    const categoryTree = tree(categories);
    res.send('Category created successfully', { categoryTree });

    res.status(201).send({ message: 'Category created successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
};
const GetDataUpdate = async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT c.*, p.name_category AS parent_name
    FROM category c
    LEFT JOIN category p ON c.parent_id = p.id
    WHERE c.id = ?
  `;

  try {
    const [rows] = await connection.promise().query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name_category, parent_id, image } = req.body;

  try {
    // Truy vấn lấy thông tin danh mục cha
    let parentCategoryName = null;
    if (parent_id) {
      const getParentCategorySql =
        'SELECT name_category FROM category WHERE id = ?';
      const [parentResult] = await connection
        .promise()
        .query(getParentCategorySql, [parent_id]);

      if (parentResult.length === 0) {
        return res.status(404).send({ error: 'Parent category not found' });
      }

      parentCategoryName = parentResult[0].name_category;
    }

    // Cập nhật danh mục hiện tại
    const sql =
      'UPDATE `category` SET `name_category` = ?, `parent_id` = ?, `image` = ? WHERE `id` = ?';
    const [result] = await connection
      .promise()
      .query(sql, [name_category, parent_id, image, id]);

    res.send({
      message: 'Category updated successfully',
      parentCategory: parentCategoryName,
    });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const getImageSql = 'SELECT image FROM category WHERE id = ?';
  const [rows, fields] = await connection.promise().query(getImageSql, [id]);

  if (rows.length === 0) {
    return res.status(404).send({ message: 'Category not found' });
  }

  const image = rows[0].image;
  if (image) {
    const regex = /(?<=\/)[\w]+(?=\.\w+$)/;
    const imageName = image.match(regex)[0];
    if (imageName) {
      try {
        await cloudinary.api.delete_resources([imageName]);
      } catch (error) {}
    }
  }

  const sql = 'DELETE FROM category WHERE id = ?';
  const [result, field] = await connection.promise().query(sql, [id]);
  res.send({ message: 'category deleted successfully' });
};
const gettParrentCategory = async (req, res) => {
  // get all categories where parent_id = ""
  const sql = 'SELECT * FROM category WHERE parent_id = ""';
  try {
    const [rows] = await connection.promise().query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong' });
  }
};

module.exports = {
  getAllCategories,
  create,
  GetDataUpdate,
  updateCategory,
  deleteCategory,
  gettParrentCategory,
};
