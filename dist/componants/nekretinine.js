import puppeteer from "puppeteer";
import Logger from "../misc/logger.js";
import { Save2 } from "../core/save.js";
export class Nekretinine {
    Logger;
    browser;
    page;
    Links;
    source;
    payload;
    constructor() {
        this.browser = null;
        this.page = null;
        this.Logger = new Logger("scrapper", "Nekretinine");
        this.Links = [];
        this.source =
            "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/";
        this.payload = [];
    }
    async setup() {
        this.Logger.info("Puppeteer launching ... ");
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
    }
    async Collect_Links() {
        this.Logger.info("Grabing AD links in Multiple Links ... ");
        await this.page.goto(this.source, {
            waitUntil: "networkidle2",
            timeout: 0,
        });
        for (var i = 0; i <= 5; i++) {
            try {
                await this.page.goto(this.source + i, {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                this.Logger.info(this.page.url());
                let PageLinks = await this.page?.$$eval("div.row.offer", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a").href;
                    });
                    return t;
                });
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
            try {
                await this.page.goto(this.Links[i], {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let ArticleData = await this.page.evaluate(async () => {
                    let ImageLinks = [];
                    let price = document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__price");
                    let location = document.querySelector("#lokacija > div.property__location");
                    let Rooms = document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div:nth-child(6) > div > ul > li:nth-child(2) > span");
                    let square_meters = document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__size");
                    let T = document.querySelector("#top");
                    let Gal = Array.from(T.querySelectorAll("picture"));
                    Gal.map((item) => {
                        let link = item.querySelector("source")?.srcset;
                        console.log(link);
                        if (link !== "")
                            ImageLinks.push(link);
                    });
                    return {
                        Number_Of_Rooms: Rooms
                            ? Rooms.innerText.split("\n")[1]
                            : null,
                        square_meters: square_meters
                            ? square_meters.innerText
                            : null,
                        property_location: location
                            ? location.innerText.split("\n").join(" ")
                            : null,
                        property_price: price
                            ? price.innerText.split("\n")[1]
                            : null,
                        article_url: "",
                        website_source: "",
                        property_pictures: ImageLinks ? ImageLinks : [],
                        PhoneNumber: "",
                    };
                });
                let phoneNumber = await this.page.click("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > button")
                    .then(async () => {
                    await this.page?.waitForTimeout(3000);
                    let phoneNumber = await this.page.$eval("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > a", (el) => {
                        return el.innerText;
                    });
                    return phoneNumber;
                })
                    .catch(() => {
                    console.log("Phone Number Failed To Load");
                    return "null";
                });
                ArticleData.article_url = this.Links[i];
                ArticleData.website_source = this.source;
                ArticleData.PhoneNumber = phoneNumber;
                console.log(ArticleData);
                this.payload.push(ArticleData);
                if (this.payload.length === 20) {
                    console.log(this.payload.length);
                    this.Logger.info("20 Elements Loaded and Are ready to be saved ...");
                    let save = await new Save2().wrtieData("nekertine", this.payload);
                    this.payload = [];
                }
            }
            catch (error) { }
        }
    }
    async CleanUp() {
        this.Logger.info("Closing Down Puppetteer");
        await this.browser.close();
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            await this.Collect_Links();
            await this.SingleAD();
            await this.CleanUp();
            this.Logger.info("Saving Last Elements Loaded ... ");
            await new Save2().wrtieData("nekertine", this.payload);
            return this.payload;
        }
        else {
            this.Logger.info("Puppeteer Failed To Lunch . ");
            return this.payload;
        }
    }
}
console.log(new Nekretinine().exec());
