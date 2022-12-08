import puppeteer from "puppeteer";
class Halou {
    payload;
    source;
    browser;
    page;
    links;
    Page_Numbers;
    constructor() {
        this.links = [
        /* "https://www.halooglasi.com/nekretnine/prodaja-stanova/vracar-gospodara-vucica-stan-parking-4-0/5425642589594?kid=4&sid=1670336781105", */
        ];
        this.payload = [];
        this.source =
            "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
        this.browser = null;
        this.page = null;
        this.Page_Numbers = 0;
    }
    async setup() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }
    async Bulk() {
        await this.page.goto(this.source, {
            waitUntil: "networkidle2",
            timeout: 0,
        });
        try {
            let Page_Numbers = await this.page.$eval("#pager-1 > ul > li:nth-child(8) > a", (el) => el.innerHTML);
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
                    if (PageLinks !== undefined) {
                        PageLinks.map((url) => {
                            this.links.push(url);
                        });
                    }
                    else {
                        this.Page_Numbers = 20;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async singleADD() {
        for (var i = 0; i < this.links.length; i++) {
            try {
                await this.page.goto(this.links[i], {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let NumberOfRooms = await this.page.$eval("#plh13", (el) => {
                    return el.innerText;
                });
                // console.log(NumberOfRooms);
                let square_meters = await this.page.$eval("#plh12", (el) => {
                    return el.innerText;
                });
                //   console.log(square_meters);
                let property_location = await this.page.$eval("#plh3", (el) => {
                    return el.innerText;
                });
                //   console.log(property_location);
                let property_price = await this.page.$eval("#wrapper > main > div > div.row.margin-bottom-20 > section > div.widget-ad-display.widget-basic-ad-details.ad-details > article > div > div > div.product-page-header > div.price-product-detail", (el) => {
                    return el.innerText;
                });
                //   console.log(property_price);
                let property_pictures = await this.page.$$eval("#fotorama > div > div.fotorama__nav-wrap > div > div > div > div > img", (item) => {
                    let t = item.map((img) => {
                        //          console.log((img as HTMLImageElement).src);
                        return img.src;
                    });
                    return t;
                });
                //  console.log(property_pictures);
                let PhoneNumber = await this.page.click("#plh70 > div > p > span > em");
                await this.page.waitForTimeout(3000);
                let Phonenmber2 = await this.page.$eval("#plh70 > a", (el) => {
                    return el.innerText;
                });
                //    console.log(Phonenmber2);
                console.log({
                    Number_Of_Rooms: NumberOfRooms ? NumberOfRooms : null,
                    property_location,
                    square_meters,
                    property_price,
                    PhoneNumber: Phonenmber2,
                    article_url: this.links[i],
                    website_source: this.source,
                    property_pictures: property_pictures,
                });
                this.payload.push({
                    Number_Of_Rooms: NumberOfRooms ? NumberOfRooms : null,
                    property_location,
                    square_meters,
                    property_price,
                    PhoneNumber: Phonenmber2,
                    article_url: this.links[i],
                    website_source: this.source,
                    property_pictures: property_pictures,
                });
                console.log(this.payload.length);
            }
            catch (error) {
                console.log("Url Not Proccessed for Some God Knows why");
            }
        }
    }
    async CleenUp() {
        await this.browser.close();
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            await this.Bulk();
            console.log(this.links.length);
            await this.singleADD();
            await this.CleenUp();
        }
    }
}
console.log(await new Halou().exec());
