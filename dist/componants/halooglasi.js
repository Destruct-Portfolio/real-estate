import puppeteer from "puppeteer";
import Logger from "../misc/logger.js";
import fs from "fs";
export class halooglasi {
    payload;
    source;
    browser;
    page;
    links;
    Page_Numbers;
    Logger;
    constructor() {
        this.links = [
            "https://www.halooglasi.com/nekretnine/prodaja-stanova/renoviran-uknjizen-odmah-useljiv/5425642668237?kid=4&sid=1672134545166"
        ];
        this.payload = [];
        this.source =
            "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
        this.browser = null;
        this.page = null;
        this.Page_Numbers = 0;
        this.Logger = new Logger("scrapper", "Hlaouglasi");
    }
    async setup() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
    }
    async Bulk() {
        this.Logger.info("Grabing AD Link in Mulitple Pages ...");
        await this.page.goto(this.source, {
            waitUntil: "networkidle2",
            timeout: 0,
        });
        let Page_Numbers = await this.page.$eval("#pager-1 > ul > li:nth-child(8) > a", (el) => el.innerHTML).catch(() => {
            return "20";
        });
        this.Page_Numbers = parseInt(Page_Numbers);
        console.log(this.Page_Numbers);
        for (var i = 0; i < this.Page_Numbers; i++) {
            try {
                await this.page.goto(this.source + "&page=" + i, {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let PageLinks = await this.page?.$$eval("#ad-list-2 > div.col-md-12", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a").href;
                    });
                    return t;
                });
                console.log(PageLinks);
                PageLinks.map((url) => {
                    this.links.push(url);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    async singleADD() {
        for (var i = 0; i < this.links.length; i++) {
            try {
                await this.page.goto(this.links[i], {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let PhoneNumber = await this.page.click("#plh70 > div > p > span > em")
                    .then(async () => {
                    await this.page.waitForTimeout(3000);
                    let Phonenmber2 = await this.page.$eval("#plh70 > a", (el) => {
                        return el.innerText;
                    });
                    return Phonenmber2;
                })
                    .catch(() => {
                    console.log("Phone Number Was Not Found");
                    return "null";
                });
                let ArticleData = await this.page.evaluate(() => {
                    let Rooms = document.querySelector("#plh13");
                    let meter = document.querySelector("#plh12");
                    let location1 = document.querySelector("#plh3");
                    let location2 = document.querySelector('#plh4');
                    let location3 = document.querySelector('#plh5');
                    let price = document.querySelector("#wrapper > main > div > div.row.margin-bottom-20 > section > div.widget-ad-display.widget-basic-ad-details.ad-details > article > div > div > div.product-page-header > div.price-product-detail");
                    let images = Array.from(document.querySelectorAll("#fotorama > div > div.fotorama__nav-wrap > div > div > div > div > img")).map((item) => {
                        console.log(item.src);
                        return item.src;
                    });
                    return {
                        Number_Of_Rooms: Rooms ? Rooms.innerText : null,
                        square_meters: meter ? meter.innerText : null,
                        property_location: location1
                            ? location1.innerText
                            : null + ' ' + location2 ? location2.innerText : null + " " + location3 ? location3.innerHTML : null,
                        property_price: price ? price.innerText : null,
                        article_url: "",
                        website_source: "",
                        property_pictures: images ? images : null,
                        PhoneNumber: "",
                        id: ""
                    };
                });
                ArticleData.article_url = this.links[i];
                ArticleData.website_source = this.source;
                ArticleData.PhoneNumber = PhoneNumber;
                let URLOBJECT = new URL(this.links[i]);
                let id = URLOBJECT.pathname.split('/')[URLOBJECT.pathname.split('/').length - 1];
                ArticleData.id = id;
                console.log(ArticleData);
                this.payload.push(ArticleData);
            }
            catch (error) { }
        }
    }
    async CleenUp() {
        this.Logger.info("CLosing Down Puppeteer ");
        await this.browser.close();
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            await this.Bulk();
            await this.singleADD();
            await this.CleenUp();
            console.log(this.payload.length);
            fs.writeFileSync('../data/halou_updated.json', JSON.stringify(this.payload));
            return this.payload;
        }
        else {
            return this.payload;
        }
    }
}
console.log(new halooglasi().exec());
