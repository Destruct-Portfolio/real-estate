import puppeteer, { Browser, Page, Puppeteer } from "puppeteer";

import { Ad_Object } from "src/types";

import Logger from "../misc/logger.js";

export class Nekretinine {
  private Logger: Logger;

  private browser: Browser | null;

  private page: Page | null;

  private Links: string[];

  private source: string;

  private payload: Ad_Object[];

  constructor() {
    this.browser = null;

    this.page = null;

    this.Logger = new Logger("scrapper", "Nekretinine");

    this.Links = [];

    this.source =
      "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/grad/beograd/vlasnik/lista/po-stranici/20/stranica/";

    this.payload = [];
  }

  private async setup() {
    this.Logger.info("Puppeteer launching ... ");

    this.browser = await puppeteer.launch({ headless: true });

    this.page = await this.browser.newPage();
  }

  private async Collect_Links() {
    this.Logger.info("Grabing AD links in Multiple Links ... ");

    await this.page!.goto(this.source, {
      waitUntil: "networkidle2",

      timeout: 0,
    });

    for (var i = 1; i < 6; i++) {
      try {
        await this.page!.goto(this.source + "/" + i + "/", {
          waitUntil: "networkidle2",

          timeout: 0,
        });

        this.Logger.info(this.page!.url());

        let PageLinks: string[] | undefined = await this.page?.$$eval(
          "div.row.offer",

          (item) => {
            let t = item.map((item) => {
              return item.querySelector("a")!.href;
            });

            return t;
          }
        );

        PageLinks?.map((item) => {
          this.Links.push(item);
        });
      } catch (error) {
        /*       console.log(error); */
      }
    }
  }

  private async SingleAD() {
    this.Logger.info("Starting Scraping For each AD Link Collected ... ");

    for (var i = 0; i < this.Links.length; i++) {
      try {
        await this.page!.goto(this.Links[i], {
          waitUntil: "networkidle2",
          timeout: 0,
        });
        let ArticleData = await this.page!.evaluate(async () => {
          let ImageLinks: string[] = [];

          let price = await document.querySelector(
            "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__price"
          );

          let location = await document.querySelector(
            "#lokacija > div.property__location"
          );

          let Rooms = await document.querySelector(
            "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div:nth-child(6) > div > ul > li:nth-child(2) > span"
          );

          let square_meters = await document.querySelector(
            "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__size"
          );

          let T = document.querySelector("#top");
          let Gal = Array.from(T!.querySelectorAll("picture"));
          Gal.map((item) => {
            let link = item.querySelector("source")?.srcset;
            console.log(link);
            if (link !== "") ImageLinks.push(link!);
          });

          return {
            Number_Of_Rooms: Rooms
              ? (Rooms as HTMLElement).innerText.split("\n")[1]
              : null,

            square_meters: square_meters
              ? (square_meters as HTMLElement).innerText
              : null,

            property_location: location
              ? (location as HTMLElement).innerText.split("\n").join(" ")
              : null,

            property_price: price
              ? (price as HTMLElement).innerText.split("\n")[1]
              : null,

            article_url: "",
            website_source: "",
            property_pictures: ImageLinks ? ImageLinks : [],

            PhoneNumber: "",
          };
        });

        await this.page!.click(
          "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > button"
        );

        await this.page!?.waitForTimeout(3000);

        let phoneNumber = await this.page!.$eval(
          "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.d-none.d-md-block > div > div > div > div > div > div.mb-2.horizontal-box > div > div.col-12.col-sm-6.contact-footer > div.mb-3.cell-number-box > div > form:nth-child(1) > a",

          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        ArticleData.article_url = this.Links[i];
        ArticleData.website_source = this.source;
        ArticleData.PhoneNumber = phoneNumber;
        console.log(ArticleData);

        this.payload.push(ArticleData);
      } catch (error) {}
    }
  }

  private async CleanUp() {
    this.Logger.info("Closing Down Puppetteer");
    await this.browser!.close();
  }
  public async exec() {
    await this.setup();

    if (this.page !== null) {
      await this.Collect_Links();

      await this.SingleAD();

      await this.CleanUp();

      /*       console.log(this.Links.length);

      console.log(this.payload.length); */

      return this.payload;
    } else {
      /*    console.log("Puppeteer Failed To lunch"); */
      this.Logger.info("Puppeteer Failed To Lunch . ");
      return this.payload;
    }
  }
}

//console.log(await new Nekretinine().exec());
