const express = require('express')
const exp = express();


module.exports.instance = exp;
module.exports.prepareServer = function(configure, port, dirs, callback) {
	const config = configure(exp, dirs)
	const serverListenOn = _load(config);
	return function() {
		serverListenOn(port, callback);
	}
}

const _load = function(expressInstance) {
    const server = expressInstance;
    return function(port, callback){
        server.listen(port, callback);
        return server;
    }
}
