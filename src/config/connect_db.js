
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    database: 'e-commerce' 
});


connection.connect((err) => {
    if (err) {
        console.error('Kết nối thất bại: ' + err.stack);
        return;
    }
    console.log('Kết nối thành công');
});


module.exports = connection;
