const { ConsoleMessage } = require("puppeteer");

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
module.exports = scraperObject;