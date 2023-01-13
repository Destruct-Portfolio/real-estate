import puppeteer, { Browser, Page } from "puppeteer";
import Check_save from "../core/save.js";
import { Ad_Object } from "src/types";


export default class sas_updated {
    private page: Page | null;
    private Browser: Browser | null;
    private payload: Ad_Object[];
    private source: string;
    private Links: string[];
    private numPages: number

    constructor() {
        this.page = null;

        this.Browser = null;

        this.payload = [];

        this.Links = [];

        this.numPages = 5

        this.source =
            "https://sasomange.rs/c/stanovi-prodaja/f/beograd?productsFacets.facets=status%3AACTIVE%2Cflat_advertiser_to_sale%3AVlasnik";
    }

    private async setup() {
        this.Browser = await puppeteer.launch({ headless: true });

        this.page = await this.Browser.newPage();
    }

    public async exec(): Promise<Ad_Object[]> {
        await this.setup()
        let attemempts = 0
        console.log('Bypassing the Cookies ...')
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

        for (var i = 1; i <= this.numPages; i++) {
            try {
                await this.page!.goto(
                    `https://sasomange.rs/c/stanovi-prodaja/f/beograd?currentPage=${i}&productsFacets.facets=flat_advertiser_to_sale%3AVlasnik`,
                    { waitUntil: "networkidle2", timeout: 0 }
                );

                console.log(this.page!.url());

                let PageLinks: string[] = await this.page!.$$eval(
                    "#plpPage > div:nth-child(3) > section > section > section > div.mobile-view.d-sm-none > section:nth-child(5) > ul.grid-view.js-grid-view-item > li.product-single-item",
                    (item) => {
                        let t = item.map((item) => {
                            return item.querySelector("a")!.href;
                        });
                        return t;
                    }
                );

                console.log(PageLinks)

                console.log(`We collected ${PageLinks.length} from ${this.page!.url()}`)
                for (var j = 0; j <= PageLinks.length; j++) {
                    let ArticleData = await this.SingleAD(PageLinks[j])
                    console.log(ArticleData)
                    if (ArticleData !== undefined) new Check_save().Write('sas_updated', ArticleData)
                }


            } catch (error) {
                console.log("Failed To Load")
                if (attemempts <= 3) {
                    console.log(`Failed To load Page :: ${i}`)
                } else {
                    console.log(`Failed To load Page :: ${i} Trying again ... `)
                    console.log(`Number of attempts :: ${attemempts}`)
                    attemempts++
                    i--
                }
            }
        }

        this.payload = []
        await this.CLoseUP()
        return this.payload

    }


    // Scrape AD : AD_Object
    private async SingleAD(link: string): Promise<Ad_Object | undefined> {
        let attemts = 0
        let ID = new URL(link).pathname.split('/')[2]
        let exists = new Check_save().Exists("sas_updated", { id: ID })
        if (!exists) {
            console.log('Scraping AD with ID :: ' + ID)
            while (attemts < 5) {
                await this.page!.goto(link, {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let ArticleData = await this.page!.evaluate(async () => {
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
                            ? (location as HTMLElement).innerText.split("\n").join(" ")
                            : null,

                        Number_Of_Rooms: rooms ? (rooms as HTMLElement).innerText : null,

                        property_pictures: IgLinks,

                        PhoneNumber: "",

                        website_source:
                            "https://sasomange.rs/c/stanovi-prodaja?productsFacets.facets=flat_advertiser_to_sale%3AVlasnik",

                        article_url: "",

                        id: ""
                    };
                });

                let PhoneNumber = await this.page!.click(
                    "#page-wrap > section.product-details-page > div.vue-instance > section > div:nth-child(1) > div > div.buttons-wrapper > button.btn.btn--type-quaternary.contact-phone.js-pdp-call-btn"
                )
                    .then(async () => {
                        await this.page!.waitForTimeout(12000);

                        let PhoneNumber = await this.page!.$eval(
                            "body > div.vfm.vfm--inset.vfm--absolute > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal.number-modal > div > div > div.modal-footer > div > a",
                            (el) => {
                                return (el as HTMLElement).innerText;
                            }
                        );
                        return PhoneNumber;
                    })
                    .catch(() => {
                        console.log("ellement To Click was not Found !!!");
                        return "null";
                    });

                ArticleData.PhoneNumber = PhoneNumber;
                ArticleData.article_url = link;
                ArticleData.id = ID
                let check_null = Object.values(ArticleData).every(value => value != null);
                console.log(check_null)
                if (check_null) {
                    return ArticleData
                } else {
                    attemts++
                }
            }
        } else {
            console.log('AD with ID :: ' + ID + " allready exists")
            return undefined
        }

    }

    private async CLoseUP(): Promise<void> {
        console.log('CLosing Down Browser and Page for SAS ')
        await this.page!.close()
        await this.Browser!.close()
    }
}