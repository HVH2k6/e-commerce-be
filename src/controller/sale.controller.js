const connection = require('../config/connect_db');
const getAll = async (req, res) => {
  const sql = 'SELECT * FROM `sale`';
  const [rows, fields] = await connection.promise().query(sql);
  const listIdProduct = JSON.parse(rows[0].list_product);
  const listProductSale = await Promise.all(
    listIdProduct.map(async (id) => {
      const sql = 'SELECT * FROM `product` WHERE id = ?';
      const [rows, fields] = await connection.promise().query(sql, [id]);
      return rows[0];
    })
  );
  const id = rows[0].id;
  const titleSale = rows[0].title;
  const timeStart = rows[0].time_start;
  const timeEnd = rows[0].time_end;
  res.json([{ id, titleSale, timeStart, timeEnd, listProductSale }]);
};
const create = async (req, res) => {
  const { title, time_start, time_end, list_product } = req.body;

  const sql =
    'INSERT INTO `sale`(`title`,`time_start`,`time_end`,`list_product`) VALUES (?, ?, ?, ?)';
  await connection
    .promise()
    .query(sql, [title, time_start, time_end, JSON.stringify(list_product)]);
  res
    .status(200)
    .json({ status: 'success', message: 'Sale created successfully' });
};

module.exports = { getAll, create };
