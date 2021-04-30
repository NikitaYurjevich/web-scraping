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

      subCategories.forEach(async subCategory =>{

        try{
          //Не видит page
        await page.goto(subCategory, { waitUntil: 'networkidle2' });
      }catch(err){
          console.log(err);
        }

      let items = document.querySelectorAll('.catalog-section-item-base');
      items.forEach(async item => {
      console.log(item);
      try{
      let doorsData = [];
      for(let door of item){
        let doorObj = {
          product_name: door.querySelector('.catalog-section-item-name').innerText,
          product_price: door.querySelector('.catalog-section-item-price').innerText,
          image: door.querySelector('img').src
        };
      doorsData.push(doorObj);
      }
      data = JSON.stringify(doorsData);
      console.log(data);

      fs.writeFile("vashidveri.json", data, function(err) {
        if (err) throw err
      })
    }catch(err){
    console.log(err);
    }

  });

      });
  });

}catch(e){
  console.log(e);
}
}

getJSONfile();
