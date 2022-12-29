import puppeteer from "puppeteer";
class halou_updated {
    client;
    browser;
    payload;
    constructor() {
        this.client = null;
        this.browser = null;
        this.payload = [];
    }
    async setup() {
        this.browser = await puppeteer.launch({ headless: true });
        this.client = await this.browser.newPage();
    }
    async ScrapeADLink(link) {
        let attemempts = 0;
        while (attemempts <= 5) {
            await this.client.goto(link, { waitUntil: 'networkidle2', timeout: 0 });
            //Scrape 
            let ArticleData = await this.client.evaluate(() => {
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
                    id: "",
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
                };
            });
            // scrape Phone Number 
            let PhoneNumber = await this.client.click("#plh70 > div > p > span > em")
                .then(async () => {
                await this.client.waitForTimeout(3000);
                let Phonenmber2 = await this.client.$eval("#plh70 > a", (el) => {
                    return el.innerText;
                });
                return Phonenmber2;
            })
                .catch(() => {
                console.log("Phone Number Was Not Found");
                return "null";
            });
            ArticleData.article_url = link;
            ArticleData.website_source = "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
            ArticleData.PhoneNumber = PhoneNumber;
            let URLOBJECT = new URL(link);
            let id = URLOBJECT.pathname.split('/')[URLOBJECT.pathname.split('/').length - 1];
            ArticleData.id = id;
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
    async exec() {
        let source = "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
        await this.setup();
        if (this.client !== null) {
            // Go to the source and get the PAGE Number
            await this.client.goto(source, { waitUntil: "networkidle2", timeout: 0 });
            // returns the number of Pages
            let Page_Numbers = await this.client.$eval("#pager-1 > ul > li:nth-child(8) > a", (el) => el.innerHTML).catch(() => {
                return "20";
            });
            // convert from string to number 
            Page_Numbers = parseInt(Page_Numbers);
            console.log(Page_Numbers);
            // scraping the ADLINKS
            for (var page = 1; page <= Page_Numbers; page++) {
                try {
                    await this.client.goto(source + "&page=" + page, { waitUntil: 'networkidle2', timeout: 0 });
                    let ADS = await this.client.$$eval("#ad-list-2 > div.col-md-12", (item) => {
                        let t = item.map((item) => {
                            return item.querySelector("a").href;
                        });
                        return t;
                    });
                    for (let AD = 0; AD <= ADS.length; AD++) {
                        const ad_link = ADS[AD];
                        let result_ad = await this.ScrapeADLink(ad_link);
                        console.log(result_ad);
                        if (result_ad !== undefined)
                            this.payload.push(result_ad);
                    }
                }
                catch (error) {
                    console.log(`Failed to load  :: ${source}"&page="${page}`);
                }
            }
        }
        console.log("[PUPPETEER] has Failed to start ... ");
        return null;
    }
}
console.log(new halou_updated().exec());
