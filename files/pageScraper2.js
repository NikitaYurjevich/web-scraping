const puppeteer = require('puppeteer');
const fs = require('fs');

result = new Array(7);

async function main() {
    let browser;
    try{
        browser = await startBrowser();
        let res = await scraperObject.scraper(browser);

        //await browser.close();

        fs.writeFile("data.json", res, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Success");
        });
        let Prices = JSON.parse(res);
                //PART TWO
        let dataPrices = Prices[0].data;

        let sum = dataPrices.reduce( (sum, price) =>  sum + parseInt(price.product_price.replace(' ', '').slice(0, 5)), 0 );

        let middlePrice = Math.round(sum/dataPrices.length);


        console.log(sum);
        console.log(middlePrice);

        for( let i=0; i<result.length; i++){
            let obj = {
                date: "0"+(i+1)+".05.2021",
                price: Math.round(Math.random()*middlePrice*2)
            }
            result[i] = obj;
        }
        result[result.length-1].price = middlePrice;

        //console.log(result);
        fs.writeFile("result.json", JSON.stringify(result, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Success");
        });
        let page = await browser.newPage();
        await page.goto('https://www.chartjs.org/docs/latest/samples/line/line.html');

        await page.waitForSelector('div.prism-editor_textarea', {timeout: 0});
    }
    catch(err){
        console.log("Unfortunetly, " +err);
    }
}



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



const scraperObject = {
    url: 'https://www.vashidveri72.ru/catalog/dveri_vkhodnye/',
    async scraper(browser){

        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        await page.waitForSelector('div.catalog-section-list-item-information', {timeout: 0});

        let subCategories = await page.$$eval('div.catalog-section-list-item-information', links =>
            links.map(link => {
                let catObj = {
                    name: link.querySelector('span.catalog-section-list-item-title-text').innerText,
                    url: link.querySelector('div.catalog-section-list-item-information a').href
                }

                return catObj;
            }
            ));
        console.log(subCategories);

        let result = [];
        for( let subCategory of subCategories){
            try{
                await page.goto(subCategory.url);
                console.log("Opening page: "+subCategory.url);
            }catch(error){
                console.log(error);
            }

            //await page.waitForSelector('div.catalog-section-item-base', {timeout: 0});

            let html = await page.evaluate(async () => {

                let doorsInfo = [];
                try {

                    let items = document.querySelectorAll('div.catalog-section-item-base');

                    items.forEach( item => {
                        let doorInfo = {
                            product_name: item.querySelector('.catalog-section-item-name').innerText,
                            product_price: item.querySelector('.catalog-section-item-price').innerText,
                            image: item.querySelector('img').src
                        }
                        doorsInfo.push(doorInfo);
                        //console.log(doorInfo);
                    });

                } catch (error) {
                    console.log(e);
                }
                //console.log(doorsInfo);
                return doorsInfo;
            }, { waitUntil: 'div.catalog-section-item-base' });

            let category = {
                category_name: subCategory.name,
                category_url: subCategory.url,
            }
            category.data = html.splice(html);

            result.push(category);
        }
        return JSON.stringify(result, null, 4);
        //console.log(result);
    }
}

main();
