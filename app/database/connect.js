const mysql = require('mysql');
const internalQueries = require('./internal-queries');
const externalQueries = require('./external-queries');


module.exports = function(config) {
    const database = mysql.createPool(config);
    const execute = function(sql) {
        return new Promise(function(resolve, reject) {
            database.query(sql, function(err, result) {
                if (err) reject(err);
                resolve(result);
            })
        });
    }
    return {
        internalApi: internalQueries(execute),
        externalApi: externalQueries(execute)
    };
}








