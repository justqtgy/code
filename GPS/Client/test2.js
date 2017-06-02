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
    setInterval(function() {
        // send data
        //console.log('send data to server');
        client.write('*DFTD_ADD_OIL,11111111111,115.5L,15.5L,131.0L,A,094506,240116,2239.5530,N,11404.4116,E #');
    }, 100);
    // send data
    //console.log('send data to server');
    //client.write('greeting from client socket');

    rl.prompt();
});

client.on('data', function(data) {
    console.log(new Date(), data.toString());
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