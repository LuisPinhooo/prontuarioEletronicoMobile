const mysql = require('mysql2');
const dbPool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'prontuario',
}).promise();

module.exports = dbPool;