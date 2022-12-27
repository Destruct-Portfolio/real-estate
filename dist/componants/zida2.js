import puppeteer from "puppeteer";
import Logger from "../misc/logger.js";
//import { Save2 } from "../core/save.js";
import axios from "axios";
import fs from "node:fs";
// need to FIX THE PAGES IN THIS BITCH 
//let API_URL = 'https://api.4zida.rs/v6/eds/6325e7a260196a1e2904781c'
export class Zida {
    Logger;
    page;
    Browser;
    source;
    Links;
    payload;
    constructor() {
        this.Logger = new Logger("scrapper", "Zida");
        this.page = null;
        this.Browser = null;
        this.Links = [];
        this.source =
            "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=";
        this.payload = [];
    }
    async setup() {
        this.Logger.info("Puppeteer launching ... ");
        this.Browser = await puppeteer.launch({ headless: true });
        this.page = await this.Browser.newPage();
    }
    async Bulk() {
        this.Logger.info("Grabing AD links in Multiple Pages ... ");
        for (var i = 1; i <= 41; i++) {
            try {
                await this.page.goto(this.source + i, {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let PageLinks = await this.page?.$$eval("body > app-root > app-search > div > div > mat-card > main > div > div.flex.flex-col.gap-4 > app-ad-search-preview", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a").href;
                    });
                    return t;
                });
                console.log(PageLinks);
                console.log(`[<<] Page ${this.source + i} collected ${PageLinks?.length} Link`);
                PageLinks?.map((item) => {
                    this.Links.push(item);
                });
            }
            catch (error) { }
        }
    }
    async SingleAD() {
        this.Logger.info("Starting Scraping For each AD Link Collected ... ");
        for (var i = 0; i < this.Links.length; i++) {
            await this.page.goto(this.Links[i], {
                waitUntil: "networkidle2",
                timeout: 0,
            });
            try {
                let WebsiteID = this.Links[i].split('/');
                let RequestPhoneNumber = await axios.get(`https://api.4zida.rs/v6/eds/${WebsiteID[WebsiteID.length - 1]}`);
                let response = RequestPhoneNumber.data;
                let PhoneNumber = response.author.phones[0].national;
                let Price = response.price ? response.price.toString() : null;
                let meter = response.area ? response.area : null;
                let images = response.images ? response.images.map((item) => {
                    return item.adDetails["1920x1080_fit_0_jpeg"];
                }) : null;
                let property_location = response.safeAddress + ' ' + response.placeIdsAndTitles.map((item) => {
                    return item.title;
                }).join(' ');
                let articleData = await this.page.evaluate(() => {
                    let Number_Of_Rooms = document.querySelector("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(7) > div > strong");
                    return {
                        Number_Of_Rooms: Number_Of_Rooms
                            ? Number_Of_Rooms.innerText
                            : null,
                    };
                });
                console.log({
                    property_location: property_location,
                    Number_Of_Rooms: articleData.Number_Of_Rooms,
                    square_meters: meter,
                    property_price: Price,
                    article_url: this.Links[i],
                    website_source: this.source,
                    property_pictures: images,
                    PhoneNumber: PhoneNumber
                });
                this.payload.push({
                    property_location: property_location,
                    Number_Of_Rooms: articleData.Number_Of_Rooms,
                    square_meters: meter,
                    property_price: Price,
                    article_url: this.Links[i],
                    website_source: this.source,
                    property_pictures: images,
                    PhoneNumber: PhoneNumber
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    async CleanUp() {
        this.Logger.info("Closing Down Puppetteer");
        await this.Browser.close();
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            await this.Bulk();
            await this.SingleAD();
            await this.CleanUp();
            fs.writeFileSync('../data/zida.json', JSON.stringify(this.payload));
            return this.payload;
        }
        else {
            this.Logger.info("Puppeteer Failed To Lunch . ");
            return this.payload;
        }
    }
}
console.log(await new Zida().exec());
