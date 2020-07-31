var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lindsada',
  password        : '2344',
  database        : 'cs340_lindsada'
});
module.exports.pool = pool;
