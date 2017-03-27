var serverPort = 6666;
var server = '120.24.68.95';

var net = require('net');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('connecting to server...');
var client = net.connect({ server: server, port: serverPort }, function() {
    console.log('client connected');

    // send data
    //console.log('send data to server');
    //client.write('greeting from client socket');

    rl.prompt();
});

client.on('data', function(data) {
    console.log(data.toString());
    //client.end();
});

client.on('error', function(err) {
    console.log(err);
});
/*client.on('end', function() {
  console.log('client disconnected');
});
*/
rl.on('line', function(line) {
    client.write(line.trim());
    rl.prompt();
});