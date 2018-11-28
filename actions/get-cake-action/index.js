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
      //查询数据
      console.log('Querying cake');
      var queryText = 'SELECT * FROM cakes WHERE id=?';
      var result = connection.query(queryText, [params.id]);
      connection.end();
      return result;
    }).then(function(result) {
      //返回结果
      console.log(result);
      if(result[0]){
        resolve({
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: result[0]
          }
        });
      }else{
        reject({
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 404,
          body: {
            error: "Not found."
          }
        });
      }
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
