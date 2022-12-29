import puppeteer from "puppeteer";
import Logger from "../misc/logger.js";
import fs from "fs";
export default class Sasomange {
    page;
    Browser;
    payload;
    source;
    Links;
    Logger;
    constructor() {
        this.Logger = new Logger("scrapper", "Sasomange");
        this.page = null;
        this.Browser = null;
        this.payload = [];
        this.Links = [];
        this.source =
            "https://sasomange.rs/c/stanovi-prodaja/f/beograd?productsFacets.facets=status%3AACTIVE%2Cflat_advertiser_to_sale%3AVlasnik";
    }
    async setup() {
        this.Logger.info("Puppeteer launching ... ");
        this.Browser = await puppeteer.launch({ headless: true });
        this.page = await this.Browser.newPage();
    }
    async Bulk() {
        this.Logger.info("Grabing AD links in Multiple Links ... ");
        await this.page.goto(this.source, {
            waitUntil: "networkidle2",
            timeout: 0,
        });
        await this.page.click("body > div.vfm.vfm--inset.vfm--absolute > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal.fullscreen-transparent-modal > div > div > div > button");
        await this.page.waitForTimeout(2000);
        await this.page.click("#CybotCookiebotDialogBodyButtonAccept");
        await this.page.waitForTimeout(10000);
        for (var i = 1; i < 12; i++) {
            try {
                await this.page.goto(`https://sasomange.rs/c/stanovi-prodaja/f/beograd?currentPage=${i}&productsFacets.facets=flat_advertiser_to_sale%3AVlasnik`, { waitUntil: "networkidle2", timeout: 0 });
                console.log(this.page.url());
                let PageLinks = await this.page?.$$eval("#plpPage > div:nth-child(3) > section > section > section > div.mobile-view.d-sm-none > section:nth-child(5) > ul.grid-view.js-grid-view-item > li.product-single-item", (item) => {
                    let t = item.map((item) => {
                        return item.querySelector("a").href;
                    });
                    return t;
                });
                PageLinks?.map((link) => {
                    this.Links.push(link);
                });
                console.log(PageLinks);
            }
            catch (error) { }
        }
    }
    async SingleAD() {
        this.Logger.info("Starting Scraping For each AD Link Collected ... ");
        try {
            for (var i = 0; i < this.Links.length; i++) {
                await this.page.goto(this.Links[i], {
                    waitUntil: "networkidle2",
                    timeout: 0,
                });
                let GrabData = await this.page.evaluate(async () => {
                    let IgLinks = [];
                    let price = document.querySelector("#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > div > div.price-and-info-wrapper > div.price-share-wrapper > p > span.price-content");
                    let m2 = document.querySelector("#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(1) > p.value");
                    let location = document.querySelector("#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > div.vue-instance.product-vendor-info-wrapper > section > section.product-location.with-map > ul");
                    let rooms = document.querySelector("#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended > section > section.pdp-main > div > section > ul > li:nth-child(2) > p.value > span");
                    let T = document.querySelector("#page-wrap > section.product-details-page > div.container > section.sidebar-right-layout-extended");
                    let Gal = Array.from(T.querySelectorAll("img.pointer"));
                    Gal.map((item) => {
                        console.log(item.src);
                        IgLinks.push(item.src);
                    });
                    return {
                        property_price: price ? price.innerText : null,
                        square_meters: m2 ? m2.innerText : null,
                        property_location: location
                            ? location.innerText.split("\n").join(" ")
                            : null,
                        Number_Of_Rooms: rooms ? rooms.innerText : null,
                        property_pictures: IgLinks,
                        PhoneNumber: "",
                        website_source: "https://sasomange.rs/c/stanovi-prodaja?productsFacets.facets=flat_advertiser_to_sale%3AVlasnik",
                        article_url: "",
                        id: ""
                    };
                });
                let PhoneNumber = await this.page.click("#page-wrap > section.product-details-page > div.vue-instance > section > div:nth-child(1) > div > div.buttons-wrapper > button.btn.btn--type-quaternary.contact-phone.js-pdp-call-btn")
                    .then(async () => {
                    await this.page.waitForTimeout(12000);
                    let PhoneNumber = await this.page.$eval("body > div.vfm.vfm--inset.vfm--absolute > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal.number-modal > div > div > div.modal-footer > div > a", (el) => {
                        return el.innerText;
                    });
                    return PhoneNumber;
                })
                    .catch(() => {
                    console.log("ellement To Click was not Found !!!");
                    return "null";
                });
                GrabData.PhoneNumber = PhoneNumber;
                GrabData.article_url = this.Links[i];
                GrabData.id = new URL(this.Links[i]).pathname.split('/')[2];
                console.log(GrabData);
                this.payload.push(GrabData);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async cleanUp() {
        this.Logger.info("Closing Down Puppetteer");
        await this.Browser.close();
    }
    async exec() {
        await this.setup();
        if (this.page !== null) {
            await this.Bulk();
            await this.SingleAD();
            await this.cleanUp();
            fs.writeFileSync('../data/sas_updated.json', JSON.stringify(this.payload));
            return this.payload;
        }
        else {
            this.Logger.info("Puppeteer Failed To Lunch . ");
            return this.payload;
        }
    }
}
console.log(await new Sasomange().exec());
