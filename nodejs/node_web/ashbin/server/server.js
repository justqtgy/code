
var net = require('net');
var log4js = require('log4js');
var protocol = require('./protocol');

var HOST = '127.0.0.1',
    PORT = 9000;

// 注：配置里的日志目录要先创建，才能加载配置，不然会出异常
try {
    log4js.configure('config/log4js.json', { reloadSecs: 300 });
    global.logger = log4js.getLogger('dateFileLog');

    //定义一个全局的客户端列表对象
    global.socketList = {};

} catch (err) {
    console.log(err);
}


// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(socket) {
    // 我们获得一个连接 - 该连接自动关联一个socketet对象
    var ipAddress = socket.remoteAddress + ':' + socket.remotePort;
    console.log('CONNECTED: ' + ipAddress);

    // ipAddress = ipAddress.replace('::ffff:', '');

    // if (!socketList[ipAddress]) {
    //     socketList[ipAddress]=socket;
    // }

    // 为这个socketet实例添加一个"data"事件处理函数
    socket.on('data', function(data) {
        // 回发该数据，客户端将收到来自服务端的数据
        if (data[0] == 126 && data[data.length - 1] == 126) {
            data = data.toString('hex');
        }
        logger.info('[' + socket.remoteAddress + '] Date = ' + data);
        //logger.info(socketList);
        //处理命令
        protocol.parse(socket, data);
    });

    // 为这个socketet实例添加一个"close"事件处理函数
    socket.on('close', function(data) {
        // socketList[ipAddress].splice(socketList[ipAddress].indexOf(socket), 1);
        logger.error('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort + ' ' + data);
    });

    socket.on('error', function(data) {
        //console.log('CLOSED: ' +
        //    socket.remoteAddress + ' ' + socket.remotePort);
        logger.error('Error:' + data);
    });

}).listen(PORT);


logger.info('Net Server listening on ' + HOST + ':' + PORT);