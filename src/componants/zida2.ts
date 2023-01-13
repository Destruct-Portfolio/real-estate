import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object, Zida_Api } from "src/types";
import Logger from "../misc/logger.js";
import Check_save from "../core/save.js";
import axios, { formToJSON } from "axios"


//let API_URL = 'https://api.4zida.rs/v6/eds/6325e7a260196a1e2904781c'

export default class Zida {
  private Logger: Logger;

  private page: Page | null;

  private Browser: Browser | null;

  private source: string;

  private Links: string[];

  private payload: Ad_Object[];

  private Links2: Set<string>

  constructor() {
    this.Logger = new Logger("scrapper", "Zida");

    this.page = null;

    this.Links = []

    this.Links2 = new Set()
    this.Browser = null;

    this.source = "https://www.4zida.rs/prodaja-stanova/beograd?lista_fizickih_lica=&strana="

    this.payload = [];
  }

  private async setup() {
    this.Logger.info("Puppeteer launching ... ");

    this.Browser = await puppeteer.launch({ headless: true });

    this.page = await this.Browser.newPage();
  }

  private async Bulk() {
    this.Logger.info("Grabing AD links in Multiple Pages ... ");
    let Links = (() => {
      let t = []
      for (var i = 1; i <= 12; i++) {
        t.push(this.source + i)
      }
      return t
    })()

    console.log(Links)

    for (var i = 0; i <= Links.length; i++) {

      try {
        await this.page!.goto(Links[i], {
          waitUntil: "load",
          timeout: 0,
        });

        console.log(this.page!.url())
        let PageLinks: string[] = await this.page!.$$eval(
          "body > app-root > app-search > div > div > div > main > div > div.flex.flex-col.gap-4 > app-ad-search-preview",
          (item) => {
            let t = item.map((item) => {
              return item.querySelector("a")!.href;
            });
            return t;
          }
        );
        console.log(PageLinks)
        PageLinks.map((item) => {
          this.Links2.add(item)
        })
      } catch (er) {

      }
    }

  }


  private async SingleAD() {

    for (let Link of this.Links2) {
      console.log(Link)

      await this.page!.goto(Link, {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      try {
        let WebsiteID = Link.split('/')


        let exists = new Check_save().Exists('zida_updated', { id: WebsiteID[WebsiteID.length - 1] })
        if (!exists) {

          console.log('AD with ID :: ' + WebsiteID[WebsiteID.length - 1] + " Is Getting Scrapped ")
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
            article_url: Link,
            website_source: this.source,
            property_pictures: images,
            PhoneNumber: PhoneNumber,
            id: WebsiteID[WebsiteID.length - 1]
          });
          new Check_save().Write('zida_updated', {
            property_location: property_location,
            Number_Of_Rooms: articleData.Number_Of_Rooms,
            square_meters: meter,
            property_price: Price,
            article_url: Link,
            website_source: this.source,
            property_pictures: images,
            PhoneNumber: PhoneNumber,
            id: WebsiteID[WebsiteID.length - 1]
          })
        } else {
          console.log('Article Allready exists')
        }

      } catch (error) {
        console.log(error)
        return null
      }
    }

  }

  private CreatLinks() {
    let Pages: string[] = []
    for (var i = 1; i <= 1; i++) {
      Pages.push(`${this.source + i}`)
    }
    return Pages
  }

  private async CleanUp() {
    this.Logger.info("Closing Down Puppetteer");
    await this.Browser!.close();
  }

  public async exec(): Promise<Ad_Object[]> {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();

      console.log(this.Links2.size)

      await this.SingleAD();

      await this.CleanUp();
      console.log(this.payload.length)
      console.log(this.Links)
      /*  new Save2().wrtieData('zida_updated', this.payload) */
      this.payload = []
      return this.payload;
    } else {

      this.Logger.info("Puppeteer Failed To Lunch . ");

      return this.payload;

    }

  }

}
