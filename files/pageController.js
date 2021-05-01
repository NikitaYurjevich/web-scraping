const pageScraper = require('./pageScraper');
const fs = require('fs');

let result = new Array(7);

async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        let res = await pageScraper.scraper(browser);

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
        await page.goto('file:///C:/Users/YesCoding/nikikikikiki/dveriparser/graphic.html');
    }
    catch(err){
        console.log("Unfortunetly, " +err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
//module.exports = function getData(){
   // return result;
//}