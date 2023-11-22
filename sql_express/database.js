const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    database: 'docker_express_sql_database_test',
    password: 'desdt123'
});

module.exports = pool.promise();
