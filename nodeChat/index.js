var path = require('path');
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var app = express();

//设置模板目录
app.set('views', path.join(__dirname, 'views'));

//设置模板引擎
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//创建服务
var server = http.createServer(app);
var io = socket.listen(server);

//监听
app.get('/', function (req, res) {
    res.render('chat');
});

var users = [];

//启动监听
server.listen(8888);


io.on('connection', function (sockets) {
    sockets.on('login', function (nickname) {
        if (users.indexOf(nickname) > -1) {
            sockets.emit('nickExisted');
        } else {
            sockets.userIndex = users.length;
            sockets.nickname = nickname;
            users.push(nickname);
            sockets.emit('loginSuccess');
            io.sockets.emit('system',nickname,users.length,'login');
        }
    });

    sockets.on('disconnect',function(){
        users.splice(sockets.userIndex,1);
        sockets.broadcast.emit('system',sockets.nickname,users.length,'logout');
    });

    sockets.on('postMsg',function(msg){
        sockets.broadcast.emit('newMsg',sockets.nickname,msg);
    });
});

