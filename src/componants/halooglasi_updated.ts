import puppeteer, { Page, Browser } from "puppeteer"
import Check_save from "../core/save.js"
import { Ad_Object } from "src/types"

// make the error handling better 


export default class halou_updated {
    private client: Page | null

    private browser: Browser | null

    private payload: Ad_Object[]

    constructor() {
        this.client = null
        this.browser = null
        this.payload = []
    }

    private async setup() {
        this.browser = await puppeteer.launch({ headless: true })

        this.client = await this.browser.newPage()
    }

    private async ScrapeADLink(link: string): Promise<Ad_Object | undefined> {
        let attemempts = 0
        let URLOBJECT = new URL(link)
        let id = URLOBJECT.pathname.split('/')[URLOBJECT.pathname.split('/').length - 1]
        let exists = new Check_save().Exists('halou_updated', { id: id })
        if (!exists) {
            console.log('Scraping AD with this ID :: ' + id)
            while (attemempts <= 5) {
                await this.client!.goto(link, { waitUntil: 'networkidle2', timeout: 0 })
                //Scrape 
                let ArticleData: Ad_Object = await this.client!.evaluate(() => {
                    try {
                        let Rooms = document.querySelector("#plh13");
                        let meter = document.querySelector("#plh12");
                        let location = document.querySelector('#wrapper > main > div > div.row.margin-bottom-20 > section > div.widget-ad-display.widget-basic-ad-details.ad-details > article > div > div > div.product-page-header > div.product-details-desc')
                        let price = document.querySelector(
                            "#wrapper > main > div > div.row.margin-bottom-20 > section > div.widget-ad-display.widget-basic-ad-details.ad-details > article > div > div > div.product-page-header > div.price-product-detail"
                        );

                        let images = Array.from(
                            document.querySelectorAll(
                                "#fotorama > div > div.fotorama__nav-wrap > div > div > div > div > img"
                            )
                        ).map((item) => {
                            console.log((item as HTMLImageElement).src);
                            return (item as HTMLImageElement).src;
                        });

                        return {
                            id: "",
                            Number_Of_Rooms: Rooms ? (Rooms as HTMLElement).innerText : null,
                            square_meters: meter ? (meter as HTMLElement).innerText : null,
                            property_location: location ? (location as HTMLElement).innerText.split('-').map((x) => { return x.trim() }).join(' ') : null,
                            property_price: price ? (price as HTMLElement).innerText : null,
                            article_url: "",
                            website_source: "",
                            property_pictures: images ? images : null,
                            PhoneNumber: "",

                        };
                    } catch (error) {
                        return {
                            id: null,
                            Number_Of_Rooms: null,
                            square_meters: null,
                            property_location: null,
                            property_price: null,
                            article_url: null,
                            website_source: null,
                            property_pictures: null,
                            PhoneNumber: null,

                        }
                    }
                });
                // scrape Phone Number 

                let PhoneNumber = await this.client!.click("#plh70 > div > p > span > em")
                    .then(async () => {
                        await this.client!.waitForTimeout(3000);

                        let Phonenmber2 = await this.client!.$eval("#plh70 > a", (el) => {
                            return (el as HTMLElement).innerText;
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

                ArticleData.id = id

                let check_null = Object.values(ArticleData).every(value => value != null);
                console.log(check_null)

                if (check_null) {
                    return ArticleData
                } else {
                    attemempts++
                }
            }
        } else {
            console.log('ID :: ' + id + ' Allready exists')
            return undefined
        }

    }


    public async exec(): Promise<Ad_Object[]> {
        let source = "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
        await this.setup()

        // Go to the source and get the PAGE Number
        await this.client!.goto(source, { waitUntil: "networkidle2", timeout: 0 })
        // returns the number of Pages
        let Page_Numbers: number | string = await this.client!.$eval(
            "#pager-1 > ul > li:nth-child(8) > a",
            (el) => el.innerHTML
        ).catch(() => {
            return "20";
        });

        // convert from string to number 
        Page_Numbers = parseInt(Page_Numbers);
        console.log(Page_Numbers);

        // scraping the ADLINKS
        for (var page = 1; page <= Page_Numbers; page++) {
            try {
                await this.client!.goto(source + "&page=" + page, { waitUntil: "networkidle2", timeout: 0 })
                let ADS = await this.client!.$$eval(
                    "#ad-list-2 > div.col-md-12",
                    (item) => {
                        let t = item.map((item) => {
                            return item.querySelector("a")!.href;
                        });
                        return t;
                    }
                );
                console.log(ADS)
                for (let AD = 0; AD <= ADS.length; AD++) {
                    const ad_link = ADS[AD];
                    let result_ad = await this.ScrapeADLink(ad_link)
                    console.log(result_ad)
                    if (result_ad !== undefined) {
                        this.payload.push(result_ad)
                    }
                }
            } catch (error) {
                console.log(`Failed to load :: ${source}"&page="${page}`)
            }
        }

        //await new Save2().wrtieData("halou_updated", this.payload)
        this.payload = []
        await this.CLoseUP()
        return this.payload
    }


    private async CLoseUP(): Promise<void> {
        console.log('CLosing Down Browser and Page for SAS ')
        await this.client!.close()
        await this.browser!.close()
    }
}




console.log(new halou_updated().exec())