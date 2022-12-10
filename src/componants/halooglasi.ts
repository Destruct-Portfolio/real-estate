import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object } from "src/types";

export class halooglasi {
  private payload: Ad_Object[];
  private source: string;
  private browser: Browser | null;
  private page: Page | null;
  private links: string[];
  private Page_Numbers: number;
  constructor() {
    this.links = [];
    this.payload = [];
    this.source =
      "https://www.halooglasi.com/nekretnine/prodaja-stanova/beograd?oglasivac_nekretnine_id_l=387237";
    this.browser = null;
    this.page = null;
    this.Page_Numbers = 0;
  }

  private async setup() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  private async Bulk() {
    await this.page!.goto(this.source, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    try {
      let Page_Numbers = await this.page!.$eval(
        "#pager-1 > ul > li:nth-child(8) > a",
        (el) => el.innerHTML
      );

      this.Page_Numbers = parseInt(Page_Numbers);
      console.log(this.Page_Numbers);

      for (var i = 0; i < this.Page_Numbers; i++) {
        try {
          await this.page!.goto(this.source + "&page=" + i, {
            waitUntil: "networkidle2",
            timeout: 0,
          });
          let PageLinks: string[] | undefined = await this.page?.$$eval(
            "#ad-list-2 > div.col-md-12",
            (item) => {
              let t = item.map((item) => {
                return item.querySelector("a")!.href;
              });
              return t;
            }
          );
          console.log(PageLinks);
          if (PageLinks !== undefined) {
            PageLinks.map((url) => {
              this.links.push(url);
            });
          } else {
            this.Page_Numbers = 20;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  private async singleADD() {
    for (var i = 0; i < this.links.length; i++) {
      try {
        await this.page!.goto(this.links[i], {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        let PhoneNumber = await this.page!.click(
          "#plh70 > div > p > span > em"
        );

        await this.page!.waitForTimeout(3000);

        let Phonenmber2 = await this.page!.$eval("#plh70 > a", (el) => {
          return (el as HTMLElement).innerText;
        });

        let ArticleData = await this.page!.evaluate(() => {
          let Rooms = document.querySelector("#plh13");
          let meter = document.querySelector("#plh12");
          let location = document.querySelector("#plh3");
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
            Number_Of_Rooms: Rooms ? (Rooms as HTMLElement).innerText : null,
            square_meters: meter ? (meter as HTMLElement).innerText : null,
            property_location: location
              ? (location as HTMLElement).innerText
              : null,
            property_price: price ? (price as HTMLElement).innerText : null,
            article_url: "",
            website_source: "",
            property_pictures: images ? images : null,
            PhoneNumber: "",
          };
        });

        ArticleData.article_url = this.links[i];
        ArticleData.website_source = this.source;
        ArticleData.PhoneNumber = Phonenmber2;

        console.log(ArticleData);

        this.payload.push(ArticleData);
      } catch (error) {}
    }
  }
  private async CleenUp() {
    await this.browser!.close();
  }
  public async exec() {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();
      console.log(this.links.length);
      await this.singleADD();
      console.log(this.links.length);
      console.log(this.payload.length);
      await this.CleenUp();
      return this.payload;
    } else {
      return this.payload;
    }
  }
}

// console.log(await new halooglasi().exec());
