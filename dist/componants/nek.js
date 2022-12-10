import puppeteer from "puppeteer";
class Nek {
    browser;
    page;
    Links;
    source;
    payload;
    constructor() {
        this.browser = null;
        this.page = null;
        this.Links = [
            "https://www.nekretnine.rs/stambeni-objekti/stanovi/renoviran-luksuzan-stan-u-centru-beograda/NkqUU0Cc8QL/",
            "https://www.nekretnine.rs/stambeni-objekti/stanovi/lekino-brdo-i-sp-20-avg-23-bez-provizije/Nk-8DV3FYqg/",
            "https://www.nekretnine.rs/stambeni-objekti/stanovi/3-5-stan-kompletno-renoviran-i-opremljen/Nka5dkMPHTB/",
        ];
        this.source =
            "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/";
        this.payload = [];
    }
    async setup() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }
    async Collect_Links() {
        await this.page.goto(this.source, {
            waitUntil: "networkidle2",
            timeout: 0,
        });
        for (var i = 0; i < 5; i++) {
            try {
                await this.page.goto(this.source + "/" + i + "/", {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                console.log(this.page.url());
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
            catch (error) {
                console.log(error);
            }
        }
    }
    async SingleAD() {
        for (var i = 0; i < this.Links.length; i++) {
            try {
                await this.page.goto(this.Links[i], {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let ArticleData = await this.page.evaluate(async () => {
                    let ImageLinks = [];
                    let price = await document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__price");
                    let location = await document.querySelector("#lokacija > div.property__location");
                    let Rooms = await document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div:nth-child(6) > div > ul > li:nth-child(2) > span");
                    let square_meters = await document.querySelector("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__size");
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
                await this.page.click("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > button");
                await this.page?.waitForTimeout(3000);
                let phoneNumber = await this.page.$eval("body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > a", (el) => {
                    return el.innerText;
                });
                ArticleData.article_url = this.Links[i];
                ArticleData.website_source = this.source;
                ArticleData.PhoneNumber = phoneNumber;
                console.log(ArticleData);
            }
            catch (error) { }
        }
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            // await this.Collect_Links();
            await this.SingleAD();
            return this.payload;
        }
        else {
            console.log("Puppeteer Failed To lunch");
        }
    }
}
console.log(await new Nek().exec());
