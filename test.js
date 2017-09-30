const mysql = require('mysql');
const connect= mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected');
});