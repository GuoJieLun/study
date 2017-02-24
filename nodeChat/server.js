var http  = require('http');


function start(app){
    http.createServer(app);
};

exports.start = start;