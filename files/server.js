var http = require('http');
var fs = require('fs');
const puppeteer = require('puppeteer');
let json = require('./result.json');

let data = Object.values(json);

let dates = [];
let prices = [];


for( let i=0;i<data.length;i++){
  dates.push(data[i].date);
  prices.push(data[i].price);
}

let brows = async function(){


let browser = await startBrowser();

let page = await browser.newPage();
console.log(`Navigating to graphic.html...`);
await page.goto('file:///C:/Users/user107/dveriparser/graphic.html');
await page.waitForSelector('h1.header', {timeout: 0});

await page.evaluate( (dates, prices) => {
  let h = document.querySelector(".header");
    h.innerHTML = "Header";
  });

await page.waitForSelector('canvas.canvas', {timeout: 0});

      await page.evaluate( ({dates, prices}) => {

          let can = document.querySelector(".canvas");
          let ctx = can.getContext('2d');
          ctx.innerHTML = 'nuoinoiunoino';
          console.log(dates);
          console.log(prices);
          let chart = new Chart(ctx, {
              type: 'line',
                  data: {
                  labels: dates,
                  datasets: [{
                      label: 'График',
                      data: prices,
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                      }]
                  }
          });

        }, {dates, prices});

}

brows();

async function startBrowser(){
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true,
            devtools: true,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}
