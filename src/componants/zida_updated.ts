import puppeteer, { Page, Browser } from "puppeteer";
import { Ad_Object, Zida_Api } from "src/types";
import axios from "axios";
import Save2 from "../core/save.js";

export default class Zida_updated {

    private page: Page | null;

    private browser: Browser | null;

    private source: string;

    private payload: Ad_Object[];

    constructor() {
        this.page = null;
        this.browser = null;
        this.source = "https://www.4zida.rs/prodaja-stanova/beograd?lista_fizickih_lica="
        this.payload = [];
    }

    private async setup(): Promise<void> {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
    }


    //scrapes single PAGE
    private async SingAD(link: string): Promise<Ad_Object | undefined> {
        let attemts = 0
        while (attemts <= 5) {

            await this.page!.goto(link, {
                waitUntil: "networkidle2",
                timeout: 0,
            });

            let WebsiteID = link.split('/')
            let RequestPhoneNumber = await axios.get(`https://api.4zida.rs/v6/eds/${WebsiteID[WebsiteID.length - 1]}`)

            let response: Zida_Api = RequestPhoneNumber.data

            let PhoneNumber = response.author.phones![0].national

            let Price = response.price ? response.price.toString() : null

            let meter = response.area ? response.area : null

            let images = response.images ? response.images.map((item) => {
                return item.adDetails["1920x1080_fit_0_jpeg"]
            }) : null

            let property_location = response.safeAddress! + ' ' + response.placeIdsAndTitles!.map((item) => {
                return item.title
            }).join(' ')

            let articleData = await this.page!.evaluate(() => {
                let Number_Of_Rooms = document.querySelector(
                    "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(7) > div > strong"
                );

                return {
                    Number_Of_Rooms: Number_Of_Rooms
                        ? (Number_Of_Rooms as HTMLElement).innerText
                        : null,
                };
            });
            let ArticleData = {
                property_location: property_location,
                Number_Of_Rooms: articleData.Number_Of_Rooms,
                square_meters: meter,
                property_price: Price,
                article_url: link,
                website_source: this.source,
                property_pictures: images,
                PhoneNumber: PhoneNumber,
                id: WebsiteID[WebsiteID.length - 1]
            }

            let check_null = Object.values(ArticleData).every(value => value != null);
            console.log(check_null)
            if (check_null) {
                return ArticleData
            } else {
                attemts++
            }
        }

    }

    public async exec(): Promise<Ad_Object[]> {
        let attempts = 0
        await this.setup()
        for (var i = 1; i <= 12; i++) {
            try {
                await this.page!.goto(this.source + i, {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let PageLinks: string[] = await this.page!.$$eval("body > app-root > app-search > div > div > div > main > div > div.flex.flex-col.gap-4 > app-ad-search-preview", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a")!.href;
                    });
                    return t;
                }
                );

                console.log(PageLinks);
                console.log(`[<<] Page ${this.source + i} collected ${PageLinks?.length} Link`)
                for (var j = 0; j <= PageLinks.length; j++) {
                    let D = await this.SingAD(PageLinks[j])
                    console.log(D)
                    if (D !== undefined) this.payload.push(D)
                }
            } catch (error) {
                console.log('Failed To Load')
                if (attempts <= 3) {
                    console.log('Failed to Load Page ' + this.source + i)
                } else {
                    console.log('Failed to Load Page Traying again ... ')
                    console.log("Number of attempts :: " + attempts)
                    attempts++
                    i--
                }
            }
        }

        await new Save2().wrtieData('zida_updated', this.payload)
        this.payload = []
        return this.payload;
    }
}



