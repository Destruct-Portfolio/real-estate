import puppeteer from "puppeteer";
class Zidda {
    page;
    Browser;
    source;
    Links;
    constructor() {
        this.page = null;
        this.Browser = null;
        this.Links = [
            "https://www.4zida.rs/prodaja/stanovi/beograd/oglas/cerski-venac/63888febd5114a6875020983",
            "https://www.4zida.rs/prodaja/stanovi/pancevo/oglas/breza-42/60f7179eaa457b654b5106b7",
            "https://www.4zida.rs/prodaja/stanovi/novi-sad/oglas/dr-dusana-popovica-4v/6387d8348bd103945909832e",
        ];
        this.source =
            "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=";
    }
    async setup() {
        this.Browser = await puppeteer.launch({ headless: false });
        this.page = await this.Browser.newPage();
    }
    async Bulk() {
        for (var i = 1; i < 5; i++) {
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
                PageLinks?.map((item) => {
                    this.Links.push(item);
                });
            }
            catch (error) { }
        }
    }
    async SingleAD() {
        for (var i = 0; i < this.Links.length; i++) {
            await this.page.goto(this.Links[i], {
                waitUntil: "networkidle2",
                timeout: 0,
            });
            let Price = await this.page.$eval("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > div > div.flex.flex-1.flex-col.justify-between.gap-4 > div.prices > span", (el) => {
                return el.innerText;
            });
            let Number_Of_Rooms = await this.page.$eval("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(7) > div > strong", (el) => {
                return el.innerText;
            });
            let meteer = await this.page.$eval("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(6) > div > strong", (el) => {
                return el.innerText;
            });
            let property_location = await this.page.$eval("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > div > div.flex.flex-1.flex-col.justify-between.gap-4 > app-place-info > div", (el) => {
                return el.innerText;
            });
            await this.page.click("body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > app-author-info > app-horizontal-info > div > div > div > div > button:nth-child(1)");
            await this.page.waitForTimeout(2000);
            let PhoneNumber = await this.page.$eval("#mat-dialog-1 > app-author-phone-dialog > div > mat-dialog-content > section.flex.flex-col.items-center.gap-3 > a", (el) => {
                return el.innerText;
            });
            console.log({
                Price,
                Number_Of_Rooms,
                meteer,
                property_location,
                PhoneNumber,
            });
        }
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            // await this.Bulk();
            await this.SingleAD();
        }
        else {
            console.log("Browser Failed To lunch");
        }
    }
}
console.log(await new Zidda().exec());
