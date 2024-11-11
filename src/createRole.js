const mysql = require('mysql2');

// Thiết lập kết nối
const connection = mysql.createConnection({
  host: 'localhost', // Thay đổi nếu bạn có host khác
  user: 'root',      // Username MySQL của bạn
  password: '',      // Mật khẩu MySQL của bạn
  database: 'e-commerce' // Tên database bạn muốn kết nối
});

// Kết nối đến MySQL
connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối:', err);
    return;
  }
  console.log('Kết nối thành công!');

  // Câu lệnh SQL để tạo bảng
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS role (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_role VARCHAR(100) NOT NULL,
      description VARCHAR(100) NOT NULL,      
      permission JSON DEFAULT NULL
    )
  `;

  // Thực thi câu lệnh tạo bảng
  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Lỗi khi tạo bảng:', err);
      connection.end();
      return;
    }
    console.log('Tạo bảng thành công:', results);

    // Câu lệnh chèn dữ liệu ví dụ
    const insertDataQuery = `
      INSERT INTO role (name_role, description) VALUES 
      ('admin', 'Administrator'),
      ('manager', 'Manager'),
      ('user', 'User')
    `;

    // Thực thi câu lệnh chèn dữ liệu
    connection.query(insertDataQuery, (err, results) => {
      if (err) {
        console.error('Lỗi khi chèn dữ liệu:', err);
      } else {
        console.log('Chèn dữ liệu thành công:', results);
      }

      // Đóng kết nối
      connection.end();
    });
  });
});
