const mysql = require('mysql');


module.exports = function(config) {
    const database = mysql.createPool(config);
    return async function _execute(sql) {
        const connection = new Promise(function(resolve, reject) {
            database.query(sql, function(err, result) {
                if (err) reject(err);
                resolve(result);
            })
        });
        return connection;
    }
}








