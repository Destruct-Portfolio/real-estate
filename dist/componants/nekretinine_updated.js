import puppeteer from "puppeteer";
import fs from "node:fs";
//Need to Create a check to see if the any of the values scrappped are null 
class Nekretinine {
    client;
    Browser;
    constructor() {
        this.client = null;
        this.Browser = null;
    }
    async setup() {
        this.Browser = await puppeteer.launch({ headless: true });
        this.client = await this.Browser.newPage();
    }
    async ScrapeADLINK(Link) {
        let attemempts = 0;
        while (attemempts <= 5) {
            await this.client.goto(Link, {
                waitUntil: "networkidle2",
                timeout: 0,
            });
            /*  await this.client!.waitForNetworkIdle({ timeout: 0 }) */
            let ArticleData = await this.client.evaluate(async () => {
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
                    id: ""
                };
            });
            let phoneNumber = await this.client.click("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > button")
                .then(async () => {
                await this.client?.waitForTimeout(3000);
                let phoneNumber = await this.client.$eval("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > a", (el) => {
                    return el.innerText;
                });
                return phoneNumber;
            })
                .catch(() => {
                console.log("Phone Number Failed To Load");
                return null;
            });
            ArticleData.article_url = Link;
            ArticleData.website_source = "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/";
            ArticleData.PhoneNumber = phoneNumber;
            ArticleData.id = Link.split('/')[Link.split('/').length - 2];
            let check_null = Object.values(ArticleData).every(value => value != null);
            console.log(check_null);
            if (check_null) {
                return ArticleData;
            }
            else {
                attemempts++;
            }
        }
    }
    async Script() {
        await this.setup();
        let Payload = [];
        for (var i = 1; i <= 5; i++) {
            try {
                //goes to Page
                await this.client.goto("https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/" + i, { timeout: 0, waitUntil: "networkidle2" });
                //Collect ALL THE LINK
                let PageLinks = await this.client?.$$eval("div.row.offer", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a").href;
                    });
                    return t;
                });
                console.log(PageLinks);
                if (PageLinks !== undefined) {
                    for (var ADLINK = 0; ADLINK < PageLinks.length; ADLINK++) {
                        console.log(`Proccessing this ${PageLinks[ADLINK]}`);
                        let ADOBJECT = await this.ScrapeADLINK(PageLinks[ADLINK]);
                        console.log(ADOBJECT);
                        if (ADOBJECT !== undefined)
                            Payload.push(ADOBJECT);
                    }
                }
            }
            catch (error) {
                console.log("Failed To Load  :: " + "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/" + i);
                i--;
            }
        }
        fs.writeFileSync('../data/nek2_updated.json', JSON.stringify(Payload));
        return Payload;
    }
}
console.log(await new Nekretinine().Script());
