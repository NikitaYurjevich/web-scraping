const fs = require('fs');
const puppeteer = require('puppeteer');

let url = 'https://www.vashidveri72.ru/catalog/dveri_vkhodnye/';
let data;

async function fetchProductList() {
  let categories;
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
      let mainCat = document.querySelectorAll(".catalog-section-list-item-image");

      mainCat.forEach(async mainLink =>{

        try{
          //Не видит page
        await page.goto(mainLink, { waitUntil: 'networkidle2' });
      }catch(err){
          console.log(err);
        }

      categories = document.querySelectorAll('.catalog-section-item-base');
      categories.forEach(async link => {
      console.log(link);
      try{
      let doors = document.querySelectorAll('.catalog-section-item-base');
      let doorsData = [];
      for(let door of doors){
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

fetchProductList();
