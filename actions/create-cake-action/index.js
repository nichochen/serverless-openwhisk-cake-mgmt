//定义函数
function myAction(params) {

  return new Promise(function(resolve, reject) {
    //连接MySQL
    console.log('Connecting to MySQL database');
    var mysql = require('promise-mysql');
    var connection;
    mysql.createConnection({
      host: params.MYSQL_HOSTNAME,
      user: params.MYSQL_USERNAME,
      password: params.MYSQL_PASSWORD,
      database: params.MYSQL_DATABASE
    }).then(function(conn) {
      //创建数据库
      connection = conn;
      console.log('Creating table if not exist');
      return connection.query('CREATE TABLE IF NOT EXISTS `cakes` (`id` INT AUTO_INCREMENT PRIMARY KEY, `name` VARCHAR(256) NOT NULL, `description` VARCHAR(256) NOT NULL)');
    }).then(function() {
      //插入数据
      console.log('Inserting data');
      var queryText = 'INSERT INTO cakes (name, description) VALUES(?, ?)';
      var insert = connection.query(queryText, [params.name, params.description]);
      connection.end();
      return insert;
    }).then(function(insert) {
      //返回结果
      resolve({
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          id: insert.insertId
        }
      });
    }).catch(function(error) {
      //异常处理
      if (connection && connection.end) connection.end();
      console.log(error);
      reject({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 500,
        body: {
          error: error
        }
      });
    });
  });
}
//定义入口函数
exports.main= myAction;
