import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object } from "src/types";
import Logger from "../misc/logger.js";

export class Sasomange {
  private page: Page | null;
  private Browser: Browser | null;
  private payload: Ad_Object[];
  private source: string;
  private Links: string[];
  private Logger: Logger;
  constructor() {
    this.Logger = new Logger("scrapper", "Sasomange");

    this.page = null;
    this.Browser = null;
    this.payload = [];
    this.Links = [
      //"https://sasomange.rs/p/130484487/vrsac-na-prodaju-dvoiposoban-stan",
      /*       "https://sasomange.rs/p/121409123/prodajem-stan-u-valjevu",
      "https://sasomange.rs/p/133124313/1-5-stan-famaceutski-fakultet",
      "https://sasomange.rs/p/133119342/stan-79m2-loznica", */
    ];
    this.source =
      "https://sasomange.rs/c/stanovi-prodaja?productsFacets.facets=flat_advertiser_to_sale%3AVlasnik";
  }

  private async setup() {
    this.Logger.info("Puppeteer launching ... ");

    this.Browser = await puppeteer.launch({ headless: false });

    this.page = await this.Browser.newPage();
  }

  private async Bulk() {
    this.Logger.info("Grabing AD links in Multiple Links ... ");

    await this.page!.goto(this.source, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    await this.page!.click(
      "body > div.vfm.vfm--inset.vfm--absolute > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal.fullscreen-transparent-modal > div > div > div > button"
    );

    await this.page!.waitForTimeout(2000);

    await this.page!.click("#CybotCookiebotDialogBodyButtonAccept");

    await this.page!.waitForTimeout(10000);

    for (var i = 1; i < 34; i++) {
      try {
        await this.page!.goto(
          "https://sasomange.rs/c/stanovi-prodaja?currentPage=" +
            i +
            "&productsFacets.facets=flat_advertiser_to_sale%3AVlasnik",
          { waitUntil: "networkidle2", timeout: 0 }
        );

        console.log(this.page!.url());

        let PageLinks: string[] | undefined = await this.page?.$$eval(
          "#plpPage > div:nth-child(3) > section > section > section > div.mobile-view.d-sm-none > section:nth-child(5) > ul.grid-view.js-grid-view-item > li.product-single-item",
          (item) => {
            let t = item.map((item) => {
              return item.querySelector("a")!.href;
            });
            return t;
          }
        );

        PageLinks?.map((link) => {
          this.Links.push(link);
        });

        console.log(PageLinks);
      } catch (error) {}
    }
  }

  private async SingleAD() {
    this.Logger.info("Starting Scraping For each AD Link Collected ... ");

    try {
      for (var i = 0; i < this.Links.length; i++) {
        await this.page!.goto(this.Links[i], {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        let GrabData = await this.page!.evaluate(async () => {
          let IgLinks: string[] = [];
          let price = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > div > div.price-and-info-wrapper > div.price-share-wrapper > p > span.price-content"
          );

          let m2 = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(1) > p.value"
          );

          let location = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > div.vue-instance.product-vendor-info-wrapper > section > section.product-location.with-map > ul"
          );

          let rooms = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(2) > p.value > span"
          );
          let T = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended"
          );
          let Gal = Array.from(T!.querySelectorAll("img.pointer"));
          Gal.map((item) => {
            console.log((item as HTMLImageElement).src);
            IgLinks.push((item as HTMLImageElement).src);
          });

          return {
            property_price: price ? (price as HTMLElement).innerText : null,

            square_meters: m2 ? (m2 as HTMLElement).innerText : null,

            property_location: location
              ? (location as HTMLElement).innerText
              : null,

            Number_Of_Rooms: rooms ? (rooms as HTMLElement).innerText : null,

            property_pictures: IgLinks,

            PhoneNumber: "",

            website_source:
              "https://sasomange.rs/c/stanovi-prodaja?productsFacets.facets=flat_advertiser_to_sale%3AVlasnik",

            article_url: "",
          };
        });

        await this.page!.click(
          "#page-wrap > section.product-details-page > div.vue-instance > section > div:nth-child(1) > div > div.buttons-wrapper > button.btn.btn--type-quaternary.contact-phone.js-pdp-call-btn"
        );

        await this.page!.waitForTimeout(12000);

        let PhoneNumber = await this.page!.$eval(
          "body > div.vfm.vfm--inset.vfm--absolute > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal.number-modal > div > div > div.modal-footer > div > a",
          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        GrabData.PhoneNumber = PhoneNumber;
        GrabData.article_url = this.Links[i];

        this.payload.push(GrabData);

        console.log(GrabData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  private async cleanUp() {
    this.Logger.info("Closing Down Puppetteer");
    await this.Browser!.close();
  }

  public async exec() {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();

      await this.SingleAD();

      await this.cleanUp();

      /*       console.log(this.Links.length);
      console.log(this.payload.length); */

      return this.payload;
    } else {
      //console.log("Browser Failed To Load");

      this.Logger.info("Puppeteer Failed To Lunch . ");

      return this.payload;
    }
  }
}

console.log(await new Sasomange().exec());
