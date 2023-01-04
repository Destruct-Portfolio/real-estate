import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object, Zida_Api } from "src/types";
import Logger from "../misc/logger.js";
import Save2 from "../core/save.js";
import axios, { formToJSON } from "axios"


//let API_URL = 'https://api.4zida.rs/v6/eds/6325e7a260196a1e2904781c'

export default class Zida {
  private Logger: Logger;

  private page: Page | null;

  private Browser: Browser | null;

  private source: string;

  private Links: string[];

  private payload: Ad_Object[];

  constructor() {
    this.Logger = new Logger("scrapper", "Zida");

    this.page = null;

    this.Links = []

    this.Browser = null;

    this.source = "https://www.4zida.rs/prodaja-stanova/beograd?lista_fizickih_lica="

    this.payload = [];
  }

  private async setup() {
    this.Logger.info("Puppeteer launching ... ");

    this.Browser = await puppeteer.launch({ headless: true });

    this.page = await this.Browser.newPage();
  }

  private async Bulk() {
    this.Logger.info("Grabing AD links in Multiple Pages ... ");

    for (var i = 1; i <= 12; i++) {
      try {
        await this.page!.goto(this.source + i, {
          waitUntil: "networkidle2",
          timeout: 0,
        });
        let PageLinks: string[] = await this.page!.$$eval(
          "body > app-root > app-search > div > div > div > main > div > div.flex.flex-col.gap-4 > app-ad-search-preview",
          (item) => {
            let t = item.map((item) => {
              return item.querySelector("a")!.href;
            });
            return t;
          }
        );

        console.log(PageLinks);
        PageLinks.map(i => { this.Links.push(i) })
        console.log(`[<<] Page ${this.source + i} collected ${PageLinks?.length} Link`)
        for (var j = 0; j < PageLinks.length; j++) {
          await this.SingleAD(PageLinks[j])

        }

      } catch (error) { }
    }
  }

  private async SingleAD(Adurl: string) {
    this.Logger.info("Starting Scraping For each AD Link Collected ... ");

    await this.page!.goto(Adurl, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    try {
      let WebsiteID = Adurl.split('/')
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

      console.log({
        property_location: property_location,
        Number_Of_Rooms: articleData.Number_Of_Rooms,
        square_meters: meter,
        property_price: Price,
        article_url: Adurl,
        website_source: this.source,
        property_pictures: images,
        PhoneNumber: PhoneNumber,
        id: WebsiteID[WebsiteID.length - 1]
      });

      this.payload.push({
        property_location: property_location,
        Number_Of_Rooms: articleData.Number_Of_Rooms,
        square_meters: meter,
        property_price: Price,
        article_url: Adurl,
        website_source: this.source,
        property_pictures: images,
        PhoneNumber: PhoneNumber,
        id: WebsiteID[WebsiteID.length - 1]
      })
    } catch (error) {
      console.log(error)
      return null
    }


  }

  private async CleanUp() {
    this.Logger.info("Closing Down Puppetteer");
    await this.Browser!.close();
  }

  public async exec(): Promise<Ad_Object[]> {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();

      /*  await this.SingleAD(); */

      await this.CleanUp();
      console.log(this.payload.length)
      console.log(this.Links)
      await new Save2().wrtieData('zida_updated', this.payload)
      this.payload = []
      return this.payload;
    } else {

      this.Logger.info("Puppeteer Failed To Lunch . ");

      return this.payload;

    }

  }

}
