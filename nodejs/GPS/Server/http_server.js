var http = require('http');
var HOST = '127.0.0.1';
var PORT = 7777;


// 注：配置里的日志目录要先创建，才能加载配置，不然会出异常
try {
    log4js.configure('config/log4js.json', { reloadSecs: 300 });
    global.logger = log4js.getLogger('dateFileLog');

    //定义一个全局的客户端列表对象
    global.socketList = {};
} catch (err) {
    console.log(err);
}

var http_server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome\n');
}).listen(PORT, HOST);


var io = require('socket.io').listen(http_server);
io.sockets.on('connection', function(socket) {
    socket.on("data", function(data) {
        //socket.send('OK');
        socket.emit('message', { result: 'ok' });
        console.log('http server receive:', data);
        //console.log(data.content);
        // var client = net.connect({ server: HOST, port: PORT }, function() {
        //     client.write('socket.io' + data.content)
        // });
    });
});
logger.info('HTTP Server listening on ' + HOST + ':' + PORT);