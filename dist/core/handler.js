import Zida from "../componants/zida2.js";
export default class Handler {
    static scrapers = [
        /*    halou_updated,
        sas_updated,
        Nekretinine_updated, */
        Zida
    ];
    static async exec() {
        for (const scraper of Handler.scrapers) {
            await new scraper().exec();
        }
    }
}
