const fs = require('fs');
const puppeteer = require('puppeteer');

let url = 'https://www.vashidveri72.ru/catalog/dveri_vkhodnye/';
let data;

async function getJSONfile() {
  try{
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 100,
        devtools: true
    });
    let page;
    page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' });

    const searchCateg = await page.evaluate( () => {

      // Поиск подкатегорий
      let subCategories = document.querySelectorAll(".catalog-section-list-item-image");
      let doorsInfo = [];

      subCategories.forEach(async subCategory =>{

        try{
          //Не видит page
        await page.goto(subCategory.href, { waitUntil: 'networkidle2' });
      }catch(err){
          console.log(err);
        }

      let items = document.querySelectorAll('.catalog-section-item-base');
      items.forEach(async item => {
      try{

        let doorObj = {
          product_name: item.querySelector('.catalog-section-item-name').innerText,
          product_price: item.querySelector('.catalog-section-item-price').innerText,
          image: item.querySelector('img').src
        };
      doorsInfo.push(doorObj);

    }catch(err){
    console.log(err);
    }

  });
  data = JSON.stringify(doorsInfo);
  console.log(data);

  fs.writeFile("vashidveri.json", data, function(err) {
    if (err) throw err;
  })
      });
  });

}catch(e){
  console.log(e);
}
}

getJSONfile();
