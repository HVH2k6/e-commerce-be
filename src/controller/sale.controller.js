const connection = require('../config/connect_db');

const getAll = async (req, res) => {
  try {
    const sql = 'SELECT * FROM `sale`';
    const [sales] = await connection.promise().query(sql);

    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const listIdProduct = JSON.parse(sale.list_product);

        const listProductSale = await Promise.all(
          listIdProduct.map(async (id) => {
            const productSql = 'SELECT * FROM `product` WHERE id = ?';
            const [productRows] = await connection
              .promise()
              .query(productSql, [id]);
            return productRows[0];
          })
        );

        return {
          id: sale.id,
          titleSale: sale.title,
          timeStart: sale.time_start,
          timeEnd: sale.time_end,
          listProductSale,
        };
      })
    );

    res.json(salesWithProducts);
  } catch (error) {
    console.error('Error fetching sales and products:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching sales and products' });
  }
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
const getDataUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM `sale` WHERE id = ?';
    const [saleRows] = await connection.promise().query(sql, [id]);

    if (saleRows.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const sale = saleRows[0];

    const listIdProduct = JSON.parse(sale.list_product);

    const listProductSale = await Promise.all(
      listIdProduct.map(async (productId) => {
        const productSql = 'SELECT * FROM `product` WHERE id = ?';
        const [productRows] = await connection
          .promise()
          .query(productSql, [productId]);
        return productRows[0];
      })
    );

    const response = {
      id: sale.id,
      title: sale.title,
      time_start: sale.time_start,
      time_end: sale.time_end,
      listProductSale,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching sale data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const update = async (req, res) => {
  const { id } = req.params;
  const { title, time_start, time_end, list_product } = req.body;
  const sql =
    'UPDATE `sale` SET `title` = ?, `time_start` = ?, `time_end` = ?, `list_product` = ? WHERE `id` = ?';
  const [result, fields] = await connection
    .promise()
    .query(sql, [title, time_start, time_end, JSON.stringify(list_product), id]);
  res.send({ message: 'Sale updated successfully' });
};

module.exports = { getAll, create, getDataUpdate ,update};
