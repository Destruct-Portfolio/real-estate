import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object } from "src/types";
import Logger from "../misc/logger.js";

export class Zida {
  private Logger: Logger;
  private page: Page | null;
  private Browser: Browser | null;
  private source: string;
  private Links: string[];
  private payload: Ad_Object[];
  constructor() {
    this.Logger = new Logger("scrapper", "ZIDA");

    this.page = null;

    this.Browser = null;

    this.Links = [];

    this.source =
      "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=";

    this.payload = [];
  }

  private async setup() {
    this.Logger.info("Puppeteer launching ... ");

    this.Browser = await puppeteer.launch({ headless: false });

    this.page = await this.Browser.newPage();
  }

  private async Bulk() {
    this.Logger.info("Grabing AD links in Multiple Links ... ");
    for (var i = 1; i < 30; i++) {
      try {
        await this.page!.goto(this.source + i, {
          waitUntil: "networkidle2",
          timeout: 0,
        });
        let PageLinks: string[] | undefined = await this.page?.$$eval(
          "body > app-root > app-search > div > div > mat-card > main > div > div.flex.flex-col.gap-4 > app-ad-search-preview",
          (item) => {
            let t = item.map((item) => {
              return item.querySelector("a")!.href;
            });

            return t;
          }
        );
        console.log(PageLinks);

        PageLinks?.map((item) => {
          this.Links.push(item);
        });
      } catch (error) {}
    }
  }

  private async SingleAD() {
    this.Logger.info("Starting Scraping For each AD Link Collected ... ");

    for (var i = 0; i < this.Links.length; i++) {
      await this.page!.goto(this.Links[i], {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      await this.page!.click(
        "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > app-author-info > app-horizontal-info > div > div > div > div > button:nth-child(1)"
      );
      await this.page!.waitForTimeout(2000);

      let PhoneNumber = await this.page!.$eval(
        "#mat-dialog-0 > app-author-phone-dialog > div > mat-dialog-content > section.flex.flex-col.items-center.gap-3 > a > button",
        (el) => {
          return (el as HTMLElement).innerText;
        }
      );

      let articleData = await this.page!.evaluate(() => {
        let price = document.querySelector(
          "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > div > div.flex.flex-1.flex-col.justify-between.gap-4 > div.prices > span"
        );

        let Number_Of_Rooms = document.querySelector(
          "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(7) > div > strong"
        );

        let meter = document.querySelector(
          "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > app-info-item:nth-child(6) > div > strong"
        );

        let property_location = document.querySelector(
          "body > app-root > app-ad-details > div > div.main-container > main > div:nth-child(7) > app-apartment-details > div:nth-child(1) > div > div > div.flex.flex-1.flex-col.justify-between.gap-4 > app-place-info > div"
        );

        let Images = Array.from(
          document.querySelectorAll("#preview-gallery-image-sm")
        ).map((item) => {
          return (item as HTMLImageElement).src;
        });

        return {
          Number_Of_Rooms: Number_Of_Rooms
            ? (Number_Of_Rooms as HTMLElement).innerText
            : null,

          square_meters: meter ? (meter as HTMLElement).innerText : null,

          property_location: property_location
            ? (property_location as HTMLElement).innerText
            : null,

          property_price: price ? (price as HTMLElement).innerText : null,

          article_url: "",

          website_source: "",

          property_pictures: Image ? Images : [],

          PhoneNumber: "",
        };
      });

      articleData.PhoneNumber = PhoneNumber;
      articleData.website_source = this.source;
      articleData.article_url = this.Links[i];

      console.log(articleData);

      this.payload.push(articleData);
    }
  }

  private async CleanUp() {
    this.Logger.info("Closing Down Puppetteer");

    await this.Browser!.close();
  }

  public async exec() {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();

      await this.SingleAD();

      await this.CleanUp();

      return this.payload;
    } else {
      this.Logger.info("Puppeteer Failed To Lunch . ");

      return this.payload;
    }
  }
}

// console.log(await new Zida().exec());
