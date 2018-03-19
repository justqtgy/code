/*
var fs = require('fs');
var _fileBuffer = fs.readFileSync('./update/GPS.hex');
var len = Buffer.byteLength(_fileBuffer);

function update_clients(list) {
    var clients = list[1].split(';');
    if (clients.length === 1 && clients[0] == 'all') {
        clients.length = 0;
        for (var s in socketList) {
            clients.push(s);
        }
    }
    console.log(clients);
    clients.forEach(function(client) {
        var sockets = socketList[client];
        for (var i in sockets) {
            sockets[i].write('!start\r\n');
            var sender = send_update_file(len);
            while (true) {
                var _text = sender();
                //console.log(_text)
                if (!_text) {
                    sockets[i].write('ok!\r\n');
                    break;
                }
                //sock.write(_text);
                sockets[i].write(_text);
            }
        }
    }, this);
}

function send_update_file(value) {
    var i = 0;
    return function() {
        if (i > value) return "";
        var str = _fileBuffer.toString('binary', i, i + 1000);
        i = i + 1000;
        return str;
    };
}
*/