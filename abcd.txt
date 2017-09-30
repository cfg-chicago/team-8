const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'DESKTOP 39MEQUB'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});