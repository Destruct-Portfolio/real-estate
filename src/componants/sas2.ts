import puppeteer, { Browser, Page } from "puppeteer";
import { Ad_Object } from "src/types";

class Sas2 {
  private page: Page | null;
  private Browser: Browser | null;
  private payload: Ad_Object[];
  private source: string;
  private Links: string[];
  constructor() {
    this.page = null;
    this.Browser = null;
    this.payload = [];
    this.Links = [
      "https://sasomange.rs/p/130484487/vrsac-na-prodaju-dvoiposoban-stan",
      "https://sasomange.rs/p/121409123/prodajem-stan-u-valjevu",
      "https://sasomange.rs/p/133124313/1-5-stan-famaceutski-fakultet",
      "https://sasomange.rs/p/133119342/stan-79m2-loznica",
    ];
    this.source =
      "https://sasomange.rs/c/stanovi-prodaja?productsFacets.facets=flat_advertiser_to_sale%3AVlasnik";
  }

  private async setup() {
    this.Browser = await puppeteer.launch({ headless: false });
    this.page = await this.Browser.newPage();
  }

  private async Bulk() {
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

    for (var i = 1; i < 5; i++) {
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
    try {
      for (var i = 0; i < this.Links.length; i++) {
        await this.page!.goto(this.Links[i], {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        let Price = await this.page!.$eval(
          "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > div > div.price-and-info-wrapper > div.price-share-wrapper > p > span.price-content",
          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        console.log(Price);

        let m2 = await this.page!.$eval(
          "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(1) > p.value",
          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        console.log(m2);
        let location = await this.page!.$eval(
          "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > div.vue-instance.product-vendor-info-wrapper > section > section.product-location.with-map > ul",
          (el) => {
            return (el as HTMLElement).innerText;
          }
        );

        console.log(location);
        let rooms = await this.page!.$eval(
          "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(2) > p.value > span",
          (el) => {
            return (el as HTMLElement).innerText;
          }
        );
        console.log(rooms);

        let ImageLinks = await this.page!.evaluate(() => {
          let links: string[] = [];
          let T = document.querySelector(
            "#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended"
          );
          let Gal = Array.from(T!.querySelectorAll("img.pointer"));
          Gal.map((item) => {
            /*   let link = item.querySelector("source")?.srcset;
            console.log(link);
            if (link !== "") links.push(link!); */
            console.log((item as HTMLImageElement).src);
            links.push((item as HTMLImageElement).src);
          });

          return links;
        });

        console.log(ImageLinks);

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

        console.log(PhoneNumber);
        this.payload.push({
          Number_Of_Rooms: rooms,
          square_meters: m2,
          property_location: location,
          property_price: Price,
          article_url: this.Links[i],
          website_source: this.source,
          property_pictures: ImageLinks,
          PhoneNumber: PhoneNumber,
        });
      }
    } catch (error) {}
  }

  public async exec() {
    await this.setup();
    if (this.page !== null) {
      await this.Bulk();
      await this.SingleAD();
    } else {
      console.log("Browser Failed To Load");
    }
  }
}

console.log(await new Sas2().exec());
