const express = require('express')
const exp = express();

const start = function(expressInstance) {
    const server = expressInstance;
    return function(port, callback){
        server.listen(port, callback);
        return server;
    }
} 

module.exports.server = function(config) {
    const server = config(exp) || exp;
    return start(server);
}

module.exports.instance = exp;

