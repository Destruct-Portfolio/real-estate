import puppeteer, { Browser, Page, Puppeteer } from "puppeteer";
import { Ad_Object } from "src/types";
class Nek {
  private browser: Browser | null;

  private page: Page | null;

  private Links: string[];

  private source: string;

  private payload: Ad_Object[];

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

  private async setup() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  private async Collect_Links() {
    await this.page!.goto(this.source, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    for (var i = 0; i < 5; i++) {
      try {
        await this.page!.goto(this.source + "/" + i + "/", {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        console.log(this.page!.url());
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
        console.log(error);
      }
    }
  }

  private async SingleAD() {
    for (var i = 0; i < this.Links.length; i++) {
      try {
        await this.page!.goto(this.Links[i], {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        let property_location = await this.page!.$eval(
          "#lokacija > div.property__location",
          (el) => {
            return (el as HTMLElement).innerText.split("\n").join(" ");
          }
        );
        // console.log(property_location);

        let NumberofRooms = await this.page!.$eval(
          "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div:nth-child(6) > div > ul > li:nth-child(2) > span",
          (el) => {
            return (el as HTMLElement).innerText.split("\n")[1];
          }
        );
        //console.log(NumberofRooms);

        let property_price = await this.page!.$eval(
          "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__price",
          (el) => {
            return (el as HTMLElement).innerText.split("\n")[0];
          }
        );
        //console.log(property_price);

        let square_meters = await this.page!.$eval(
          "body > div:nth-child(19) > div:nth-child(9) > div.row > div.property__body.col-lg-8.col-xl-9.mb-3 > div.stickyBox > div.stickyBox__price-size > h4.stickyBox__size",

          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        //console.log(square_meters);

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
        //console.log(phoneNumber);

        let ImageLinks = await this.page!.evaluate(() => {
          let links: string[] = [];
          let T = document.querySelector("#top");
          let Gal = Array.from(T!.querySelectorAll("picture"));
          Gal.map((item) => {
            let link = item.querySelector("source")?.srcset;
            console.log(link);
            if (link !== "") links.push(link!);
          });
          return links;
        });

        //console.log(ImageLinks);

        let FinalObject: Ad_Object = {
          Number_Of_Rooms: NumberofRooms ? NumberofRooms : null,
          square_meters: square_meters ? square_meters : null,
          property_location: property_location ? property_location : null,
          property_price: property_price ? property_price : property_price,
          article_url: this.Links[i],
          website_source: this.source,
          property_pictures: ImageLinks ? ImageLinks : [],
          PhoneNumber: phoneNumber ? phoneNumber : null,
        };

        console.log(FinalObject);

        this.payload.push(FinalObject);
      } catch (error) {}
    }
  }

  public async exec() {
    await this.setup();
    if (this.page !== null) {
      await this.Collect_Links();
      await this.SingleAD();
      return this.payload;
    } else {
      console.log("Puppeteer Failed To lunch");
    }
  }
}

console.log(await new Nek().exec());
